
import { useState, useEffect, useCallback } from "react";

interface UseVoiceRecognitionProps {
  onTranscript?: (text: string) => void;
  onFinish?: (finalText: string) => void;
}

interface UseVoiceRecognitionReturn {
  transcript: string;
  isListening: boolean;
  isMuted: boolean;
  startListening: () => void;
  stopListening: () => void;
  toggleMute: () => void;
}

const useVoiceRecognition = ({
  onTranscript,
  onFinish,
}: UseVoiceRecognitionProps = {}): UseVoiceRecognitionReturn => {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const setupRecognition = useCallback(() => {
    // Browser compatibility check
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
      console.error("Speech recognition not supported in this browser.");
      return null;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();

    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = "en-US";

    // Event handlers
    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onresult = (event) => {
      let interimTranscript = "";
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const finalText = result[0].transcript.trim();
          setTranscript(finalText);
          onTranscript?.(finalText);
        } else {
          interimTranscript += result[0].transcript;
        }
      }
      
      if (interimTranscript) {
        const newTranscript = interimTranscript.trim();
        setTranscript(newTranscript);
        onTranscript?.(newTranscript);
      }
    };

    recognitionInstance.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
      onFinish?.(transcript);
    };

    return recognitionInstance;
  }, [onTranscript, onFinish, transcript]);

  // Initialize recognition on mount
  useEffect(() => {
    const recognitionInstance = setupRecognition();
    if (recognitionInstance) {
      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognitionInstance && isListening) {
        recognitionInstance.stop();
      }
    };
  }, [setupRecognition, isListening]);

  const startListening = useCallback(() => {
    if (recognition && !isListening && !isMuted) {
      try {
        recognition.start();
      } catch (error) {
        // Handle potential errors when starting recognition
        console.error("Error starting speech recognition:", error);
      }
    }
  }, [recognition, isListening, isMuted]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setTranscript("");
    }
  }, [recognition, isListening]);

  const toggleMute = useCallback(() => {
    if (isListening && !isMuted) {
      recognition?.stop();
    }
    setIsMuted((prev) => !prev);
  }, [isMuted, recognition, isListening]);

  return {
    transcript,
    isListening,
    isMuted,
    startListening,
    stopListening,
    toggleMute
  };
};

export default useVoiceRecognition;

// Add TypeScript declarations for browser Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}
