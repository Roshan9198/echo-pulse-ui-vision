
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface WaveformAnimationProps {
  isActive: boolean;
  className?: string;
}

const WaveformAnimation = ({ isActive, className }: WaveformAnimationProps) => {
  const [bars, setBars] = useState<number[]>([]);
  const animationRef = useRef<number | null>(null);
  const barsRef = useRef<HTMLDivElement[]>([]);
  
  // Generate random number of bars between 16-24
  useEffect(() => {
    const barCount = 20;
    setBars(Array.from({ length: barCount }, (_, i) => i));
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Animation for the frequency bars
  useEffect(() => {
    if (!isActive) {
      // Reset bars to minimal height when not active
      barsRef.current.forEach(bar => {
        if (bar) {
          bar.style.height = '5px';
        }
      });
      return;
    }
    
    let lastUpdate = 0;
    const fps = 24;
    const interval = 1000 / fps;
    
    const animate = (timestamp: number) => {
      if (timestamp - lastUpdate > interval) {
        lastUpdate = timestamp;
        
        barsRef.current.forEach(bar => {
          if (bar) {
            // Generate random heights with a more natural pattern
            // Center bars tend to be taller when speaking
            const index = parseInt(bar.dataset.index || '0');
            const centerFactor = 1 - Math.abs((bars.length / 2) - index) / (bars.length / 2);
            const randomFactor = Math.random();
            const combined = (centerFactor * 0.7) + (randomFactor * 0.3);
            
            const height = isActive ? 
              Math.max(5, Math.floor(combined * 50)) : 
              5;
            
            bar.style.height = `${height}px`;
          }
        });
      }
      
      if (isActive) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, bars.length]);

  if (!bars.length) {
    return null;
  }

  return (
    <div className={cn("flex items-end justify-center gap-1 h-16", className)}>
      {bars.map((_, index) => (
        <div 
          key={index}
          ref={el => {
            if (el) barsRef.current[index] = el;
          }}
          data-index={index}
          className="w-1.5 rounded-t-full bg-gradient-to-t from-voice-blue to-purple-300 transition-height"
          style={{ 
            height: '5px',
            transitionProperty: 'height',
            transitionDuration: '100ms'
          }}
        />
      ))}
    </div>
  );
};

export default WaveformAnimation;
