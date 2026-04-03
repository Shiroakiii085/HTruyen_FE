"use client";
import React from 'react';
import Link from 'next/link';
import { ComicItem } from '@/components/Story/StoryCard';
import { FaPlay, FaBookmark, FaInfoCircle } from 'react-icons/fa';

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

  return (
    <section className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden rounded-3xl mb-12 group shadow-2xl">
      {/* Background Image with Parallax-like effect */}
      <div className="absolute inset-0">
        <img 
          src={imageUrl} 
          alt={featured.name}
          className="w-full h-full object-cover object-top scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-bg via-primary-bg/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-primary-bg via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 max-w-3xl space-y-6">
        <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
          <div className="flex items-center space-x-2">
            <span className="glass px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-accent animate-pulse">
              Thịnh hành nhất
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-text-main leading-none drop-shadow-2xl">
            {featured.name}
          </h1>
          <p className="text-text-muted text-sm md:text-lg font-medium line-clamp-3 max-w-xl">
            {featured.origin_name?.[0] || 'Khám phá câu chuyện hấp dẫn đầy kịch tính với hình ảnh sắc nét và nội dung lôi cuốn.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-150">
          <Link 
            href={`/truyen-tranh/${featured.slug}`}
            className="flex items-center space-x-3 bg-accent hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 hover:shadow-xl hover:shadow-accent/30"
          >
            <FaPlay className="text-sm" />
            <span>ĐỌC NGAY</span>
          </Link>
          
          <button className="flex items-center space-x-3 glass hover:bg-white/10 text-text-main px-8 py-4 rounded-2xl font-black transition-all">
            <FaBookmark className="text-sm" />
            <span>THEO DÕI</span>
          </button>

          <Link 
            href={`/truyen-tranh/${featured.slug}`}
            className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl transition-all"
          >
            <FaInfoCircle size={20} />
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 right-10 hidden lg:block">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-0.5 bg-accent/50"></div>
          <span className="text-text-dim text-xs font-black tracking-widest uppercase">HTruyen Spotlight</span>
        </div>
      </div>
    </section>
  );
}
