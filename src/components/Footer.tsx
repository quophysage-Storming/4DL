'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8 px-4 text-center text-gray-500 text-xs">
      <div className="max-w-4xl mx-auto space-y-2">
        <p className="font-medium text-gray-700">
          4DL &copy; {new Date().getFullYear()} — Simple 4K Video Downloader.
        </p>
        <p className="text-gray-500 max-w-xl mx-auto">
          Disclaimer: 4DL is an independent utility and is not affiliated with YouTube, TikTok, Snapchat, Instagram, X (Twitter), or Vimeo.
        </p>
      </div>
    </footer>
  );
}
