"use client";
import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { comicService } from '@/services/comicService';
import { statsService } from '@/services/statsService';
import StoryCard, { ComicItem } from '@/components/Story/StoryCard';
import HeroSection from '@/components/Home/HeroSection';
import GuidePopup from '@/components/Home/GuidePopup';
import XianxiaTransition from '@/components/Layout/XianxiaTransition';
import { FaFire, FaBolt, FaBookOpen, FaStar, FaChartLine } from 'react-icons/fa';

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['homeComics'],
    queryFn: comicService.getHome,
  });

  const { data: mostReadData } = useQuery({
    queryKey: ['mostRead'],
    queryFn: statsService.getMostRead,
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

  // Most Read Logic: Use internal stats if available, otherwise fallback to global hot
  const hotComics = mostReadData && mostReadData.length > 0 
    ? mostReadData
        .filter(stat => {
          const slug = stat.comicSlug.toLowerCase();
          const name = stat.comicName.toLowerCase();
          const FORBIDDEN_KEYWORDS = ['ngôn tình', 'đam mỹ', 'romance', 'shoujo', 'gender bender', 'yuri', 'yaoi'];
          return !FORBIDDEN_KEYWORDS.some(kw => name.includes(kw) || slug.includes(kw));
        })
        .map(stat => ({
          _id: stat.comicSlug,
          slug: stat.comicSlug,
          name: stat.comicName,
          thumb_url: stat.thumbUrl,
          chaptersLatest: [], // Chapter info not available in stats
          status: '',
          category: [],
          updatedAt: stat.lastReadAt,
          origin_name: []
        } as any)).slice(0, 12)
    : items.slice(0, 12);

  const featuredComics = items.slice(0, 5);
  const newComics = items.slice(6, 24);
  const fullComics = items.slice(18, 30);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-8 md:py-12">
      
      {/* Spotlight / Hero */}
      <HeroSection comics={featuredComics} imageDomain={APP_DOMAIN_CDN_IMAGE} />

      {/* Hot Section */}
      <section className="mb-20 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-gold-ancient/5 rounded-full blur-3xl -z-10 -translate-y-1/2 -translate-x-1/2"></div>
        <div className="flex items-center justify-between mb-8 pb-4 relative">
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-ink-deep to-transparent opacity-80" style={{ filter: 'url(#ink-roughness)' }}></div>
          {/* SVG filter hidden at the top of the body or here to simulate ink bleed */}
          <svg width="0" height="0" className="absolute">
            <filter id="ink-roughness">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </svg>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] bg-gold-ancient/10 rounded-full border border-gold-dim/30 shadow-[inset_0_0_10px_rgba(201,168,76,0.1)] flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gold-ancient/5 animate-pulse"></div>
               <FaFire className="text-blood-sect relative z-10" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest font-[family-name:var(--font-heading)] drop-shadow-sm">
                <XianxiaTransition type="ink-drop">Thịnh Hành</XianxiaTransition>
              </h2>
              <p className="text-[10px] md:text-xs text-mist-gray font-bold uppercase tracking-widest mt-1 italic">Truyện được đọc nhiều nhất</p>
            </div>
          </div>
          <Link href="/truyen-hot" className="text-xs font-black text-gold-dim hover:text-blood-sect hover:underline tracking-widest transition-colors font-[family-name:var(--font-heading)]">XEM TẤT CẢ ›</Link>
        </div>
        <XianxiaTransition type="stagger-cards" delay={200}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {hotComics.map((comic: ComicItem, index: number) => (
              <StoryCard key={`${comic._id}-${index}`} comic={comic} imageDomain={APP_DOMAIN_CDN_IMAGE} />
            ))}
          </div>
        </XianxiaTransition>
      </section>

      {/* New Updates Section */}
      <section className="mb-20 relative">
        <div className="flex items-center justify-between mb-8 pb-4 relative">
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-ink-deep to-transparent opacity-80" style={{ filter: 'url(#ink-roughness)' }}></div>
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] bg-heaven-blue/10 rounded-full border border-heaven-blue/30 shadow-[inset_0_0_10px_rgba(44,74,110,0.1)] flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-heaven-blue/5 animate-pulse"></div>
               <FaBolt className="text-heaven-blue relative z-10" />
             </div>
             <div>
               <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest font-[family-name:var(--font-heading)] drop-shadow-sm">
                 <XianxiaTransition type="ink-drop" delay={400}>Mới Cập Nhật</XianxiaTransition>
               </h2>
               <p className="text-[10px] md:text-xs text-mist-gray font-bold uppercase tracking-widest mt-1 italic">Vừa ra mắt gần đây</p>
             </div>
          </div>
          <Link href="/danh-sach/truyen-moi" className="text-xs font-black text-gold-dim hover:text-heaven-blue hover:underline tracking-widest transition-colors font-[family-name:var(--font-heading)]">XEM TẤT CẢ ›</Link>
        </div>
        <XianxiaTransition type="stagger-cards" delay={600}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
            {newComics.map((comic: ComicItem, index: number) => (
              <StoryCard key={`new-${comic._id}-${index}`} comic={comic} imageDomain={APP_DOMAIN_CDN_IMAGE} />
            ))}
          </div>
        </XianxiaTransition>
      </section>

      {/* Recommendation / Full Comics Section */}
      <section className="mb-20 relative">
        <div className="flex items-center justify-between mb-8 pb-4 relative">
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-ink-deep to-transparent opacity-80" style={{ filter: 'url(#ink-roughness)' }}></div>
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] bg-jade-green/10 rounded-full border border-jade-green/30 shadow-[inset_0_0_10px_rgba(74,124,89,0.1)] flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-jade-green/5 animate-pulse"></div>
               <FaBookOpen className="text-jade-green relative z-10" />
             </div>
             <div>
               <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-widest font-[family-name:var(--font-heading)] drop-shadow-sm">Đã Hoàn Thành</h2>
               <p className="text-[10px] md:text-xs text-mist-gray font-bold uppercase tracking-widest mt-1 italic">Danh sách trọn bộ</p>
             </div>
          </div>
          <Link href="/danh-sach/hoan-thanh" className="text-xs font-black text-gold-dim hover:text-jade-green hover:underline tracking-widest transition-colors font-[family-name:var(--font-heading)]">XEM TẤT CẢ ›</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8">
          {fullComics.map((comic: ComicItem, index: number) => (
            <StoryCard key={`full-${comic._id}-${index}`} comic={comic} imageDomain={APP_DOMAIN_CDN_IMAGE} />
          ))}
        </div>
      </section>

      {/* Manual Rank Guide Popup */}
      <GuidePopup />
    </div>
  );
}
