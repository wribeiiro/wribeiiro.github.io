import { useRef, useCallback } from "react";

export const useShutdownSound = () => {
  const audioRef = useRef(null);

  const playShutdown = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/assets/shutdown.wav");
      audioRef.current.volume = 0.5;
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Ignore autoplay policy errors
    });
  }, []);

  return { playShutdown };
};
