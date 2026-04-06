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
  
  // For now, let's take the first one as the featured comic
  const featured = comics[0];
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
    <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden rounded-[4px] mb-16 shadow-[0_10px_30px_rgba(26,20,16,0.9)] border-y border-gold-dim/40 group">
      {/* Background Image with Ink-Wash Effect */}
      <div className="absolute inset-0 bg-ink-black overflow-hidden relative">
        <img 
          ref={bgRef}
          src="/xianxia_parallax_mountain_1775498137328.png" 
          alt="Mystical Mountains"
          className="absolute -top-[20%] left-0 w-full h-[140%] object-cover object-top scale-105 transition-transform duration-[10s] group-hover:scale-110 ease-out opacity-60 mix-blend-luminosity will-change-transform"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#1a1410_100%)]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-ink-black via-ink-deep/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink-black via-transparent to-transparent opacity-90"></div>
        
        {/* Hero Fog with horizontal drift */}
        <div className="absolute inset-0 z-[1] hero-fog bg-[url('https://www.transparenttextures.com/patterns/foggy-birds.png')] mix-blend-screen opacity-20 pointer-events-none"></div>
        
        {/* Subtle Paper Texture Overlay */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-4xl space-y-8 z-10">
        <div className="space-y-6 translate-y-4 animate-[float_6s_ease-in-out_infinite]">
          <div className="flex items-center space-x-2">
            <span className="bg-blood-sect/10 border border-blood-sect px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] text-blood-sect shadow-[0_0_10px_rgba(139,32,32,0.3)] font-[family-name:var(--font-heading)] rounded-[2px]">
              Chí Tôn Cổ Đế Danh Sách
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-black bg-gradient-to-b from-paper-warm to-gold-dim bg-clip-text text-transparent leading-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-[family-name:var(--font-heading)] tracking-wider">
            <XianxiaTransition type="ink-drop">{featured.name}</XianxiaTransition>
          </h1>
          <div className="relative pl-6 border-l-[3px] border-gold-dim/50 max-w-2xl">
            <div className="absolute top-0 bottom-0 left-[-3px] w-[3px] bg-gradient-to-b from-transparent via-gold-ancient to-transparent"></div>
            <p className="text-mist-gray text-base md:text-xl font-medium line-clamp-3 italic tracking-wide leading-relaxed">
              {featured.origin_name?.[0] || 'Tàn quyển khai mở, vạn giới xưng tôn. Bước lên con đường tu đạo, phá toái hư không, thành tựu tiên hiệp vô thượng.'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 opacity-0 animate-[fadeIn_1.5s_ease-out_0.5s_forwards] mt-8">
          <Link 
            href={`/truyen-tranh/${featured.slug}`}
            className="flex items-center space-x-3 bg-blood-sect hover:bg-blood-sect/90 text-paper-warm px-8 py-4 rounded-[4px] font-black transition-all hover:-translate-y-1 shadow-[0_0_20px_rgba(139,32,32,0.6)] tracking-[0.2em] font-[family-name:var(--font-heading)] border border-blood-sect/80 uppercase text-sm"
          >
            <FaPlay className="text-xs" />
            <span>Đăng Lâm Đỉnh Phong</span>
          </Link>
          
          <button className="flex items-center space-x-3 bg-ink-deep/80 backdrop-blur-md hover:bg-gold-ancient/20 border border-gold-dim/50 text-gold-ancient hover:text-paper-warm px-8 py-4 rounded-[4px] font-black transition-all font-[family-name:var(--font-heading)] tracking-[0.2em] uppercase text-sm hover:shadow-[0_0_15px_rgba(201,168,76,0.3)] hover:-translate-y-1">
            <FaBookmark className="text-xs" />
            <span>Nạp Vào Tu Di</span>
          </button>

          <Link 
            href={`/truyen-tranh/${featured.slug}`}
            className="flex items-center space-x-3 bg-ink-deep/60 backdrop-blur-md hover:bg-gold-ancient/20 border border-gold-dim/30 text-paper-warm px-4 py-4 rounded-xl transition-all"
          >
            <FaInfoCircle size={20} className="text-gold-dim" />
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 right-10 hidden lg:block z-10">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-0.5 bg-gold-ancient/50"></div>
          <span className="text-gold-dim text-xs font-black tracking-widest uppercase font-[family-name:var(--font-heading)] drop-shadow-[0_0_5px_rgba(201,168,76,0.3)]">Kiếm Lai Các</span>
        </div>
      </div>
    </section>
  );
}
