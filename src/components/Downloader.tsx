'use client';

import React, { useState } from 'react';
import { Download, Clipboard, AlertCircle, Loader2, X, Check } from 'lucide-react';
import { VideoInfo, FormatOption } from '@/lib/types';

export default function Downloader() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<string>('4k-2160p');
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
        fetchVideoInfo(text);
      }
    } catch {
      setError('Clipboard access denied. Please paste the link manually.');
    }
  };

  const fetchVideoInfo = async (targetUrl: string) => {
    if (!targetUrl.trim()) {
      setError('Please paste a valid video URL.');
      return;
    }
    setLoading(true);
    setError(null);
    setVideoInfo(null);
    setDownloadSuccess(false);

    try {
      const res = await fetch('/api/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch video details.');
      }

      setVideoInfo(data.data);
      if (data.data.formats && data.data.formats.length > 0) {
        setSelectedFormat(data.data.formats[0].formatId);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error fetching video information.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVideoInfo(url);
  };

  const handleDownload = () => {
    if (!videoInfo) return;
    setDownloading(true);

    const selectedFmt = videoInfo.formats.find(f => f.formatId === selectedFormat) || videoInfo.formats[0];
    const directUrl = selectedFmt?.url || videoInfo.url;

    const downloadUrl = `/api/download?url=${encodeURIComponent(directUrl)}&title=${encodeURIComponent(videoInfo.title)}&formatId=${selectedFormat}`;

    const cleanTitle = videoInfo.title.replace(/\.(mp4|mp3|pdf|webm|mov)$/i, '');
    const sanitizedTitle = cleanTitle.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '') || 'video';
    const ext = selectedFormat.includes('mp3') ? 'mp3' : (selectedFmt?.ext || 'mp4');

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${sanitizedTitle}_${selectedFormat}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloading(false);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <section id="downloader" className="py-10 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          Download Videos in 4K Quality
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto">
          Paste link from YouTube, TikTok, Snapchat, Instagram, or X (Twitter) to download high quality video files.
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-sm mb-6">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video link here (YouTube, TikTok, Snapchat)..."
              className="w-full border border-gray-300 rounded px-3.5 py-3 text-sm text-gray-900 focus:outline-none focus:border-black pr-20"
            />
            {url ? (
              <button
                type="button"
                onClick={() => { setUrl(''); setVideoInfo(null); setError(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded border border-gray-300"
              >
                <Clipboard className="w-3.5 h-3.5" /> Paste
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-black hover:bg-gray-800 text-white font-medium text-sm px-6 py-3 rounded disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            <span>Fetch Video</span>
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
          <span className="font-semibold text-gray-700">Supported Sites:</span>
          <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-700">YouTube</span>
          <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-700">TikTok</span>
          <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-700">Snapchat</span>
          <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-700">Instagram</span>
          <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded text-gray-700">X / Twitter</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded text-sm flex items-center gap-2 mb-6">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {videoInfo && (
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            {videoInfo.thumbnail ? (
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full sm:w-48 aspect-video object-cover rounded border border-gray-200 bg-gray-100"
              />
            ) : (
              <div className="w-full sm:w-48 aspect-video rounded border border-gray-200 bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                No Thumbnail Available
              </div>
            )}

            <div className="flex-1 space-y-2">
              <span className="inline-block bg-gray-100 text-gray-800 border border-gray-200 px-2 py-0.5 rounded text-xs font-semibold uppercase">
                {videoInfo.platformName}
              </span>
              <h3 className="text-base font-bold text-gray-900 leading-snug">
                {videoInfo.title}
              </h3>
              {videoInfo.uploader && (
                <p className="text-xs text-gray-500">Uploader: {videoInfo.uploader}</p>
              )}

              <div className="pt-2">
                <label className="text-xs font-medium text-gray-700 block mb-1">Select Quality:</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value)}
                  className="w-full sm:w-auto border border-gray-300 rounded px-3 py-1.5 text-sm bg-white text-gray-900 focus:outline-none focus:border-black"
                >
                  {videoInfo.formats.map((fmt: FormatOption) => (
                    <option key={fmt.formatId} value={fmt.formatId}>
                      {fmt.quality} ({fmt.resolution}) - {fmt.ext.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm px-5 py-2.5 rounded flex items-center gap-2 disabled:opacity-50"
                >
                  {downloadSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Download Initiated</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Download Video</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
