import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const AUDIO_SRC = '/audio/ambient-lounge.mp3';
const FADE_DURATION = 1500;
const TARGET_VOLUME = 0.3;

const AmbientMusic: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const fadeRef = useRef<number>();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0;
    audio.loop = true;

    const handleCanPlay = () => setIsReady(true);
    const handleError = () => setIsReady(false);

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      if (fadeRef.current) cancelAnimationFrame(fadeRef.current);
    };
  }, []);

  const fadeVolume = useCallback((from: number, to: number, onDone?: () => void) => {
    const audio = audioRef.current;
    if (!audio) return;

    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / FADE_DURATION, 1);
      const eased = progress * (2 - progress); // ease-out quad
      audio.volume = from + (to - from) * eased;

      if (progress < 1) {
        fadeRef.current = requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    };

    fadeRef.current = requestAnimationFrame(tick);
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      fadeVolume(audio.volume, 0, () => {
        audio.pause();
        setIsPlaying(false);
      });
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          fadeVolume(0, TARGET_VOLUME);
        })
        .catch(() => {
          // Browser blocked autoplay — user needs to interact first
        });
    }
  }, [isPlaying, fadeVolume]);

  if (!isReady) return <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />;

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-cosmos-night/80 backdrop-blur-md border border-cosmos-gold/20 hover:border-cosmos-gold/50 text-cosmos-cream/60 hover:text-cosmos-gold transition-all duration-500 group"
        aria-label={isPlaying ? 'Couper la musique' : 'Activer la musique'}
        title={isPlaying ? 'Couper la musique' : 'Musique d\u2019ambiance'}
      >
        {isPlaying ? (
          <Volume2 className="w-4 h-4" strokeWidth={1.5} />
        ) : (
          <VolumeX className="w-4 h-4" strokeWidth={1.5} />
        )}

        {/* Pulse animation when playing */}
        {isPlaying && (
          <span className="absolute inset-0 rounded-full border border-cosmos-gold/20 animate-ping" />
        )}

        {/* Equalizer bars when playing */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1 flex items-end gap-[2px] h-3">
            <span
              className="w-[2px] bg-cosmos-gold/60 rounded-full animate-pulse"
              style={{ height: '40%', animationDelay: '0s' }}
            />
            <span
              className="w-[2px] bg-cosmos-gold/60 rounded-full animate-pulse"
              style={{ height: '80%', animationDelay: '0.15s' }}
            />
            <span
              className="w-[2px] bg-cosmos-gold/60 rounded-full animate-pulse"
              style={{ height: '55%', animationDelay: '0.3s' }}
            />
          </div>
        )}
      </button>
    </>
  );
};

export default AmbientMusic;
