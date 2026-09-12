import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import styles from './IntroAnimation.module.css';
import introVideo from '../../assets/0911.mp4';
import waxSealImg from '../../assets/wax-seal.webp';

interface IntroAnimationProps {
  onComplete: () => void;
  onSealClick: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete, onSealClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLImageElement>(null);
  const raysRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); // Prevent browser from restoring scroll position under the fixed intro
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleOpen = () => {
    if (isOpened) return;
    setIsOpened(true);
    
    // Trigger the audio immediately when the seal is clicked
    onSealClick();
    
    const tl = gsap.timeline();

    // Step 1: On tap, seal scales UP quickly
    tl.to(sealRef.current, { 
      scale: 1.15, 
      duration: 0.3, 
      ease: "power2.out" 
    });

    // Step 2: Rays expand outwards from the center (chhota se bada)
    tl.fromTo(raysRef.current, 
      { scale: 0, opacity: 0, rotation: 0 },
      { 
        scale: 1.3, 
        opacity: 0.85, 
        rotation: 45, 
        duration: 1.5, 
        ease: "power2.out" 
      }, 
      "-=0.2"
    );

    // Step 3: Seal scales DOWN and fades OUT
    tl.to(sealRef.current, {
      scale: 0.5,
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        // Video plays EXACTLY as the seal disappears, creating a seamless transition
        if (videoRef.current) {
          videoRef.current.play().catch(e => console.error("Video play failed", e));
        }
      }
    }, "-=0.6");

    // Step 4: Rays smoothly fade out OVER the playing video
    tl.to(raysRef.current, {
      opacity: 0,
      duration: 1.0,
      ease: "power2.inOut"
    }, "-=0.2");
  };

  const handleVideoEnded = () => {
    // Trigger the Hero text animations immediately as the envelope finishes opening
    onComplete();
    document.body.style.overflow = 'auto';

    // Smoothly blend the video's final frame into the React background 
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power1.inOut",
      onComplete: () => {
        if (containerRef.current) {
          containerRef.current.style.display = 'none';
        }
      }
    });
  };

  return (
    <div className={styles.introContainer} ref={containerRef}>
      
      {/* 
        The video starts paused. Its first frame shows the closed envelope.
        It sits at z-index 1. 
      */}
      <video 
        ref={videoRef}
        className={styles.introVideo}
        src={introVideo}
        preload="auto"
        playsInline
        muted
        onEnded={handleVideoEnded}
      />
      
      {/* --- RAYS --- */}
      <div className={styles.raysWrapper}>
        <div className={styles.raysContainer} ref={raysRef}>
          <div className={`${styles.rayLayer} ${styles.rayLayer1}`} />
          <div className={`${styles.rayLayer} ${styles.rayLayer2}`} />
        </div>
      </div>
      
      <div className={styles.sealWrapper}>
        <img 
          src={waxSealImg} 
          alt="Wax Seal" 
          className={styles.waxSeal} 
          ref={sealRef}
          onClick={handleOpen}
        />
      </div>
    </div>
  );
};

export default IntroAnimation;
