"use client";
import React from 'react';

interface ReadingContainerProps {
  children: React.ReactNode;
  title: string;
  chapterName: string;
  theme: 'paper' | 'night' | 'bamboo';
}

export default function ReadingContainer({ children, title, chapterName, theme }: ReadingContainerProps) {
  const themeClass = theme === 'paper' ? 'parchment-bg' : theme === 'night' ? 'theme-night' : 'theme-bamboo';

  return (
    <div className={`w-full min-h-screen transition-colors duration-700 ${themeClass}`}>
      <div className="max-w-[780px] mx-auto px-6 py-20 relative min-h-screen">
        {/* Ink-Brush Border Frame */}
        <div className="absolute inset-0 pointer-events-none ink-brush-border opacity-30 z-0 scale-[1.02]"></div>
        
        <header className="relative z-10 mb-16 text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
             {/* Red Seal Stamp SVG */}
             <div className="w-12 h-12 flex-shrink-0 animate-pulse">
                <svg viewBox="0 0 100 100" className="w-full h-full text-blood-sect fill-current">
                   <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="4" fill="none" />
                   <text x="50" y="55" fontSize="40" textAnchor="middle" dominantBaseline="middle" className="font-serif font-bold">K.L</text>
                   <path d="M10 10 L30 10 L10 30 Z M90 90 L70 90 L90 70 Z" />
                </svg>
             </div>
             <div className="text-left">
                <h2 className="text-jade-green font-black text-xs uppercase tracking-[0.3em] font-[family-name:var(--font-heading)]">HTruyen • Thư Các</h2>
                <h1 className="text-4xl md:text-5xl font-black font-[family-name:var(--font-heading)] text-ink-black mt-1 drop-shadow-sm">
                  {title}
                </h1>
             </div>
          </div>
          <div className="flex items-center justify-center gap-4 text-ink-deep/60">
             <div className="h-[1px] w-12 bg-gold-ancient/40"></div>
             <span className="text-sm font-bold tracking-widest font-[family-name:var(--font-heading)]">CHƯƠNG {chapterName}</span>
             <div className="h-[1px] w-12 bg-gold-ancient/40"></div>
          </div>
        </header>

        <article className="relative z-10 text-lg md:text-xl leading-relaxed text-ink-black space-y-8 select-text">
          {children}
        </article>

        {/* Decorative Scene Break (Scroll End) */}
        <footer className="mt-24 pb-20 flex flex-col items-center gap-6">
           <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-gold-ancient/40 to-transparent"></div>
           <p className="text-[10px] uppercase tracking-[0.5em] text-gold-dim font-bold font-[family-name:var(--font-heading)]">Kết Thúc Chương</p>
        </footer>
      </div>
    </div>
  );
}
