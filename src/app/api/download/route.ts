import { NextRequest, NextResponse } from 'next/server';
import { isValidUrl } from '@/lib/downloader';
import { getYtDlpAvailable, resolveWithYtDlp } from '@/lib/yt-dlp';
import { promisify } from 'util';
import { execFile } from 'child_process';

const execFileAsync = promisify(execFile);

async function fetchWithRetries(url: string, init: RequestInit = {}, retries = 2, timeout = 30_000) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const res = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(id);

      if (res.status >= 500 && attempt < retries) {
        // retry on server errors
        await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        continue;
      }

      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
    }
  }
  throw new Error('Unreachable');
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  const formatId = (searchParams.get('formatId') || '4k-2160p').trim();
  const title = searchParams.get('title') || 'video';
  const cookieHeader = req.headers.get('cookie') || searchParams.get('cookie') || undefined;
  const rangeHeader = req.headers.get('range') || undefined;

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

  // First attempt: try resolving media URL(s) with yt-dlp if available
  try {
    if (await getYtDlpAvailable()) {
      const resolved = await resolveWithYtDlp(targetUrl.trim(), formatId, cookieHeader);
      if (resolved && resolved.urls && resolved.urls.length > 0) {
        const mediaUrl = resolved.urls[0];
        if (/^https?:\/\//i.test(mediaUrl)) {
          const headers: Record<string, string> = {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          };
          if (cookieHeader) headers['Cookie'] = cookieHeader;
          if (rangeHeader) headers['Range'] = rangeHeader;

          const upstreamRes = await fetchWithRetries(mediaUrl, { headers }, 2, 60_000);

          if ((upstreamRes.status === 200 || upstreamRes.status === 206) && upstreamRes.body) {
            // Forward important headers
            const respHeaders: Record<string, string> = {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${filename}"`,
              'X-Content-Type-Options': 'nosniff',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
            };

            const upstreamContentType = upstreamRes.headers.get('content-type');
            if (upstreamContentType) respHeaders['Content-Type'] = upstreamContentType;

            const contentRange = upstreamRes.headers.get('content-range');
            const acceptRanges = upstreamRes.headers.get('accept-ranges') || 'bytes';
            const contentLength = upstreamRes.headers.get('content-length');

            if (contentRange) respHeaders['Content-Range'] = contentRange;
            if (acceptRanges) respHeaders['Accept-Ranges'] = acceptRanges;
            if (contentLength) respHeaders['Content-Length'] = contentLength;

            return new NextResponse(upstreamRes.body as any, {
              status: upstreamRes.status,
              headers: respHeaders,
            });
          }
        }
      }
    }
  } catch (err) {
    // swallow and fallthrough to direct streaming attempts
    console.warn('yt-dlp resolution or streaming failed:', (err as Error)?.message || err);
  }

  // Second attempt: if targetUrl points to a direct media file, try streaming it (forward Range and cookies)
  try {
    if (/\.(mp4|webm|mov|mp3|m4a|aac)(\?.*)?$/i.test(targetUrl) || targetUrl.includes('googlevideo.com') || targetUrl.includes('cdn')) {
      const headers: Record<string, string> = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      };
      if (cookieHeader) headers['Cookie'] = cookieHeader;
      if (rangeHeader) headers['Range'] = rangeHeader;

      const upstreamRes = await fetchWithRetries(targetUrl, { headers }, 2, 60_000);
      if ((upstreamRes.status === 200 || upstreamRes.status === 206) && upstreamRes.body) {
        const respHeaders: Record<string, string> = {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        };

        const upstreamContentType = upstreamRes.headers.get('content-type');
        if (upstreamContentType) respHeaders['Content-Type'] = upstreamContentType;

        const contentRange = upstreamRes.headers.get('content-range');
        const acceptRanges = upstreamRes.headers.get('accept-ranges') || 'bytes';
        const contentLength = upstreamRes.headers.get('content-length');

        if (contentRange) respHeaders['Content-Range'] = contentRange;
        if (acceptRanges) respHeaders['Accept-Ranges'] = acceptRanges;
        if (contentLength) respHeaders['Content-Length'] = contentLength;

        return new NextResponse(upstreamRes.body as any, {
          status: upstreamRes.status,
          headers: respHeaders,
        });
      }
    }
  } catch (err) {
    console.warn('Direct media streaming failed:', (err as Error)?.message || err);
  }

  // Final fallback: tell client we couldn't resolve a downloadable stream
  return NextResponse.json({ error: 'Failed to resolve a downloadable media stream for the provided URL. Ensure yt-dlp is installed on the server (see /api/health) and the URL is from a supported platform. Optionally provide cookies in the request if the content is restricted.' }, { status: 502 });
}
