import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './CustomCursor.module.css';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Check if device uses touch / coarse pointer
    const touchQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    if (touchQuery.matches) {
      setIsTouch(true);
      return;
    }

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsTouch(e.matches);
    };

    touchQuery.addEventListener('change', handleMediaChange);

    if (!cursorRef.current) return () => touchQuery.removeEventListener('change', handleMediaChange);

    // Use GSAP quickTo for incredibly smooth high-performance cursor tracking
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.15, ease: "power3.out" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.15, ease: "power3.out" });

    const onMouseMove = (e: MouseEvent) => {
      // CSS top/left is already -150px, so passing pure coordinates perfectly centers it
      xTo(e.clientX); 
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      touchQuery.removeEventListener('change', handleMediaChange);
      window.removeEventListener('mousemove', onMouseMove);
      if (cursorRef.current) {
        gsap.killTweensOf(cursorRef.current);
      }
    };
  }, [isTouch]);

  if (isTouch) return null;

  return <div className={styles.cursorHalo} ref={cursorRef} />;
};

export default CustomCursor;
