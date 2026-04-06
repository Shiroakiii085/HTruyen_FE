"use client";

import React, { useEffect, useState } from 'react';
import anime from 'animejs/lib/anime.es.js';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Just simple fade in
      document.body.style.opacity = '1';
      return;
    }

    // Identify stagger items (like novel cards) built-in anime-stagger-item class
    anime({
      targets: '.anime-stagger-item',
      opacity: [0, 1],
      translateY: [20, 0],
      delay: anime.stagger(150, { start: 500 }),
      easing: 'spring(1, 80, 10, 0)',
      duration: 1000,
    });
    
  }, []);

  return (
    <>
      {/* Ink Drop Spread Overlay (Fades out quickly) */}
      <div 
        className={`fixed inset-0 bg-ink-black z-[100] pointer-events-none transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center ${mounted ? 'opacity-0 scale-[5]' : 'opacity-100 scale-100'}`}
        style={{
           WebkitMaskImage: 'radial-gradient(circle, transparent 10%, black 70%)',
           maskImage: 'radial-gradient(circle, transparent 10%, black 70%)'
        }}
      >
         <div className="text-gold-ancient/20 font-black text-9xl tracking-[0.5em] font-[family-name:var(--font-heading)] blur-md">
            KIẾM LAI CÁC
         </div>
      </div>
      
      {/* Main Content wrapper */}
      <div className={`transition-opacity duration-700 delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </>
  );
}
