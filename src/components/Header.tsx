'use client';

import React from 'react';
import { Download } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-black text-white p-1.5 rounded font-black text-base tracking-widest flex items-center justify-center w-8 h-8">
            4DL
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            4DL <span className="text-xs font-normal text-gray-500 border border-gray-300 px-2 py-0.5 rounded ml-1">4K Video Downloader</span>
          </span>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium text-gray-600">
          <a href="#downloader" className="hover:text-black transition-colors">Downloader</a>
          <a href="#about" className="hover:text-black transition-colors">About</a>
          <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
        </nav>
      </div>
    </header>
  );
}
