
import React, { useState } from 'react';
import BlobVoiceButton from '@/components/BlobVoiceButton';
import TranscriptionText from '@/components/TranscriptionText';
import WaveformAnimation from '@/components/WaveformAnimation';
import ControlButtons from '@/components/ControlButtons';
import useVoiceRecognition from '@/hooks/useVoiceRecognition';
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [history, setHistory] = useState<string[]>([]);
  
  const {
    transcript,
    isListening,
    isMuted,
    startListening,
    stopListening,
    toggleMute
  } = useVoiceRecognition({
    onFinish: (finalText) => {
      if (finalText) {
        setHistory(prev => [...prev, finalText]);
        toast({
          title: "Voice captured",
          description: "Your voice input has been processed.",
          duration: 3000,
        });
      }
    }
  });

  const handleVoiceButtonClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleStopClick = () => {
    stopListening();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl bg-gradient-to-b from-white to-gray-50 rounded-3xl shadow-lg p-8 flex flex-col items-center">
        <h1 className="text-3xl font-light text-gray-800 mb-12">Voice Assistant</h1>
        
        {/* Main voice button (now blob) */}
        <div className="mb-8 relative">
          <BlobVoiceButton isListening={isListening} onClick={handleVoiceButtonClick} />
        </div>
        
        {/* Waveform animation */}
        <div className="mb-8 h-16">
          <WaveformAnimation isActive={isListening && !isMuted} />
        </div>
        
        {/* Transcription text */}
        <div className="mb-12 min-h-24">
          <TranscriptionText 
            text={transcript} 
            isListening={isListening} 
          />
        </div>
        
        {/* Control buttons */}
        <ControlButtons 
          isMuted={isMuted} 
          onToggleMute={toggleMute}
          onStop={handleStopClick}
        />
        
        {/* History (optional, only show if there are entries) */}
        {history.length > 0 && (
          <div className="mt-12 w-full">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Recent Interactions</h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              {history.map((item, index) => (
                <p key={index} className="text-sm text-gray-600 mb-2">
                  "{item}"
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
