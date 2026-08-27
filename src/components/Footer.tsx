'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto space-y-4">
        <p className="font-semibold text-slate-400">
          OmniDownload &copy; {new Date().getFullYear()} — Universal 4K Video Downloader. All rights reserved.
        </p>
        <p className="max-w-2xl mx-auto leading-relaxed">
          Disclaimer: OmniDownload is an independent media utility and is not affiliated with, endorsed by, or associated with YouTube, TikTok, Snapchat, Instagram, X (Twitter), or Vimeo. All trademarks belong to their respective owners.
        </p>
      </div>
    </footer>
  );
}
