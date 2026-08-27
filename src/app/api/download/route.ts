import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
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

  const isAudio = formatId.includes('mp3') || formatId.includes('audio');
  const extension = isAudio ? 'mp3' : 'mp4';
  const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'video';
  const filename = `${sanitizedTitle}_${formatId}.${extension}`;

  // If targetUrl is a direct media file URL, try fetching directly
  if (/\.(mp4|webm|mov|mp3|m4a|aac)(\?.*)?$/i.test(targetUrl)) {
    try {
      const upstreamRes = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (upstreamRes.ok && upstreamRes.body) {
        const contentType = upstreamRes.headers.get('content-type') || (isAudio ? 'audio/mpeg' : 'video/mp4');
        if (!contentType.includes('text/html')) {
          return new NextResponse(upstreamRes.body as any, {
            status: 200,
            headers: {
              'Content-Type': contentType,
              'Content-Disposition': `attachment; filename="${filename}"`,
              'Cache-Control': 'no-cache',
            },
          });
        }
      }
    } catch {
      // Proceed to yt-dlp execution
    }
  }

  // Determine yt-dlp format specification based on requested format
  let formatSpec = '18/22/b/best';
  if (isAudio) {
    formatSpec = 'ba/bestaudio/b/best';
  } else if (formatId === '4k-2160p') {
    formatSpec = 'best[height<=2160]/18/22/b/best';
  } else if (formatId === '1080p') {
    formatSpec = 'best[height<=1080]/18/22/b/best';
  } else if (formatId === '720p') {
    formatSpec = 'best[height<=720]/18/22/b/best';
  } else if (formatId === '480p') {
    formatSpec = 'best[height<=480]/18/22/b/best';
  }

  const ytdlpArgs = [
    '-o', '-',
    '-f', formatSpec,
    '--no-playlist',
    '--js-runtimes', 'node',
    '--remote-components', 'ejs:github',
    targetUrl,
  ];

  try {
    const proc = spawn('yt-dlp', ytdlpArgs);

    let streamStarted = false;

    const stream = new ReadableStream({
      start(controller) {
        proc.stdout.on('data', (chunk: Buffer) => {
          streamStarted = true;
          controller.enqueue(new Uint8Array(chunk));
        });

        proc.stdout.on('end', () => {
          try {
            controller.close();
          } catch {
            // Controller might already be closed
          }
        });

        proc.stdout.on('error', (err) => {
          try {
            controller.error(err);
          } catch {
            // Controller error handling
          }
        });

        proc.on('error', (err) => {
          if (!streamStarted) {
            try {
              controller.error(err);
            } catch {
              // ignore
            }
          }
        });
      },
      cancel() {
        proc.kill();
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': isAudio ? 'audio/mpeg' : 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed to download video stream';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
