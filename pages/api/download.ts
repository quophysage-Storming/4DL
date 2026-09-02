import type { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

type Data = { ok: boolean; message?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { url } = req.body as { url?: string };
  if (!url || typeof url !== 'string') return res.status(400).json({ ok: false, message: 'Missing url in body' });

  const outDir = path.resolve(process.cwd(), 'downloads');
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  // Validate yt-dlp is available quickly
  try {
    await new Promise<void>((resolve, reject) => {
      const check = spawn('yt-dlp', ['--version']);
      check.on('error', () => reject(new Error('yt-dlp not found in PATH')));
      check.on('close', (code) => (code === 0 ? resolve() : reject(new Error('yt-dlp not available'))));
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, message: err.message || String(err) });
  }

  const outputTemplate = path.join(outDir, '%(title)s.%(ext)s');
  const args = ['-f', 'bestvideo+bestaudio/best', '-o', outputTemplate, url];

  const child = spawn('yt-dlp', args);

  // Pipe child stdout/stderr to server console for logs
  child.stdout?.on('data', (d) => console.log('[yt-dlp stdout]', String(d)));
  child.stderr?.on('data', (d) => console.error('[yt-dlp stderr]', String(d)));

  child.on('error', (err) => {
    console.error('yt-dlp failed:', err);
  });

  child.on('close', (code) => {
    console.log(`yt-dlp exit code: ${code}`);
  });

  // Return immediately with job started. For production, return a job id and implement a status check.
  return res.status(202).json({ ok: true, message: 'Download started on server (check server logs or downloads/)' });
}
