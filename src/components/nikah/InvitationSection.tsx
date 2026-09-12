import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './InvitationSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const InvitationSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef.current);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      });

      tl.fromTo(
        q('.anim-eyebrow'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      )
      .fromTo(
        q('.anim-title'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        q('.anim-divider'),
        { opacity: 0, scaleX: 0.8 },
        { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(
        q('.anim-card-wrapper'),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' },
        '-=0.4'
      )
      .fromTo(
        q('.anim-star'),
        { scale: 0, xPercent: -50, yPercent: -50 },
        { scale: 1, xPercent: -50, yPercent: -50, duration: 0.8, ease: 'back.out(1.5)' },
        '-=1.0'
      )
      .fromTo(
        q('.anim-tap-text'),
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.6'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSealClick = () => {
    if (sectionRef.current) {
      const q = gsap.utils.selector(sectionRef);
      const tl = gsap.timeline();

      if (!isOpen) {
        setIsOpen(true);
        tl.to(q(`.${styles.tapText}`), {
          opacity: 0,
          height: 0,
          marginTop: 0,
          duration: 0.3
        })
        .fromTo(q('.anim-inner-text'), 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
          '-=0.1'
        );
      } else {
        setIsOpen(false);
        tl.to(q('.anim-inner-text'), {
          opacity: 0,
          y: -10,
          duration: 0.3,
          stagger: 0.05,
          ease: 'power2.in'
        })
        .to(q(`.${styles.tapText}`), {
          opacity: 1,
          height: 'auto',
          marginTop: 20,
          duration: 0.4
        });
      }
    }
  };

  return (
    <section className={styles.invitation} id="invitation" ref={sectionRef}>
      <p className={`${styles.eyebrow} anim-eyebrow`} style={{ opacity: 0 }}>OUR INVITATION</p>
      <h2 className={`${styles.sectionTitle} anim-title`} style={{ opacity: 0 }}>Dear Family & Friends</h2>
      
      <div className={`${styles.divider} anim-divider`} style={{ opacity: 0 }}>
        <svg width="160" height="24" viewBox="0 0 160 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arch-divider">
          <path d="M0 12h58" stroke="#D2B471" strokeWidth="1"/>
          <path d="M102 12h58" stroke="#D2B471" strokeWidth="1"/>
          <path d="M80 3C78 6 76 9 76 12C76 15 78 18 80 21C82 18 84 15 84 12C84 9 82 6 80 3Z" fill="none" stroke="#D2B471" strokeWidth="1"/>
          <circle cx="80" cy="12" r="1.5" fill="#D2B471"/>
        </svg>
      </div>

      <div className={`${styles.cardWrapper} anim-card-wrapper`} style={{ opacity: 0 }}>
        <div className={`${styles.sealContainer} anim-star`} onClick={handleSealClick} style={{ cursor: isOpen ? 'default' : 'pointer', transform: 'translate(-50%, -50%) scale(0)' }}>
          <span className={styles.sealRing}></span>
          <span className={styles.sealCore} style={{ backgroundColor: '#0B3D2E' }}>
            {isOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 18L18 6M6 6L18 18" stroke="#D2B471" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="17" cy="17" r="10" fill="none" stroke="#D2B471" strokeWidth="1.2" />
                <polygon points="17,2 20.36,12.37 31.26,12.37 22.44,18.77 25.81,29.13 17,22.72 8.19,29.13 11.56,18.77 2.74,12.37 13.64,12.37" fill="none" stroke="#D2B471" strokeWidth="1.2" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </div>

        <div className={`${styles.cardClosed} ${isOpen ? styles.cardOpen : ''}`}>
          <div className={styles.cardPattern}></div>
          <div className={styles.cardContent}>
            <div className={styles.innerContent}>
              <p className={`${styles.innerText} anim-inner-text`} style={{ opacity: 0 }}>
                By the grace of Allah, we joyfully invite you to be part of our Nikah and Walima celebrations. Your presence, prayers, and blessings would mean the world to us as we begin this new journey together.
              </p>
              <h3 className={`${styles.innerSignature} anim-inner-text`} style={{ opacity: 0 }}>
                With love, Imran & Ayesha
              </h3>
            </div>
          </div>
        </div>
      </div>

      <p className={`${styles.tapText} anim-tap-text`} style={{ opacity: 0 }}>
        TAP THE SEAL TO READ
      </p>
    </section>
  );
};

export default InvitationSection;
