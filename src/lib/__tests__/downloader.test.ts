import { describe, it, expect } from 'vitest';
import { detectPlatform, isValidUrl, getStandardFormats, getRealVideoDetails } from '../downloader';

describe('4DL Video Downloader Core Unit Tests', () => {
  it('detects platforms correctly', () => {
    expect(detectPlatform('https://www.youtube.com/watch?v=dQw4w9WgXcQ').type).toBe('youtube');
    expect(detectPlatform('https://youtu.be/dQw4w9WgXcQ').type).toBe('youtube');
    expect(detectPlatform('https://www.tiktok.com/@user/video/123456789').type).toBe('tiktok');
    expect(detectPlatform('https://www.snapchat.com/spotlight/123456789').type).toBe('snapchat');
    expect(detectPlatform('https://x.com/user/status/123456789').type).toBe('twitter');
    expect(detectPlatform('https://example.com/video.mp4').type).toBe('generic');
  });

  it('validates URLs correctly', () => {
    expect(isValidUrl('https://youtube.com/watch?v=123')).toBe(true);
    expect(isValidUrl('http://tiktok.com/video')).toBe(true);
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
  });

  it('returns standard formats including 4K Ultra HD and populates videoUrl', () => {
    const testUrl = 'https://example.com/video';
    const formats = getStandardFormats('Test Video', testUrl);
    expect(formats.length).toBeGreaterThan(0);
    const has4k = formats.some((f) => f.formatId === '4k-2160p');
    expect(has4k).toBe(true);
    expect(formats[0].url).toBe(testUrl);
  });

  it('extracts real video details with thumbnail and populated format URLs matching target URL', async () => {
    const testUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    const info = await getRealVideoDetails(testUrl);
    expect(info.platform).toBe('youtube');
    expect(info.title).toContain('Rick Astley');
    expect(info.thumbnail).toBeTruthy();
    expect(info.formats.length).toBeGreaterThan(0);
    expect(info.formats[0].url).toBe(testUrl);
  }, 15000);
});
