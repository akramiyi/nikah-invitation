import React, { useRef, useState, useEffect } from 'react';
import styles from './AudioPlayer.module.css';
import naatAudio from '../../assets/naat.mp3';

interface AudioPlayerProps {
  playTrigger: boolean;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ playTrigger }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const hasTriggeredPlay = useRef(false);

  useEffect(() => {
    // Only auto-play ONCE when the playTrigger becomes true
    if (playTrigger && audioRef.current && !hasTriggeredPlay.current) {
      hasTriggeredPlay.current = true;
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error("Audio playback failed (usually requires user interaction):", e));
    }
  }, [playTrigger]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`${styles.audioButton} ${isPlaying ? styles.playing : ''}`} onClick={togglePlay} title="Toggle Audio">
      <audio ref={audioRef} src={naatAudio} loop />
      
      {/* Equalizer bars for the icon */}
      <div className={styles.barsContainer}>
        <div className={`${styles.bar} ${styles.bar1}`} />
        <div className={`${styles.bar} ${styles.bar2}`} />
        <div className={`${styles.bar} ${styles.bar3}`} />
      </div>
    </div>
  );
};

export default AudioPlayer;
