import { NextRequest, NextResponse } from 'next/server';
import { isValidUrl, extractVideoDetails } from '@/lib/downloader';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== 'string' || !isValidUrl(url)) {
      return NextResponse.json(
        { error: 'Please provide a valid video URL (e.g. from YouTube, TikTok, Snapchat).' },
        { status: 400 }
      );
    }

    const videoInfo = extractVideoDetails(url);

    return NextResponse.json({
      success: true,
      data: videoInfo,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to parse video details';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
