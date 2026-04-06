"use client";
import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

interface XianxiaTransitionProps {
  children: React.ReactNode;
  type: 'ink-drop' | 'stagger-cards';
  delay?: number;
}

export default function XianxiaTransition({ children, type, delay = 0 }: XianxiaTransitionProps) {
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (type === 'ink-drop' && textRef.current) {
      // Ink-drop reveal for text characters
      const chars = textRef.current.querySelectorAll('.char');
      if (chars.length > 0) {
        animate(chars, {
          clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'],
          opacity: [0, 1],
          delay: stagger(80, { start: delay }),
          duration: 800,
          easing: 'easeOutQuart'
        });
      }
    }

    if (type === 'stagger-cards' && cardsRef.current) {
      // Staggered entry for novel cards
      const cards = cardsRef.current.children;
      if (cards.length > 0) {
        animate(cards, {
          translateY: [16, 0],
          opacity: [0, 1],
          delay: stagger(150, { start: delay }),
          duration: 1000,
          easing: 'easeOutQuart'
        });
      }
    }
  }, [type, delay]);

  if (type === 'ink-drop') {
    const text = typeof children === 'string' ? children : '';
    return (
      <span ref={textRef} className="inline-block">
        {text.split('').map((char, i) => (
          <span key={i} className="char inline-block whitespace-pre opacity-0 translate-z-0">
            {char}
          </span>
        ))}
      </span>
    );
  }

  return (
    <div ref={cardsRef} className="w-full">
      {children}
    </div>
  );
}
