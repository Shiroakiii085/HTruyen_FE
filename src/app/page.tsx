"use client";
import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { comicService } from '@/services/comicService';
import StoryCard, { ComicItem } from '@/components/Story/StoryCard';
import HeroSection from '@/components/Home/HeroSection';
import { FaFire, FaBolt, FaBookOpen, FaStar } from 'react-icons/fa';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['homeComics'],
    queryFn: comicService.getHome,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16 animate-pulse">
        <div className="w-full h-[60vh] md:h-[80vh] bg-surface-card rounded-3xl"></div>
        {[1, 2].map(i => (
          <div key={i} className="space-y-8">
             <div className="h-8 w-64 bg-surface-card rounded-xl"></div>
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
               {[1,2,3,4,5,6].map(j => <div key={j} className="aspect-[2/3.2] bg-surface-card rounded-2xl"></div>)}
             </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !data || data.status !== 'success') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="glass p-12 rounded-3xl space-y-6 max-w-md">
          <div className="w-20 h-20 bg-red-400/10 rounded-full flex items-center justify-center mx-auto">
            <FaBolt className="text-red-400 text-3xl" />
          </div>
          <h2 className="text-2xl font-black text-text-main uppercase tracking-widest">Mất kết nối</h2>
          <p className="text-text-muted text-sm font-medium">Chúng tôi không thể lấy dữ liệu từ máy chủ. Vui lòng kiểm tra lại đường truyền của bạn.</p>
          <button onClick={() => window.location.reload()} className="bg-accent text-white px-8 py-3 rounded-2xl font-black hover:scale-105 transition-all">THỬ LẠI</button>
        </div>
      </div>
    );
  }

  const { items, APP_DOMAIN_CDN_IMAGE } = data.data;

  // Sections
  const featuredComics = items.slice(0, 5);
  const hotComics = items.slice(0, 12);
  const newComics = items.slice(6, 24);
  const fullComics = items.slice(18, 30);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
      
      {/* Spotlight / Hero */}
      <HeroSection comics={featuredComics} imageDomain={APP_DOMAIN_CDN_IMAGE} />

      {/* Hot Section */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
              <FaFire className="text-accent" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-text-main uppercase tracking-widest">Đang Thịnh Hành</h2>
              <p className="text-[10px] md:text-xs text-text-dim font-black uppercase tracking-tighter">BẮT KỊP XU HƯỚNG MỚI NHẤT</p>
            </div>
          </div>
          <Link href="/danh-sach/truyen-hot" className="text-xs font-black text-accent hover:underline tracking-widest">XEM TẤT CẢ ›</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {hotComics.map((comic: ComicItem, index: number) => (
            <StoryCard key={`${comic._id}-${index}`} comic={comic} imageDomain={APP_DOMAIN_CDN_IMAGE} />
          ))}
        </div>
      </section>

      {/* New Updates Section */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-indigo-400/10 rounded-xl flex items-center justify-center text-indigo-400">
               <FaBolt />
             </div>
             <div>
               <h2 className="text-xl md:text-2xl font-black text-text-main uppercase tracking-widest">Mới Cập Nhật</h2>
               <p className="text-[10px] md:text-xs text-text-dim font-black uppercase tracking-tighter">LUÔN LUÔN TƯƠI MỚI MỖI NGÀY</p>
             </div>
          </div>
          <Link href="/danh-sach/truyen-moi" className="text-xs font-black text-accent hover:underline tracking-widest">XEM TẤT CẢ ›</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {newComics.map((comic: ComicItem, index: number) => (
            <StoryCard key={`new-${comic._id}-${index}`} comic={comic} imageDomain={APP_DOMAIN_CDN_IMAGE} />
          ))}
        </div>
      </section>

      {/* Recommendation / Full Comics Section */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 bg-emerald-400/10 rounded-xl flex items-center justify-center text-emerald-400">
               <FaBookOpen />
             </div>
             <div>
               <h2 className="text-xl md:text-2xl font-black text-text-main uppercase tracking-widest">Đã Hoàn Thành</h2>
               <p className="text-[10px] md:text-xs text-text-dim font-black uppercase tracking-tighter">TRỌN VẸN TỪ ĐẦU ĐẾN CUỐI</p>
             </div>
          </div>
          <Link href="/danh-sach/hoan-thanh" className="text-xs font-black text-accent hover:underline tracking-widest">XEM TẤT CẢ ›</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {fullComics.map((comic: ComicItem, index: number) => (
            <StoryCard key={`full-${comic._id}-${index}`} comic={comic} imageDomain={APP_DOMAIN_CDN_IMAGE} />
          ))}
        </div>
      </section>

    </div>
  );
}
