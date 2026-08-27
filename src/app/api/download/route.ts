import { NextRequest, NextResponse } from 'next/server';
import { spawn, ChildProcess } from 'child_process';
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

  // If targetUrl is a direct media file URL (ends in mp4/webm/mov/mp3/m4a/aac), try fetching directly
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

  const formatSpec = isAudio ? 'ba/bestaudio/b/best' : 'b/best/18/22';
  const env = {
    ...process.env,
    PATH: (process.env.PATH || '') + ':/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
  };

  const trySpawnYtdlp = (args: string[]): Promise<{ proc: ChildProcess | null; firstChunk: Buffer | null }> => {
    return new Promise((resolve) => {
      let proc: ChildProcess;
      try {
        proc = spawn('yt-dlp', args, { env });
      } catch {
        return resolve({ proc: null, firstChunk: null });
      }

      let resolved = false;

      proc.stdout?.once('data', (chunk: Buffer) => {
        if (!resolved) {
          resolved = true;
          resolve({ proc, firstChunk: chunk });
        }
      });

      proc.on('error', () => {
        if (!resolved) {
          resolved = true;
          resolve({ proc: null, firstChunk: null });
        }
      });

      proc.on('close', () => {
        if (!resolved) {
          resolved = true;
          resolve({ proc: null, firstChunk: null });
        }
      });

      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          try { proc.kill(); } catch {}
          resolve({ proc: null, firstChunk: null });
        }
      }, 20000);
    });
  };

  // Primary attempt with format selection
  let { proc, firstChunk } = await trySpawnYtdlp([
    '-o', '-',
    '-f', formatSpec,
    '--no-playlist',
    '--js-runtimes', 'node',
    '--remote-components', 'ejs:github',
    targetUrl,
  ]);

  // Fallback attempt without -f format restriction if primary yielded no stream data
  if (!firstChunk) {
    const fallbackRes = await trySpawnYtdlp([
      '-o', '-',
      '--no-playlist',
      '--js-runtimes', 'node',
      '--remote-components', 'ejs:github',
      targetUrl,
    ]);
    proc = fallbackRes.proc;
    firstChunk = fallbackRes.firstChunk;
  }

  if (!firstChunk || !proc) {
    return NextResponse.json(
      { error: 'Could not fetch video stream from the provided link.' },
      { status: 500 }
    );
  }

  const activeProc = proc;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(firstChunk));

      activeProc.stdout?.on('data', (chunk: Buffer) => {
        try {
          controller.enqueue(new Uint8Array(chunk));
        } catch {
          // Stream controller might be closed
        }
      });

      activeProc.stdout?.on('end', () => {
        try {
          controller.close();
        } catch {
          // Stream controller might be closed
        }
      });

      activeProc.stdout?.on('error', (err) => {
        try {
          controller.error(err);
        } catch {
          // Stream controller error handling
        }
      });
    },
    cancel() {
      try { activeProc.kill(); } catch {}
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
}
