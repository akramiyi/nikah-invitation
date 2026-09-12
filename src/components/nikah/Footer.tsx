import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

const Footer: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Subtle entrance animation
      gsap.fromTo(
        '.anim-footer',
        { opacity: 0, y: 15, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer className={styles.closingSection} id="closing" ref={sectionRef}>
      
      {/* Main Closing Area */}
      <div className={styles.closingContent}>
        
        {/* Monogram */}
        <div className={`${styles.monogram} anim-footer`}>
          <svg width="68" height="68" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.monogramShape}>
            <rect x="32" y="4" width="39.6" height="39.6" transform="rotate(45 32 4)" stroke="#C2A878" strokeWidth="1" fill="none"/>
            <rect x="32" y="10" width="31.1" height="31.1" transform="rotate(45 32 10)" stroke="#C2A878" strokeWidth="1" fill="rgba(0, 0, 0, 0.15)"/>
          </svg>
          <div className={styles.monogramText}>
            <span>I</span>
            <span>A</span>
          </div>
        </div>

        {/* Couple Name */}
        <h2 className={`${styles.coupleName} anim-footer`}>Imran & Ayesha</h2>
        
        {/* Thank You Message */}
        <p className={`${styles.thankYouMsg} anim-footer`}>
          Thank you for being a part of our story.
        </p>
        
        {/* Ameen */}
        <div className={`${styles.ameen} anim-footer`}>Ameen</div>
        
        {/* Metadata */}
        <div className={`${styles.metadata} anim-footer`}>
          #ImranWedsAyesha &middot; December 12, 2026 &middot; Noor Banquet & Gardens
        </div>
      </div>

      {/* Footer Strip */}
      <div className={`${styles.footerStrip} anim-footer`}>
        Made with <span className={styles.heart}>&hearts;</span> by akramiyi
      </div>
    </footer>
  );
};

export default Footer;
