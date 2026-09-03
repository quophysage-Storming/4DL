import { NextRequest, NextResponse } from 'next/server';
import { isValidUrl } from '@/lib/downloader';
import { promisify } from 'util';
import { execFile } from 'child_process';

const execFileAsync = promisify(execFile);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  const formatId = (searchParams.get('formatId') || '4k-2160p').trim();
  const title = searchParams.get('title') || 'video';

  if (!targetUrl || !isValidUrl(targetUrl)) {
    return NextResponse.json(
      { error: 'Valid URL parameter is required' },
      { status: 400 }
    );
  }

  const isAudio = formatId.includes('mp3');
  const extension = isAudio ? 'mp3' : 'mp4';
  const cleanTitle = title.replace(/\.(mp4|mp3|pdf|webm|mov)$/i, '');
  const sanitizedTitle = cleanTitle.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '') || 'video';
  const filename = `${sanitizedTitle}_${formatId}.${extension}`;
  const contentType = isAudio ? 'audio/mpeg' : 'video/mp4';

  // Try to resolve a direct media URL using yt-dlp and stream that.
  try {
    // Choose a format specifier that prefers a single merged file when possible.
    const formatSpecifier = isAudio
      ? 'bestaudio'
      : formatId === '4k-2160p'
      ? 'best[height>=2160]/best'
      : 'best';

    // Use yt-dlp -g to print the direct URL(s). We request a single URL when possible.
    const args = ['-g', '-f', formatSpecifier, targetUrl.trim()];
    const { stdout } = await execFileAsync('yt-dlp', args, { timeout: 60_000 });

    const urls = stdout.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    if (urls.length > 0) {
      // Prefer the first URL. In most cases -f will return a single playable URL.
      const mediaUrl = urls[0];

      // If it's a data URL or invalid, fall through to other strategies
      if (/^https?:\/\//i.test(mediaUrl)) {
        const upstreamRes = await fetch(mediaUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });

        if (upstreamRes.ok && upstreamRes.body) {
          const upstreamContentType = upstreamRes.headers.get('content-type') || contentType;
          if (!upstreamContentType.includes('text/html') && !upstreamContentType.includes('pdf')) {
            return new NextResponse(upstreamRes.body as any, {
              status: 200,
              headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'X-Content-Type-Options': 'nosniff',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
              },
            });
          }
        }
      }
    }
  } catch (err) {
    // If yt-dlp isn't available or fails, we'll try to stream the target URL directly as a fallback.
    // Intentionally fall through to the next strategy.
    console.warn('yt-dlp resolution failed:', (err as Error)?.message || err);
  }

  // If the targetUrl is already a direct media file (mp4/webm/mov/mp3/m4a), try streaming it directly.
  try {
    if (/\.(mp4|webm|mov|mp3|m4a|aac)(\?.*)?$/i.test(targetUrl) || targetUrl.includes('googlevideo.com') || targetUrl.includes('cdn')) {
      const upstreamRes = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (upstreamRes.ok && upstreamRes.body) {
        const upstreamContentType = upstreamRes.headers.get('content-type') || contentType;
        if (!upstreamContentType.includes('text/html') && !upstreamContentType.includes('pdf')) {
          return new NextResponse(upstreamRes.body as any, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${filename}"`,
              'X-Content-Type-Options': 'nosniff',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
          });
        }
      }
    }
  } catch {
    // proceed to final fallback
  }

  // Final fallback: inform the client we couldn't resolve a downloadable stream.
  return NextResponse.json({ error: 'Failed to resolve a downloadable media stream for the provided URL. Ensure yt-dlp is installed on the server and the URL is from a supported platform.' }, { status: 502 });
}
