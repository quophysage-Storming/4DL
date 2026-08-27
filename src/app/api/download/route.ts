import { NextRequest, NextResponse } from 'next/server';
import { isValidUrl } from '@/lib/downloader';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const videoUrl = searchParams.get('url');
  const formatId = searchParams.get('formatId') || '4k-2160p';
  const title = searchParams.get('title') || 'video-download';

  if (!videoUrl || !isValidUrl(videoUrl)) {
    return NextResponse.json(
      { error: 'Valid video URL param is required' },
      { status: 400 }
    );
  }

  const isAudio = formatId.includes('mp3');
  const extension = isAudio ? 'mp3' : 'mp4';
  const sanitizedTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `${sanitizedTitle}_${formatId}.${extension}`;

  // Sample MP4 video buffer (synthetic valid minimal MP4 file header) for streaming demonstration
  const sampleVideoData = Buffer.from([
    0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70,
    0x69, 0x73, 0x6f, 0x6d, 0x00, 0x00, 0x02, 0x00,
    0x69, 0x73, 0x6f, 0x6d, 0x69, 0x73, 0x6f, 0x32,
    0x61, 0x76, 0x63, 0x31, 0x6d, 0x70, 0x34, 0x31,
    0x00, 0x00, 0x00, 0x08, 0x66, 0x72, 0x65, 0x65,
  ]);

  const contentType = isAudio ? 'audio/mpeg' : 'video/mp4';

  return new NextResponse(sampleVideoData, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': sampleVideoData.length.toString(),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
