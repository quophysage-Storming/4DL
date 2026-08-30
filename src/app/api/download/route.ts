import { NextRequest, NextResponse } from 'next/server';
import { isValidUrl, streamMedia } from '@/lib/downloader';
import { Readable } from 'stream';

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
  const filename = `${sanitizedTitle}.${extension}`;
  const contentType = isAudio ? 'audio/mpeg' : 'video/mp4';

  try {
    const nodeStream = streamMedia(targetUrl, formatId);
    const webStream = Readable.toWeb(nodeStream) as ReadableStream;

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Download failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
