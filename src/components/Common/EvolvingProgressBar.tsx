"use client";
import React from 'react';

interface EvolvingProgressBarProps {
  level: number;
  progressPercent: number;
  tier?: number;
  color?: string;
  isMax?: boolean;
}

export default function EvolvingProgressBar({ 
  level, 
  progressPercent, 
  tier = 1, 
  color = "#6366f1",
  isMax = false 
}: EvolvingProgressBarProps) {
  
  // Define styles based on tier
  const getBarStyle = () => {
    const width = isMax ? '100%' : `${progressPercent}%`;
    
    if (tier === 3) {
      return {
        width,
        background: `linear-gradient(90deg, ${color}, #fff, ${color})`,
        backgroundSize: '200% 100%',
        boxShadow: `0 0 15px ${color}`,
        animation: 'shimmer 2s infinite linear, divine-pulse 2s infinite ease-in-out'
      };
    }
    
    if (tier === 2) {
      return {
        width,
        backgroundColor: color,
        boxShadow: `0 0 8px ${color}`,
        animation: 'pulse-subtle 3s infinite ease-in-out'
      };
    }
    
    return {
      width,
      backgroundColor: color,
    };
  };

  const getContainerStyle = () => {
    if (tier === 3) {
      return "h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/20 ring-1 ring-yellow-400/30";
    }
    if (tier === 2) {
      return "h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5";
    }
    return "h-1 w-full bg-white/10 rounded-full overflow-hidden";
  };

  return (
    <div className={getContainerStyle()}>
      <div 
        className="h-full transition-all duration-500 ease-out" 
        style={getBarStyle()}
      ></div>
    </div>
  );
}
