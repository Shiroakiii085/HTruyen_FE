"use client";
import React, { useState, useEffect } from 'react';
import { FaTimes, FaGraduationCap, FaChevronRight, FaInfoCircle } from 'react-icons/fa';
import { LEVEL_SYSTEM } from '@/utils/levelSystem';
import EvolvingProgressBar from '../Common/EvolvingProgressBar';

export default function GuidePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hideUntil = localStorage.getItem('hideGuideUntil');
    const now = new Date().getTime();
    
    if (!hideUntil || now > parseInt(hideUntil)) {
      // Delay popup slightly for better UX
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeForever = () => {
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const hideUntil = new Date().getTime() + twentyFourHours;
    localStorage.setItem('hideGuideUntil', hideUntil.toString());
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-2xl bg-surface-bg rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 delay-150">
        
        {/* Header */}
        <div className="p-8 pb-4 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-accent">
              <FaGraduationCap size={20} />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Cẩm nang tu luyện</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase">
              Hệ Thống <span className="text-accent underline decoration-accent/30 underline-offset-8">Cảnh Giới</span>
            </h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-text-dim hover:text-white"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-8 py-4 custom-scrollbar">
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-black text-text-dim uppercase tracking-widest border-b border-white/5">
              <div className="col-span-2">Cấp</div>
              <div className="col-span-10">Thông Tin Cảnh Giới & Tiến Độ</div>
            </div>

            {LEVEL_SYSTEM.map((rank) => {
              const prefixes = [
                "Nhất", "Nhị", "Tam", "Tứ", "Ngũ",
                "Lục", "Thất", "Bát", "Cửu", "Thập",
                "Thập Nhất", "Thập Nhị", "Thập Tam", "Thập Tứ", "Thập Ngũ"
              ];
              const prefix = prefixes[rank.level - 1] + " Cảnh";

              return (
                <div 
                  key={rank.level}
                  className="grid grid-cols-12 gap-4 px-4 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-accent/20 transition-all group overflow-hidden"
                >
                  <div className="col-span-2 flex flex-col items-center justify-center space-y-1">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                       <div className={`absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} style={{ backgroundColor: rank.color }}></div>
                       <img 
                         src={rank.icon} 
                         className="relative w-10 h-10 object-contain drop-shadow-2xl animate-float transition-all duration-300 group-hover:scale-110" 
                         alt={rank.name}
                         onError={(e) => {
                           const target = e.target as HTMLImageElement;
                           target.src = 'https://cdn-icons-png.flaticon.com/512/10331/10331666.png'; // Fallback
                         }}
                       />
                    </div>
                    <span className="text-[10px] font-black text-accent/60">#{rank.level}</span>
                  </div>

                  <div className="col-span-10 flex flex-col justify-center">
                    <div className="flex justify-between items-end mb-2">
                       <div>
                         <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em] mb-1">{prefix}</p>
                         <p className="text-base font-black text-white group-hover:text-accent transition-colors leading-none">{rank.name}</p>
                       </div>
                       <span className="text-[10px] font-bold text-text-dim">
                         {rank.requiredExp === 0 ? "VÔ HẠN" : `${rank.requiredExp.toLocaleString()} XP`}
                       </span>
                    </div>
                    <EvolvingProgressBar 
                      level={rank.level} 
                      progressPercent={85} // Display example
                      tier={rank.tier} 
                      color={rank.color} 
                      isMax={rank.requiredExp === 0}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-6 bg-accent/5 rounded-3xl border border-accent/10 flex gap-4 items-start shadow-inner shadow-accent/5">
             <FaInfoCircle className="text-accent mt-1 shrink-0" />
             <div className="space-y-1">
                <p className="text-xs font-black text-white uppercase tracking-widest">Quy tắc tu luyện</p>
                <p className="text-xs text-text-dim leading-relaxed font-medium">
                  Bạn nhận được <span className="text-accent font-black">10 EXP</span> cho mỗi chương truyện đọc hoàn tất. 
                  Sử dụng kinh nghiệm này để đột phá cảnh giới, từ <span className="text-accent/80 font-black">Phàm Nhân</span> đến <span className="text-white font-black italic underline decoration-accent/30 underline-offset-4 tracking-tighter">Chí Cao Thần Linh!</span>
                </p>
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-4 flex flex-col sm:flex-row gap-4 bg-surface-bg/80 backdrop-blur-md">
          <button 
            onClick={closeForever}
            className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-black text-xs text-text-dim hover:text-text-main uppercase tracking-widest transition-all"
          >
            Đóng trong 24h
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="flex-[2] py-4 bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Bắt Đầu Tu Luyện!
          </button>
        </div>
      </div>
    </div>
  );
}
