
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TranscriptionTextProps {
  text: string;
  isListening: boolean;
  className?: string;
}

const TranscriptionText = ({ text, isListening, className }: TranscriptionTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Apply typewriter effect when text changes
  useEffect(() => {
    // If there's no text, reset the display
    if (!text) {
      setDisplayText('');
      setIsTyping(false);
      return;
    }

    let currentIndex = 0;
    setIsTyping(true);
    
    // Clear existing timeout to avoid race conditions
    const typingInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 20); // Speed of typing effect

    return () => clearInterval(typingInterval);
  }, [text]);

  // If no text and not listening, show placeholder
  const placeholderText = !text && !isListening 
    ? "Press the microphone to start speaking..."
    : !text && isListening
    ? "Listening..."
    : null;

  return (
    <div className={cn("w-full max-w-md mx-auto text-center min-h-[60px]", className)}>
      {placeholderText && (
        <p className="text-gray-400 italic text-lg">{placeholderText}</p>
      )}
      
      {displayText && (
        <div className="relative">
          <p className={cn(
            "text-voice-text text-lg md:text-xl font-medium",
            isTyping ? "border-r-2 border-gray-500 pr-1 animate-blink" : ""
          )}>
            {displayText}
          </p>
        </div>
      )}
    </div>
  );
};

export default TranscriptionText;
