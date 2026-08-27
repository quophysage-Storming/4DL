'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'How do I download 4K videos using 4DL?',
    answer: 'Copy the URL link of the video from YouTube, TikTok, or Snapchat, paste it into the 4DL search box, and click "Fetch Video". Select your preferred resolution (e.g. 4K 2160p) and click Download.',
  },
  {
    question: 'Are TikTok and Snapchat videos downloaded cleanly?',
    answer: 'Yes, 4DL fetches direct source media streams so videos are saved in full resolution.',
  },
  {
    question: 'Is 4DL completely free to use?',
    answer: 'Yes, 4DL is free with no account registration or subscriptions required.',
  },
  {
    question: 'Can I download audio only?',
    answer: 'Yes, select the Audio Only (MP3) option in the quality dropdown to save audio tracks.',
  },
  {
    question: 'Is 4DL compatible with mobile devices?',
    answer: 'Yes, 4DL works directly in iOS Safari, Android Chrome, and desktop web browsers.',
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-10 px-4 max-w-4xl mx-auto border-t border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className="border border-gray-200 rounded overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left p-4 flex items-center justify-between text-sm font-semibold text-gray-900 bg-gray-50 hover:bg-gray-100"
              >
                <span>{faq.question}</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="p-4 text-xs text-gray-600 border-t border-gray-200 leading-relaxed bg-white">
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
