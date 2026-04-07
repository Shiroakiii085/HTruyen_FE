"use client";

import React, { useEffect, useState } from 'react';
import { animate, stagger } from 'animejs';

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
    animate('.anime-stagger-item', {
      opacity: [0, 1],
      translateY: [10, 0],
      delay: stagger(100, { start: 200 }),
      duration: 800,
      easing: 'easeOutQuart',
    });
    
  }, []);

  return (
    <>
      {/* Premium Minimal Splash */}
      <div 
        className={`fixed inset-0 bg-[#0a0b14] z-[100] flex items-center justify-center transition-opacity duration-700 pointer-events-none ${mounted ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className="text-center">
          <div className="text-4xl font-black tracking-[0.4em] text-white animate-pulse">
            HTRUYEN
          </div>
          <div className="h-[2px] w-12 bg-gold-ancient mt-4 mx-auto"></div>
        </div>
      </div>
      
      {/* Main Content wrapper */}
      <div className={`transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </>
  );
}
