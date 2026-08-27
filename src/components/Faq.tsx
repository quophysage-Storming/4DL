'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How do I download 4K videos from YouTube, TikTok, or Snapchat?',
    answer: 'Simply copy the video URL from YouTube, TikTok, or Snapchat, paste it into the URL input box above, and click "Download Now". Select the "4K Ultra HD (2160p)" resolution option and click download to get your high-quality video file.',
  },
  {
    question: 'Can I download videos without TikTok or Snapchat watermarks?',
    answer: 'Yes! Our downloader automatically extracts clean, unwatermarked video streams directly from TikTok and Snapchat so you get pristine 4K / HD quality without platform logos.',
  },
  {
    question: 'Is this video downloader completely free to use?',
    answer: 'Yes, OmniDownload is 100% free with unlimited downloads. There are no registration forms, subscriptions, or hidden fees required.',
  },
  {
    question: 'Can I convert videos to MP3 audio format?',
    answer: 'Absolutely. Choose the "Audio Only (MP3)" format option in the downloader to extract high-bitrate MP3 audio from any video link.',
  },
  {
    question: 'Does this downloader work on mobile phones (iPhone & Android)?',
    answer: 'Yes! OmniDownload is optimized for desktop browsers, iOS Safari, and Android Chrome. You can download videos directly to your camera roll or downloads folder on mobile.',
  },
  {
    question: 'Are there any legal restrictions on downloading videos?',
    answer: 'OmniDownload is designed for personal offline viewing and backup purposes. Please respect copyright laws and the intellectual property rights of content creators when saving media.',
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-4">
          <HelpCircle className="w-4 h-4" /> Clear Answers
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          Frequently Asked Questions (FAQ)
        </h2>
        <p className="text-slate-400 text-base">
          Got questions? Here is everything you need to know about downloading videos in 4K resolution.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-700"
            >
              <button
                type="button"
                onClick={() => toggleAccordion(index)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 font-semibold text-white focus:outline-none"
              >
                <span className="text-base sm:text-lg">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-purple-400 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-6 sm:px-6 text-slate-400 text-sm leading-relaxed border-t border-slate-800/60 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
