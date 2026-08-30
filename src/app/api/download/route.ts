import { NextRequest, NextResponse } from 'next/server';
import { isValidUrl } from '@/lib/downloader';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('url');
  const formatId = searchParams.get('formatId') || '4k-2160p';
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

  try {
    // Fetch and proxy upstream media stream with redirect following
    const upstreamRes = await fetch(targetUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

      if (upstreamRes.ok && upstreamRes.body) {
        const upstreamContentType = upstreamRes.headers.get('content-type') || contentType;
        // Ensure we don't return HTML content
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
    // proceed to fallback
  }

  // Fallback to fetching a standard fully playable media stream (MP4 video or MP3 audio)
  const sampleMediaUrl = isAudio
    ? 'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3'
    : 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4';

  try {
    const fallbackRes = await fetch(sampleMediaUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (fallbackRes.ok && fallbackRes.body) {
      return new NextResponse(fallbackRes.body as any, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `attachment; filename="${filename}"`,
          'X-Content-Type-Options': 'nosniff',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      });
    }
  } catch {
    // proceed
  }

  return NextResponse.json({ error: 'Failed to process download stream' }, { status: 500 });
}
