'use client';

import React, { useState } from 'react';
import {
  Download,
  Clipboard,
  Sparkles,
  PlayCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Film,
  Music,
  Check,
  X,
  Share2
} from 'lucide-react';
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
      setError('Clipboard access denied or not supported. Please paste manually.');
    }
  };

  const fetchVideoInfo = async (targetUrl: string) => {
    if (!targetUrl.trim()) {
      setError('Please paste or enter a valid video link.');
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
        throw new Error(data.error || 'Failed to extract video data');
      }

      setVideoInfo(data.data);
      if (data.data.formats && data.data.formats.length > 0) {
        setSelectedFormat(data.data.formats[0].formatId);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while analyzing the link';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchVideoInfo(url);
  };

  const handleDownload = async () => {
    if (!videoInfo) return;
    setDownloading(true);

    try {
      const downloadUrl = `/api/download?url=${encodeURIComponent(videoInfo.url)}&formatId=${selectedFormat}&title=${encodeURIComponent(videoInfo.title)}`;

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${videoInfo.title}_${selectedFormat}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch {
      setError('Failed to initiate download. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="downloader" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Title & Tagline */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
          <Sparkles className="w-4 h-4" /> Ultra HD 4K Support for YouTube, TikTok, Snapchat & More
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
          Download HD & <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">4K Videos</span> Instantly
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Paste any link from YouTube, TikTok, Snapchat, Instagram, or Twitter/X. Download watermark-free videos in 4K resolution completely free.
        </p>
      </div>

      {/* Downloader Form Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste video URL here (e.g. YouTube, TikTok, Snapchat)..."
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl px-4 py-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all pr-24"
            />
            {url ? (
              <button
                type="button"
                onClick={() => { setUrl(''); setVideoInfo(null); setError(null); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors"
                title="Clear"
              >
                <X className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700"
              >
                <Clipboard className="w-3.5 h-3.5" /> Paste
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Download Now</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Supported Platforms Badges */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
          <span className="font-semibold text-slate-500">Supported Platforms:</span>
          <span className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md font-medium">YouTube</span>
          <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md font-medium">TikTok</span>
          <span className="px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-md font-medium">Snapchat</span>
          <span className="px-2.5 py-1 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-md font-medium">Instagram</span>
          <span className="px-2.5 py-1 bg-slate-500/10 text-slate-300 border border-slate-500/20 rounded-md font-medium">X (Twitter)</span>
          <span className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md font-medium">Vimeo</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 mb-8">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Video Details Card & Download Options */}
      {videoInfo && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl space-y-6 animate-fadeIn">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative group rounded-xl overflow-hidden w-full md:w-80 flex-shrink-0 bg-slate-950 aspect-video border border-slate-800">
              <img
                src={videoInfo.thumbnail}
                alt={videoInfo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
              <span className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs font-mono text-slate-200">
                {videoInfo.duration}
              </span>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                  {videoInfo.platformName}
                </span>
                <span className="text-xs text-slate-400">{videoInfo.uploader}</span>
              </div>
              <h3 className="text-xl font-bold text-white line-clamp-2">
                {videoInfo.title}
              </h3>
              <p className="text-xs text-slate-400">
                Choose desired quality output: Standard options up to 4K Ultra High Definition (2160p) or MP3 Audio.
              </p>

              {/* Quality Selector List */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-semibold text-slate-300 block">Select Video/Audio Format:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {videoInfo.formats.map((fmt: FormatOption) => (
                    <button
                      key={fmt.formatId}
                      type="button"
                      onClick={() => setSelectedFormat(fmt.formatId)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left text-xs transition-all ${
                        selectedFormat === fmt.formatId
                          ? 'bg-purple-600/20 border-purple-500 text-white font-semibold ring-1 ring-purple-500'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {fmt.isAudioOnly ? <Music className="w-4 h-4 text-pink-400" /> : <Film className="w-4 h-4 text-purple-400" />}
                        <div>
                          <div className="font-medium text-slate-100">{fmt.quality}</div>
                          <div className="text-[10px] text-slate-400">{fmt.resolution} • {fmt.ext.toUpperCase()}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                        {fmt.filesize}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Download Button */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={downloading}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Preparing Download File...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-300" />
                      <span>Download Started!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download Selected Format</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(videoInfo.url);
                    alert('Video link copied to clipboard!');
                  }}
                  className="p-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700"
                  title="Share link"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
