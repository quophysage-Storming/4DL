export type PlatformType = 'youtube' | 'tiktok' | 'snapchat' | 'instagram' | 'twitter' | 'vimeo' | 'facebook' | 'generic';

export interface FormatOption {
  formatId: string;
  quality: string; // e.g. "4K (2160p)", "1080p Full HD", "720p HD", "480p SD", "Audio MP3"
  resolution: string; // e.g. "3840x2160", "1920x1080", "1280x720", "854x480", "Audio"
  ext: string; // "mp4", "webm", "mp3"
  filesize?: string; // e.g. "150 MB"
  url?: string;
  isAudioOnly?: boolean;
}

export interface VideoInfo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  duration: string;
  uploader: string;
  platform: PlatformType;
  platformName: string;
  description?: string;
  formats: FormatOption[];
}

export interface ExtractOptions {
  url: string;
}
