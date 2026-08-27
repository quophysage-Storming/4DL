'use client';

import React from 'react';

export default function About() {
  return (
    <section id="about" className="py-10 px-4 max-w-4xl mx-auto border-t border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">About 4DL</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          4DL is a fast and simple video downloading tool. It allows users to extract and save video content from social platforms including YouTube, TikTok, Snapchat, Instagram, X (Twitter), and Vimeo in high quality up to 4K resolution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <h3 className="font-bold text-gray-900 mb-1">4K Resolution</h3>
          <p className="text-gray-600 text-xs">Supports downloading up to 2160p 4K high-definition video files.</p>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <h3 className="font-bold text-gray-900 mb-1">Clean & Direct</h3>
          <p className="text-gray-600 text-xs">Extracts direct video files without unnecessary steps or hidden redirects.</p>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded">
          <h3 className="font-bold text-gray-900 mb-1">Free to Use</h3>
          <p className="text-gray-600 text-xs">100% free web downloader accessible across mobile and desktop devices.</p>
        </div>
      </div>
    </section>
  );
}
