
import React from 'react';
import { MicOff, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ControlButtonsProps {
  isMuted: boolean;
  onToggleMute: () => void;
  onStop: () => void;
  className?: string;
}

const ControlButtons = ({ isMuted, onToggleMute, onStop, className }: ControlButtonsProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-6", className)}>
      {/* Mute/Unmute Button */}
      <button
        onClick={onToggleMute}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-md
          ${isMuted 
            ? 'bg-white border border-voice-red text-voice-red hover:bg-red-50' 
            : 'bg-voice-red text-white hover:bg-red-600'}`
        }
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        <MicOff size={24} />
      </button>
      
      {/* Stop Button */}
      <button
        onClick={onStop}
        className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center transition-all duration-300 shadow-md hover:bg-gray-300"
        aria-label="Stop"
      >
        <X size={24} className="text-gray-700" />
      </button>
    </div>
  );
};

export default ControlButtons;
