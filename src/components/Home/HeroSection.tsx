"use client";
import React from 'react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ComicItem } from '@/components/Story/StoryCard';
import { FaPlay, FaBookmark, FaInfoCircle } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import XianxiaTransition from '@/components/Layout/XianxiaTransition';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  comics: ComicItem[];
  imageDomain: string;
}

export default function HeroSection({ comics, imageDomain }: HeroSectionProps) {
  if (!comics || comics.length === 0) return null;
  
  // Keep a fixed default recommendation when available.
  const featured =
    comics.find((comic) => {
      const normalized = String(comic?.name || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      return normalized.includes('ta la ta de');
    }) || comics[0];
  const safeImageDomain = imageDomain || '';
  const imageUrl = safeImageDomain ? `${safeImageDomain}/uploads/comics/${featured.thumb_url}` : '';

  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReducedMotion && bgRef.current) {
      gsap.to(bgRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: bgRef.current.parentElement,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }, []);

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden rounded-2xl mb-16 shadow-2xl border border-white/5 group">
      {/* Background Image with Modern Dark Overlay */}
      <div className="absolute inset-0 bg-[#0a0b14] overflow-hidden">
        <img 
          ref={bgRef}
          src={imageUrl} 
          alt={featured.name}
          className="absolute inset-0 w-full h-full object-cover object-top scale-105 transition-transform duration-[10s] group-hover:scale-110 ease-out opacity-40 blur-[2px] group-hover:blur-0 transition-all"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b14] via-[#0a0b14]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b14] via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-4xl space-y-8 z-10">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <span className="bg-jade-green/10 border border-jade-green/30 px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-widest text-jade-green rounded-full">
              Siêu Phẩm Đề Cử
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl font-[family-name:var(--font-heading)]">
            <XianxiaTransition type="ink-drop">{featured.name}</XianxiaTransition>
          </h1>
          <p className="text-slate-400 text-base md:text-xl font-medium line-clamp-3 leading-relaxed max-w-2xl">
            {featured.origin_name?.[0] || 'Khám phá thế giới truyện tranh đỉnh cao với chất lượng hình ảnh sắc nét và nội dung phong phú nhất.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-8">
          <Link 
            href={`/truyen-tranh/${featured.slug}`}
            className="flex items-center space-x-3 bg-jade-green hover:bg-jade-light text-white px-8 py-4 rounded-xl font-black transition-all hover:-translate-y-1 shadow-lg shadow-jade-green/20 uppercase text-sm tracking-widest"
          >
            <FaPlay className="text-xs" />
            <span>Đọc Ngay</span>
          </Link>
          
          <button className="flex items-center space-x-3 bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/10 text-white px-8 py-4 rounded-xl font-black transition-all uppercase text-sm tracking-widest hover:-translate-y-1">
            <FaBookmark className="text-xs" />
            <span>Theo Dõi</span>
          </button>
        </div>
      </div>

      {/* Decorative Branding */}
      <div className="absolute bottom-10 right-10 hidden lg:block z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-[1px] bg-white/20"></div>
          <span className="text-slate-500 text-xs font-black tracking-widest uppercase font-[family-name:var(--font-heading)]">HTRUYEN</span>
        </div>
      </div>
    </section>
  );
}
