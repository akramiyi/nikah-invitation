import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './VenueSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const VenueSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef.current);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          tl.fromTo(
            q('.anim-venue-eyebrow'),
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
          )
          .fromTo(
            q('.anim-venue-title'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
            '-=0.6'
          )
          .fromTo(
            q('.anim-venue-divider'),
            { opacity: 0, scaleX: 0.8 },
            { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.out' },
            '-=0.6'
          )
          .fromTo(
            q('.anim-venue-address'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.6'
          )
          .fromTo(
            q('.anim-venue-locate'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' },
            '-=0.5'
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openGoogleMaps = () => {
    // Exact location for Noor Banquet, Hazratganj, Lucknow
    window.open('https://maps.google.com/?q=14+Rose+Avenue,+Hazratganj,+Lucknow', '_blank');
  };

  return (
    <section className={styles.venue} id="venue" ref={sectionRef}>
      {/* Decorative Corners (Optional/Faint) */}
      <svg className={`${styles.cornerPattern} ${styles.patternLeft}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 100 C 50 100 100 50 100 0" stroke="#D2B471" strokeWidth="0.5" strokeDasharray="2 2" fill="none"/>
        <path d="M0 80 C 40 80 80 40 80 0" stroke="#D2B471" strokeWidth="0.5" fill="none"/>
      </svg>
      <svg className={`${styles.cornerPattern} ${styles.patternRight}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 100 C 50 100 100 50 100 0" stroke="#D2B471" strokeWidth="0.5" strokeDasharray="2 2" fill="none"/>
        <path d="M0 80 C 40 80 80 40 80 0" stroke="#D2B471" strokeWidth="0.5" fill="none"/>
      </svg>

      <div className={styles.venueInner}>
        <p className={`${styles.eyebrow} anim-venue-eyebrow`} style={{ opacity: 0 }}>OUR VENUE</p>
        <h2 className={`${styles.sectionTitle} anim-venue-title`} style={{ opacity: 0 }}>Noor Banquet & Gardens</h2>
        
        <div className={`${styles.divider} anim-venue-divider`} style={{ opacity: 0 }}>
          <svg width="160" height="24" viewBox="0 0 160 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arch-divider">
            <path d="M0 12h58" stroke="#D2B471" strokeWidth="1"/>
            <path d="M102 12h58" stroke="#D2B471" strokeWidth="1"/>
            <path d="M80 3C78 6 76 9 76 12C76 15 78 18 80 21C82 18 84 15 84 12C84 9 82 6 80 3Z" fill="none" stroke="#D2B471" strokeWidth="1"/>
            <circle cx="80" cy="12" r="1.5" fill="#D2B471"/>
          </svg>
        </div>

        <div className="anim-venue-address" style={{ opacity: 0 }}>
          <p className={styles.addressLine}>
            14 Rose Avenue, Hazratganj, Lucknow, Uttar Pradesh
          </p>
          <p className={styles.parkingNote}>
            Ample parking available on premises.
          </p>
        </div>

        <div className={`${styles.locateCard} anim-venue-locate`} style={{ opacity: 0 }}>
          <div className={styles.qrContainer}>
            {/* Using a placeholder SVG for the QR code until an image is provided */}
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#4A8393" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </div>
          <div className={styles.locateContent}>
            <p className={styles.locateHelper}>Scan to locate, or</p>
            <a href="https://maps.google.com/?q=14+Rose+Avenue,+Hazratganj,+Lucknow" target="_blank" rel="noopener noreferrer" className={styles.mapBtn}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" fill="#D47B95"/>
                <circle cx="12" cy="9" r="2.5" fill="#F1E9D6"/>
              </svg>
              <span className={styles.mapBtnText}>OPEN IN MAPS</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VenueSection;
