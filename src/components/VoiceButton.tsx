
import { Mic } from "lucide-react";

interface VoiceButtonProps {
  isListening: boolean;
  onClick: () => void;
}

const VoiceButton = ({ isListening, onClick }: VoiceButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-300 
        ${isListening ? 'bg-voice-blue shadow-lg' : 'bg-white shadow-md hover:shadow-lg hover:bg-voice-lightGray'}`}
      aria-label={isListening ? "Listening" : "Start listening"}
    >
      {/* Mic Icon */}
      <Mic 
        size={48} 
        className={`transition-colors duration-300 ${isListening ? 'text-blue-600' : 'text-gray-700'}`} 
      />
      
      {/* Animated glow effect when active */}
      {isListening && (
        <>
          {/* Inner pulse ring */}
          <div className="absolute inset-0 rounded-full bg-voice-blue opacity-20 animate-pulse-glow"></div>
          
          {/* Outer pulse ring */}
          <div className="absolute -inset-4 rounded-full bg-voice-blue opacity-10 animate-pulse-glow" style={{ animationDelay: '0.5s' }}></div>
        </>
      )}
    </button>
  );
};

export default VoiceButton;
