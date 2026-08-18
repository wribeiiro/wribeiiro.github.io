import { useState, useEffect, useRef, useCallback } from "react";

const POLL_INTERVAL = 10_000; // 10 seconds
const SPOTIFY_API_URL = import.meta.env.VITE_SPOTIFY_API_URL || "/api/spotify";

const initialState = {
  isPlaying: false,
  title: null,
  artist: null,
  album: null,
  albumArt: null,
  duration: 0,
  progress: 0,
  trackUrl: null,
  loading: true,
  error: null,
};

export const useSpotify = () => {
  const [state, setState] = useState(initialState);
  const intervalRef = useRef(null);
  const progressTimerRef = useRef(null);
  const lastFetchRef = useRef(null);

  const startProgressTimer = useCallback((initialProgress, duration, isPlaying) => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    if (!isPlaying) return;

    let progress = initialProgress;
    const startedAt = Date.now();

    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      progress = Math.min(initialProgress + elapsed, duration);
      setState(prev => ({ ...prev, progress }));
      if (progress >= duration) clearInterval(progressTimerRef.current);
    }, 500);
  }, []);

  const fetchNowPlaying = useCallback(async () => {
    try {
      const res = await fetch(SPOTIFY_API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      lastFetchRef.current = Date.now();

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        isPlaying: data.isPlaying ?? false,
        title: data.title ?? null,
        artist: data.artist ?? null,
        album: data.album ?? null,
        albumArt: data.albumArt ?? null,
        duration: data.duration ?? 0,
        progress: data.progress ?? 0,
        trackUrl: data.trackUrl ?? null,
      }));

      startProgressTimer(data.progress ?? 0, data.duration ?? 0, data.isPlaying ?? false);
    } catch (err) {
      setState(prev => ({ ...prev, loading: false, error: err.message }));
    }
  }, [startProgressTimer]);

  useEffect(() => {
    fetchNowPlaying();
    intervalRef.current = setInterval(fetchNowPlaying, POLL_INTERVAL);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressTimerRef.current);
    };
  }, [fetchNowPlaying]);

  return { ...state, refresh: fetchNowPlaying };
};
