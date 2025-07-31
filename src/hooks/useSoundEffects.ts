import { useCallback, useRef } from 'react';

interface SoundConfig {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
}

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((config: SoundConfig) => {
    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(config.frequency, audioContext.currentTime);
      oscillator.type = config.type || 'square';
      
      gainNode.gain.setValueAtTime(config.volume || 0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + config.duration);
    } catch (error) {
      // Silently fail if audio is not supported
      console.warn('Audio not supported:', error);
    }
  }, [getAudioContext]);

  const playMoveSound = useCallback(() => {
    playSound({ frequency: 220, duration: 0.1, volume: 0.05 });
  }, [playSound]);

  const playRotateSound = useCallback(() => {
    playSound({ frequency: 330, duration: 0.1, volume: 0.05 });
  }, [playSound]);

  const playDropSound = useCallback(() => {
    playSound({ frequency: 165, duration: 0.2, type: 'sawtooth', volume: 0.08 });
  }, [playSound]);

  const playLineClearSound = useCallback((lines: number) => {
    const baseFreq = 440;
    const duration = 0.3;
    
    for (let i = 0; i < lines; i++) {
      setTimeout(() => {
        playSound({ 
          frequency: baseFreq + (i * 110), 
          duration: duration - (i * 0.05), 
          type: 'sine',
          volume: 0.1
        });
      }, i * 100);
    }
  }, [playSound]);

  const playGameOverSound = useCallback(() => {
    const frequencies = [330, 294, 262, 220];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        playSound({ 
          frequency: freq, 
          duration: 0.5, 
          type: 'triangle',
          volume: 0.12
        });
      }, index * 200);
    });
  }, [playSound]);

  const playLevelUpSound = useCallback(() => {
    const frequencies = [262, 330, 392, 523];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        playSound({ 
          frequency: freq, 
          duration: 0.15, 
          type: 'sine',
          volume: 0.08
        });
      }, index * 100);
    });
  }, [playSound]);

  return {
    playMoveSound,
    playRotateSound,
    playDropSound,
    playLineClearSound,
    playGameOverSound,
    playLevelUpSound,
  };
};