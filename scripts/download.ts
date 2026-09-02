import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

function ensureYtDlpAvailable(): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn('yt-dlp', ['--version']);
    p.on('error', () => reject(new Error('yt-dlp not found in PATH. Install with: pip install -U yt-dlp or download the binary.')));
    p.on('close', (code) => (code === 0 ? resolve() : reject(new Error('yt-dlp unavailable (exit ' + code + ')'))));
  });
}

export async function downloadUrl(url: string, outDir = 'downloads'): Promise<void> {
  if (!url) throw new Error('No URL provided.');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  await ensureYtDlpAvailable();

  const outputTemplate = path.join(outDir, '%(title)s.%(ext)s');

  // Ask yt-dlp to pick best video+audio and merge with ffmpeg (fallback: best)
  const args = ['-f', 'bestvideo+bestaudio/best', '-o', outputTemplate, url];

  console.log('Running: yt-dlp', args.join(' '));
  const child = spawn('yt-dlp', args, { stdio: ['ignore', 'pipe', 'pipe'] });

  child.stdout.setEncoding('utf8');
  child.stderr.setEncoding('utf8');

  child.stdout.on('data', (d) => process.stdout.write(d));
  child.stderr.on('data', (d) => process.stderr.write(d));

  await new Promise<void>((resolve, reject) => {
    child.on('error', (err) => reject(err));
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`yt-dlp exited with code ${code}`));
    });
  });
}

if (require.main === module) {
  const url = process.argv[2];
  const outDir = process.argv[3] || 'downloads';
  if (!url) {
    console.error('Usage: node dist/scripts/download.js <video-url> [outDir]');
    process.exit(2);
  }
  downloadUrl(url, outDir)
    .then(() => console.log('Download complete.'))
    .catch((err) => {
      console.error('Download failed:', err.message);
      process.exit(1);
    });
}
