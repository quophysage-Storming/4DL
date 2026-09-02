# 4DL - Video downloader

This repo is a Next.js-based video downloader. I added a CLI helper and a simple API endpoint that use yt-dlp to perform robust downloads.

Prerequisites
- yt-dlp must be installed and in PATH: `pip install -U yt-dlp` or download the binary from https://github.com/yt-dlp/yt-dlp/releases
- ffmpeg must be installed and in PATH to merge video + audio when required
- Node.js 16+ recommended

CLI usage
- Install dev deps: `npm i -D typescript ts-node @types/node`
- Run directly with ts-node: `npx ts-node scripts/download.ts "<video-url>"`
- Or compile and run: `npx tsc` then `node dist/scripts/download.js "<video-url>"`

API usage (local/self-hosted)
- POST /api/download with JSON body `{ "url": "https://..." }` to start a server-side download. This returns immediately with 202 and starts yt-dlp in background. For production, use a background worker and persistent job queue.

Notes
- Serverless platforms (Vercel, Netlify functions) have short timeouts. Avoid long-running child processes in serverless API routes; instead, use a worker.
