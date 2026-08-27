'use client';

import React from 'react';
import { Video, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl text-white shadow-lg shadow-purple-500/20">
            <Video className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            OmniDownload <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">4K Ultra HD</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-400">
          <a href="#downloader" className="hover:text-purple-400 transition-colors">Downloader</a>
          <a href="#features" className="hover:text-purple-400 transition-colors">Features</a>
          <a href="#about" className="hover:text-purple-400 transition-colors">About</a>
          <a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Free & Safe</span>
        </div>
      </div>
    </header>
  );
}
