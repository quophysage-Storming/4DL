'use client';

import React from 'react';
import { Tv, Zap, Shield, Sparkles, CheckCircle2, Flame } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <Tv className="w-6 h-6 text-purple-400" />,
      title: 'Ultra HD 4K Quality',
      description: 'Preserve full resolution visual fidelity with support up to 4K 2160p, 60fps, and crisp audio streaming.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-pink-400" />,
      title: 'Watermark-Free Downloads',
      description: 'Download clean videos from TikTok and Snapchat without intrusive platform watermarks or logos.',
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: 'Instant Fast Processing',
      description: 'Engineered with optimized serverless handlers to fetch download links in seconds without waiting lines.',
    },
    {
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      title: '100% Secure & Anonymous',
      description: 'No account registration, no tracking, and no saved user logs. Your privacy is fully guaranteed.',
    },
  ];

  const platforms = [
    { name: 'YouTube', desc: 'Shorts, 4K Videos, Music Playlists' },
    { name: 'TikTok', desc: 'No-Watermark MP4 & MP3 Audio' },
    { name: 'Snapchat', desc: 'Spotlight & Public Stories' },
    { name: 'Instagram', desc: 'Reels, Posts, and IGTV' },
    { name: 'X / Twitter', desc: 'HD Clips and Media Attachments' },
    { name: 'Vimeo & More', desc: 'High Quality Vimeo & Web Videos' },
  ];

  return (
    <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold mb-4">
          <Flame className="w-4 h-4" /> Why Choose OmniDownload
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          The Premier Universal Video Downloader
        </h2>
        <p className="text-slate-400 text-base leading-relaxed">
          OmniDownload is a modern, high-speed web utility designed to make downloading high-definition media effortless. Whether you need crisp 4K content from YouTube, watermark-free short videos from TikTok and Snapchat, or high-fidelity audio extractions, our service delivers seamless downloads across all devices.
        </p>
      </div>

      {/* Grid of Key Features */}
      <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((item, index) => (
          <div
            key={index}
            className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-purple-500/40 transition-all hover:-translate-y-1 duration-300"
          >
            <div className="p-3 bg-slate-800/80 rounded-xl w-fit mb-4">
              {item.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Platform Compatibility Matrix */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950/20 to-slate-900 border border-slate-800 rounded-2xl p-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Supported Platforms & Compatibility</h3>
          <p className="text-slate-400 text-sm">Full compatibility across desktop browsers (Chrome, Safari, Edge, Firefox) and mobile OS (iOS, Android).</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((p, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-slate-950/50 rounded-xl border border-slate-800/80">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-slate-200 text-sm">{p.name}</div>
                <div className="text-xs text-slate-400">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
