
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface WaveformAnimationProps {
  isActive: boolean;
  className?: string;
}

const WaveformAnimation = ({ isActive, className }: WaveformAnimationProps) => {
  const [bars, setBars] = useState<number[]>([]);
  
  // Generate random number of bars between 10-20
  useEffect(() => {
    const barCount = Math.floor(Math.random() * 10) + 10;
    setBars(Array.from({ length: barCount }, (_, i) => i));
  }, []);

  if (!isActive) {
    return null;
  }

  return (
    <div className={cn("wave-container", className)}>
      {bars.map((_, index) => (
        <div 
          key={index}
          className="wave-bar animate-wave"
          style={{ 
            height: `${Math.random() * 40 + 10}px`,
            animationDuration: `${(Math.random() * 0.8 + 0.6).toFixed(2)}s`,
            animationDelay: `${(Math.random() * 0.5).toFixed(2)}s`
          }}
        />
      ))}
    </div>
  );
};

export default WaveformAnimation;
