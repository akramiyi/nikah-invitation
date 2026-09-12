import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Blessings.module.css';

gsap.registerPlugin(ScrollTrigger);

const Blessings: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance animation sequence with a subtle blur effect
      gsap.fromTo(
        '.anim-blessing',
        { opacity: 0, y: 20, filter: 'blur(5px)' },
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
    <section className={styles.blessingsSection} id="blessings" ref={sectionRef}>
      <div className={styles.contentWrapper}>
        
        <div className={`${styles.eyebrow} anim-blessing`}>WITH LOVE</div>
        <h2 className={`${styles.title} anim-blessing`}>Blessings</h2>
        
        {/* Decorative Divider */}
        <div className={`${styles.divider} anim-blessing`}>
          <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="10" x2="85" y2="10" stroke="#C2A878" strokeWidth="1"/>
            <rect x="95" y="5" width="10" height="10" transform="rotate(45 100 10)" stroke="#C2A878" strokeWidth="1" fill="none"/>
            <line x1="115" y1="10" x2="200" y2="10" stroke="#C2A878" strokeWidth="1"/>
          </svg>
        </div>

        <p className={`${styles.description} anim-blessing`}>
          Your presence and duas are the greatest gift we could ask for. If you’d still like to send something, a small note below is all we ask.
        </p>

        <div className={styles.cardsContainer}>
          
          {/* Card 1 - Your Presence */}
          <div className={`${styles.card} anim-blessing`}>
            <div className={styles.iconWrapper}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="#C2A878" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Your Presence</h3>
            <p className={styles.cardDesc}>
              Your love, laughter, and prayers are gift enough for us.
            </p>
          </div>

          {/* Card 2 - Duas */}
          <div className={`${styles.card} anim-blessing`}>
            <div className={styles.iconWrapper}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Crescent Moon */}
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="#06241B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                {/* Small gold sparkle/star */}
                <path d="M21 3 L21 7 M19 5 L23 5" stroke="#C2A878" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Duas</h3>
            <p className={styles.cardDesc}>
              Please keep us in your prayers as we begin this new chapter, In Sha Allah.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Blessings;
