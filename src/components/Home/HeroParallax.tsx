"use client";
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface HeroParallaxProps {
  children: React.ReactNode;
  backgroundImage?: string;
}

export default function HeroParallax({ children, backgroundImage }: HeroParallaxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap.to(mountainRef.current, {
        y: (i, target) => -ScrollTrigger.maxScroll(window) * 0.4, // 0.4x scroll speed
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden min-h-[60vh] flex flex-col items-center justify-center pt-20 pb-32 bg-ink-deep">
      {/* Parallax Mountain Background */}
      <div 
        ref={mountainRef}
        className="absolute top-0 left-0 w-full h-[150%] z-0 pointer-events-none opacity-60 bg-cover bg-center"
        style={{ 
          backgroundImage: `url(${backgroundImage || '/placeholder-mountain.png'})`,
          filter: 'brightness(0.7) contrast(1.2)'
        }}
      />
      
      {/* Fog Overlay */}
      <div className="absolute inset-0 z-[1] hero-fog bg-[url('https://www.transparenttextures.com/patterns/foggy-birds.png')] mix-blend-screen opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl px-4 mx-auto">
        {children}
      </div>

      {/* Ground Vignette */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-ink-deep to-transparent z-[2]" />
    </div>
  );
}
