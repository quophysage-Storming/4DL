import { PlatformType, VideoInfo, FormatOption } from './types';

/**
 * Detects the social video platform based on the input URL.
 */
export function detectPlatform(url: string): { type: PlatformType; name: string } {
  try {
    const parsed = new URL(url.trim());
    const hostname = parsed.hostname.toLowerCase();

    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return { type: 'youtube', name: 'YouTube' };
    }
    if (hostname.includes('tiktok.com')) {
      return { type: 'tiktok', name: 'TikTok' };
    }
    if (hostname.includes('snapchat.com')) {
      return { type: 'snapchat', name: 'Snapchat' };
    }
    if (hostname.includes('instagram.com')) {
      return { type: 'instagram', name: 'Instagram' };
    }
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
      return { type: 'twitter', name: 'X / Twitter' };
    }
    if (hostname.includes('vimeo.com')) {
      return { type: 'vimeo', name: 'Vimeo' };
    }
    if (hostname.includes('facebook.com') || hostname.includes('fb.watch')) {
      return { type: 'facebook', name: 'Facebook' };
    }
    return { type: 'generic', name: 'Web Video' };
  } catch {
    return { type: 'generic', name: 'Web Video' };
  }
}

/**
 * Validates whether the given string is a valid HTTP/HTTPS URL.
 */
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Standard list of quality options for videos, defaulting to 4K Ultra HD as top tier.
 */
export function getStandardFormats(videoTitle: string): FormatOption[] {
  return [
    {
      formatId: '4k-2160p',
      quality: '4K Ultra HD (2160p)',
      resolution: '3840x2160',
      ext: 'mp4',
      filesize: '~250 MB',
    },
    {
      formatId: '1080p',
      quality: 'Full HD (1080p)',
      resolution: '1920x1080',
      ext: 'mp4',
      filesize: '~85 MB',
    },
    {
      formatId: '720p',
      quality: 'HD (720p)',
      resolution: '1280x720',
      ext: 'mp4',
      filesize: '~45 MB',
    },
    {
      formatId: '480p',
      quality: 'SD (480p)',
      resolution: '854x480',
      ext: 'mp4',
      filesize: '~20 MB',
    },
    {
      formatId: 'mp3-audio',
      quality: 'Audio Only (MP3)',
      resolution: 'Audio (320kbps)',
      ext: 'mp3',
      filesize: '~8 MB',
      isAudioOnly: true,
    },
  ];
}

/**
 * Helper to generate mock or extracted video info for fallback/demo streaming when direct API is called.
 */
export function extractVideoDetails(url: string): VideoInfo {
  const platformInfo = detectPlatform(url);
  const videoId = Buffer.from(url).toString('base64').substring(0, 10);

  let sampleTitle = `High Quality 4K Video - ${platformInfo.name}`;
  let sampleThumbnail = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
  let sampleUploader = '@creator';

  if (platformInfo.type === 'youtube') {
    sampleTitle = 'Ultra HD 4K Cinematic Video | Official Upload';
    sampleThumbnail = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80';
    sampleUploader = 'YouTube Creator Channel';
  } else if (platformInfo.type === 'tiktok') {
    sampleTitle = 'Trending TikTok Video (No Watermark 4K / HD)';
    sampleThumbnail = 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1200&q=80';
    sampleUploader = '@tiktok.star';
  } else if (platformInfo.type === 'snapchat') {
    sampleTitle = 'Snapchat Story Spotlight Video';
    sampleThumbnail = 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=1200&q=80';
    sampleUploader = '@snapchat_official';
  }

  return {
    id: videoId,
    title: sampleTitle,
    url: url,
    thumbnail: sampleThumbnail,
    duration: '03:45',
    uploader: sampleUploader,
    platform: platformInfo.type,
    platformName: platformInfo.name,
    formats: getStandardFormats(sampleTitle),
  };
}
