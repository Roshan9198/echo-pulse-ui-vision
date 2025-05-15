
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AudioLines } from 'lucide-react';

interface BlobVoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const BlobVoiceButton = ({ isListening, onClick }: BlobVoiceButtonProps) => {
  const blobRef = useRef<SVGPathElement>(null);
  
  // Use an effect to animate the blob when listening state changes
  useEffect(() => {
    if (!blobRef.current) return;
    
    // Animation for the blob
    const animateBlob = () => {
      if (!blobRef.current || !isListening) return;
      
      // Random factors for the blob animation
      const points = 8;
      const radius = 65;
      const slice = (Math.PI * 2) / points;
      
      // Generate a path based on random points around a circle
      let path = '';
      for (let i = 0; i < points; i++) {
        const angle = slice * i;
        const randomRadius = radius + (isListening ? (Math.random() * 15 - 7) : 0);
        
        const x = 100 + Math.cos(angle) * randomRadius;
        const y = 100 + Math.sin(angle) * randomRadius;
        
        if (i === 0) {
          path += `M ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      }
      path += ' Z'; // Close the path
      
      // Apply the new path
      blobRef.current.setAttribute('d', path);
      
      // Continue animation if listening
      if (isListening) {
        requestAnimationFrame(animateBlob);
      }
    };
    
    if (isListening) {
      animateBlob();
    } else {
      // Reset to perfect circle when not listening
      const points = 8;
      const radius = 65;
      const slice = (Math.PI * 2) / points;
      
      let path = '';
      for (let i = 0; i < points; i++) {
        const angle = slice * i;
        const x = 100 + Math.cos(angle) * radius;
        const y = 100 + Math.sin(angle) * radius;
        
        if (i === 0) {
          path += `M ${x} ${y}`;
        } else {
          path += ` L ${x} ${y}`;
        }
      }
      path += ' Z'; // Close the path
      blobRef.current.setAttribute('d', path);
    }
  }, [isListening]);

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center transition-all duration-300",
        isListening ? "scale-105" : "hover:scale-102",
      )}
      aria-label={isListening ? "Listening" : "Start listening"}
    >
      {/* SVG Blob */}
      <svg 
        viewBox="0 0 200 200" 
        className="absolute inset-0 w-full h-full"
        style={{ filter: isListening ? 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))' : 'none' }}
      >
        <defs>
          <linearGradient id="blobGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isListening ? "#D3E4FD" : "#F1F1F1"} />
            <stop offset="100%" stopColor={isListening ? "#9b87f5" : "#FFFFFF"} />
          </linearGradient>
        </defs>
        <path
          ref={blobRef}
          d="M 100 35 L 150 50 L 165 100 L 150 150 L 100 165 L 50 150 L 35 100 L 50 50 Z"
          fill="url(#blobGradient)"
          className="transition-colors duration-500"
        />
      </svg>
      
      {/* Icon in center */}
      <AudioLines 
        size={48} 
        className={`relative z-10 transition-colors duration-300 ${
          isListening ? 'text-blue-600' : 'text-gray-700'
        }`} 
      />
      
      {/* Animated glow effect when active */}
      {isListening && (
        <div className="absolute inset-0 rounded-full animate-pulse-glow opacity-30" 
          style={{
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(99, 102, 241, 0) 70%)'
          }}
        />
      )}
    </button>
  );
};

export default BlobVoiceButton;
