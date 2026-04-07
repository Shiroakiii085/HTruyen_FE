"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { FaTimes, FaSearch } from 'react-icons/fa';

interface ScrollChapterListProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: any[];
  currentChapter: string;
  slug: string;
  theme: 'paper' | 'night' | 'bamboo';
}

export default function ScrollChapterList({ isOpen, onClose, chapters, currentChapter, slug, theme }: ScrollChapterListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = React.useState('');

  useEffect(() => {
    if (!isOpen) return;
    gsap.fromTo(
      scrollRef.current,
      { opacity: 0, y: 20, height: 0 },
      { opacity: 1, y: 0, height: '80vh', duration: 0.35, ease: 'power2.out' }
    );
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, scaleY: 0.95 },
      {
        opacity: 1,
        scaleY: 1,
        duration: 0.25,
        ease: 'power2.out',
        onComplete: () => inputRef.current?.focus()
      }
    );
  }, [isOpen]);

  const filteredChapters = chapters.filter(c => 
    c.chapter_name.toLowerCase().includes(search.toLowerCase())
  );

  const themeClass = theme === 'paper' ? 'bg-slate-800 text-white' : theme === 'night' ? 'bg-ink-black text-mist-gray' : 'bg-[#eef1ec] text-[#2d3e2f]';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center md:justify-end md:pr-12 transition-all duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-paper-warm/60 backdrop-blur-sm transition-opacity duration-300 opacity-100" 
        onClick={onClose}
      />
      
      <div 
        ref={scrollRef}
        className={`w-[calc(100%-2rem)] max-w-sm md:w-80 h-0 opacity-0 relative border-y-8 border-gold-ancient/40 rounded-t-lg rounded-b-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] ${themeClass} z-10 transition-transform duration-300 translate-y-0 overflow-visible`}
      >
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none z-0">
           {/* This inner div will handle the "unrolling" clip if needed, but we let the content be visible */}
        </div>
        {/* Scroll Cylinders (Top/Bottom) */}
        <div className="absolute top-0 left-[-5%] right-[-5%] h-4 bg-gradient-to-b from-bronze-ancient to-gold-ancient/40 rounded-full z-20 shadow-sm border border-gold-ancient/30"></div>
        <div className="absolute bottom-0 left-[-5%] right-[-5%] h-4 bg-gradient-to-t from-bronze-ancient to-gold-ancient/40 rounded-full z-20 shadow-sm border border-gold-ancient/30"></div>

        {/* Scroll Content */}
        <div ref={contentRef} className="h-full pt-4 pb-4 px-3 opacity-0 origin-top flex flex-col">
           <div className="flex items-center justify-between p-3 border-b border-gold-ancient/20">
              <h3 className="font-black font-[family-name:var(--font-heading)] uppercase tracking-widest text-[10px]">Danh sách chương</h3>
              <button onClick={onClose} onMouseDown={(e) => e.stopPropagation()} className="hover:text-blood-sect transition-colors">
                 <FaTimes size={16} />
              </button>
           </div>
           
           <div className="p-3">
               <div className="relative">
                  <input 
                    ref={inputRef}
                    type="text" 
                    placeholder="Tìm chương..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-gold-ancient/20 rounded-xl py-2.5 px-10 text-xs focus:outline-none focus:border-gold-ancient/50 transition-all placeholder:text-text-dim text-text-main shadow-inner"
                  />
                  <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold-ancient/50" size={12} />
               </div>
            </div>

           <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
              {filteredChapters.map((chapter, idx) => (
                <Link
                  key={idx}
                  href={`/doc-truyen/${slug}/${chapter.chapter_name}?api=${chapter.chapter_api_data}`}
                  className={`block px-4 py-3 rounded-lg text-sm transition-all border border-transparent ${
                    chapter.chapter_name === currentChapter 
                    ? 'bg-gold-ancient/20 border-gold-ancient/40 text-blood-sect font-bold shadow-inner' 
                    : 'hover:bg-gold-ancient/10 hover:border-gold-ancient/10'
                  }`}
                  onClick={onClose}
                >
                  <div className="flex items-center justify-between">
                     <span className="font-[family-name:var(--font-heading)]">Chương {chapter.chapter_name}</span>
                     {chapter.chapter_name === currentChapter && <div className="w-1.5 h-1.5 bg-blood-sect rounded-full animate-pulse"></div>}
                  </div>
                </Link>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
