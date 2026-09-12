import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Hero.module.css';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.5, stagger: 0.3, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <section className={styles.hero} ref={containerRef}>
      <div className={styles.motif}>﷽</div>
      <h1 className={styles.names}>Aisha & Umar</h1>
      <p className={styles.date}>Saturday, 24th October 2026</p>
      <div className={styles.countdown}>
        <span>30 Days To Go</span>
      </div>
    </section>
  );
};

export default Hero;
