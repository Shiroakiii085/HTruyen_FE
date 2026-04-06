"use client";
import React from 'react';
import { FaFont, FaFillDrip, FaLeaf, FaMoon, FaSun, FaTextHeight } from 'react-icons/fa';

interface ReaderSidebarProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  theme: 'paper' | 'night' | 'bamboo';
  setTheme: (theme: 'paper' | 'night' | 'bamboo') => void;
  fontFamily: 'serif' | 'sans';
  setFontFamily: (font: 'serif' | 'sans') => void;
}

export default function ReaderSidebar({ fontSize, setFontSize, theme, setTheme, fontFamily, setFontFamily }: ReaderSidebarProps) {
  return (
    <aside className="fixed left-6 top-1/2 -translate-y-1/2 z-40 group">
      <div className="bg-ink-deep/90 backdrop-blur-xl border border-gold-dim/30 p-2 rounded-2xl flex flex-col gap-4 shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-[-10px] group-hover:translate-x-0">
        
        {/* Font Size - Bamboo Slider */}
        <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex flex-col items-center gap-3">
           <FaTextHeight className="text-gold-dim text-xs" />
           <div className="h-40 relative group/slider">
              <input 
                type="range" 
                min="14" 
                max="32" 
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="h-full appearance-none bg-transparent cursor-pointer vertical-range-slider"
                style={{
                  WebkitAppearance: 'slider-vertical',
                  writingMode: 'bt-lr'
                } as any}
              />
              {/* Bamboo Segments (Visual Overlay) */}
              <div className="absolute inset-x-0 inset-y-0 pointer-events-none flex flex-col justify-between py-2 items-center">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className="w-2 h-0.5 bg-bamboo-green/40 rounded-full"></div>
                 ))}
              </div>
           </div>
           <span className="text-[10px] font-bold text-gold-ancient">{fontSize}px</span>
        </div>

        {/* Theme Toggles */}
        <div className="flex flex-col gap-2">
           <button 
             onClick={() => setTheme('paper')}
             className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${theme === 'paper' ? 'bg-gold-ancient text-ink-black border-gold-ancient shadow-[0_0_15px_rgba(201,168,76,0.5)]' : 'bg-white/5 text-mist-gray border-white/10 hover:bg-white/10'}`}
             title="Giấy Cổ (Paper)"
           >
             <FaFillDrip size={14} />
           </button>
           <button 
             onClick={() => setTheme('night')}
             className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${theme === 'night' ? 'bg-heaven-blue text-white border-heaven-blue shadow-[0_0_15px_rgba(44,74,110,0.5)]' : 'bg-white/5 text-mist-gray border-white/10 hover:bg-white/10'}`}
             title="Dạ Tôn (Night Stone)"
           >
             <FaMoon size={14} />
           </button>
           <button 
             onClick={() => setTheme('bamboo')}
             className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border ${theme === 'bamboo' ? 'bg-bamboo-green text-white border-bamboo-green shadow-[0_0_15px_rgba(61,90,69,0.5)]' : 'bg-white/5 text-mist-gray border-white/10 hover:bg-white/10'}`}
             title="Trúc Lâm (Bamboo Grove)"
           >
             <FaLeaf size={14} />
           </button>
        </div>

        {/* Font Family Switcher */}
        <button 
          onClick={() => setFontFamily(fontFamily === 'serif' ? 'sans' : 'serif')}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border border-white/10 bg-white/5 text-mist-gray hover:bg-white/10 ${fontFamily === 'serif' ? 'text-gold-ancient' : ''}`}
          title="Đổi Phông Chữ"
        >
          <FaFont size={14} />
        </button>
      </div>

      {/* Sidebar Trigger (Visible Indicator) */}
      <div className="w-1 h-32 bg-gold-ancient/20 rounded-full group-hover:opacity-0 transition-opacity ml-[-8px]"></div>
    </aside>
  );
}
