import React, { useEffect, useRef, useMemo } from 'react';
import { useInvitation } from '../../contexts/InvitationContext';
import gsap from 'gsap';
import styles from './HeroSection.module.css';
import heroImg from '../../assets/Gemini_watermartremove.png';

interface HeroSectionProps {
  introComplete: boolean;
}

const GoldenSnow = () => {
  const particles = useMemo(() => {
    return [...Array(65)].map((_, i) => {
      const rand = Math.random();
      let type: 'snow' | 'star' | 'bokeh' | 'moon' = 'snow';
      if (rand > 0.90) type = 'moon'; // 10% moons
      else if (rand > 0.75) type = 'star'; // 15% stars
      else if (rand > 0.60) type = 'bokeh'; // 15% bokeh balls
      
      let size;
      if (type === 'moon') size = Math.random() * 8 + 12; // moons 12-20px
      else if (type === 'star') size = Math.random() * 8 + 8; // stars 8-16px
      else if (type === 'bokeh') size = Math.random() * 15 + 15; // large bokeh
      else size = Math.random() * 4 + 2; // small snow
      
      return {
        id: i,
        type,
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 15 + (type === 'bokeh' ? 25 : 15)}s`, // bokeh floats slower
        animationDelay: `-${Math.random() * 30}s`,
        opacity: type === 'bokeh' ? Math.random() * 0.3 + 0.1 : Math.random() * 0.6 + 0.2,
        width: `${size}px`,
        height: `${size}px`,
        xOffset: `${(Math.random() - 0.5) * 200}px`, // drift left or right
        rotation: `${Math.random() * 360}deg` // for rotating stars and moons
      };
    });
  }, []);

  return (
    <div className={`${styles.snowContainer} gsap-hero-element`} style={{ opacity: 0 }}>
      {particles.map(p => (
        <div 
          key={p.id}
          className={`${styles.particle} ${styles[p.type]}`}
          style={{
            left: p.left,
            animationDuration: p.animationDuration,
            animationDelay: p.animationDelay,
            opacity: p.opacity,
            width: p.width,
            height: p.height,
            '--x-offset': p.xOffset,
            '--rotation': p.rotation
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

const DiamondRow = ({ isBottom }: { isBottom?: boolean }) => (
  <div 
    className={`${styles.diamondRow} anim-decor`} 
    style={{ 
      opacity: 0, 
      marginBottom: isBottom ? '24px' : '32px',
      marginTop: isBottom ? '24px' : '0' 
    }}
  >
    <svg width="340" height="15" viewBox="0 0 340 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[...Array(11)].map((_, i) => (
        <path key={i} d="M7.08 0.5 L13.66 6.375 L7.08 12.25 L0.5 6.375 Z" stroke="#E8CF8A" strokeWidth="1" transform={`translate(${i * 32.584}, 1)`} opacity="0.6"/>
      ))}
    </svg>
  </div>
);

const MoonIcon = () => (
  <div className={`${styles.moonIcon} anim-decor`} style={{ opacity: 0 }}>
    <svg width="34" height="34" viewBox="0 0 34 34" fill="#E8CF8A" xmlns="http://www.w3.org/2000/svg">
      <path d="M 21 3.7 A 14.2 14.2 0 1 0 21 30.3 A 14 14 0 0 1 21 3.7 Z" />
      <path d="M 24 13 L 25 15.8 L 28 15.8 L 25.6 17.6 L 26.5 20.6 L 24 18.8 L 21.5 20.6 L 22.4 17.6 L 20 15.8 L 23 15.8 Z" />
    </svg>
  </div>
);



const HeroSection: React.FC<HeroSectionProps> = ({ introComplete }) => {
  const heroRef = useRef<HTMLElement>(null);
  const invitation = useInvitation();

  useEffect(() => {
    if (introComplete && heroRef.current) {
      const q = gsap.utils.selector(heroRef);
      const tl = gsap.timeline();

      // 1. Fade in Background & Particles
      tl.to(q('.gsap-hero-element'), { 
        opacity: 1, 
        duration: 1.5, 
        ease: 'power2.inOut' 
      });

      // 2. Decor & Eyebrow Text
      tl.fromTo(q('.anim-decor, .anim-eyebrow'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.2, stagger: 0.15, ease: 'power2.out' },
        "-=0.8" // Start while background is still fading in
      );

      // 3. Main Couple Title (Stronger emphasis, longer duration)
      tl.fromTo(q('.anim-title'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.8, ease: 'power3.out' },
        "-=0.8"
      );

      // 4. Details (Date, Location, Hashtag)
      tl.fromTo(q('.anim-details'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1.0, stagger: 0.15, ease: 'power2.out' },
        "-=1.2"
      );

      // 5. CTA Buttons (Subtle scale in)
      tl.fromTo(q('.anim-btn'),
        { opacity: 0, y: 15, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1.0, stagger: 0.1, ease: 'power2.out' },
        "-=0.5"
      );

      // 6. Scroll To Explore
      tl.fromTo(q('.anim-scroll'),
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' },
        "-=0.5"
      );
    }
  }, [introComplete]);

  const dateObj = new Date(invitation.wedding_date);
  const isValidDate = !isNaN(dateObj.getTime());
  const day = isValidDate ? dateObj.getDate().toString() : '12';
  const monthYear = isValidDate ? `${dateObj.toLocaleString('default', { month: 'short' }).toUpperCase()} ${dateObj.getFullYear()}` : 'DEC 2026';
  const locationCity = invitation.venue_address ? invitation.venue_address.split(',').slice(-2, -1)[0]?.trim() || 'Lucknow' : 'Lucknow';

  return (
    <section className={styles.hero} ref={heroRef}>
      <div className={styles.background}></div>

      {/* BACKGROUND ELEMENTS */}
      <div className={`${styles.overlayContainer} gsap-hero-element`} style={{ opacity: 0 }}>
        <img src={heroImg} alt="Hero Content" className={styles.overlayImg} />
        <img src={heroImg} alt="Hero Content Blurred" className={`${styles.overlayImg} ${styles.blurredCenter}`} />
        <div className={styles.vignetteOverlay} />
      </div>
      
      <GoldenSnow />

      {/* FOREGROUND TYPOGRAPHY */}
      <div className={styles.heroContent}>
        <DiamondRow />
        <p className={`${styles.eyebrow} anim-eyebrow`} style={{ opacity: 0 }}>NIKAH & WALIMA</p>
        
        <MoonIcon />
        <p className={`${styles.togetherText} anim-eyebrow`} style={{ opacity: 0 }}>Together with their families</p>
        
        <h1 className={`${styles.mainTitle} anim-title`} style={{ opacity: 0 }}>
          {invitation.groom_name} <span>&</span> {invitation.bride_name}
        </h1>
        
        <div className={`${styles.dateLine} anim-details`} style={{ opacity: 0 }}>
          <span className={styles.dateStar}>✦</span>
          <span className={styles.dateNumber}>{day}</span>
          <span className={styles.dateMonth}>{monthYear}</span>
          <span className={styles.dateStar}>✦</span>
        </div>
        
        <p className={`${styles.location} anim-details`} style={{ opacity: 0 }}>{locationCity}</p>
        <p className={`${styles.hashtag} anim-details`} style={{ opacity: 0 }}>{invitation.hashtag}</p>
        
        <div className={styles.buttonGroup}>
          <a href="#rsvp" className={`${styles.btnSolid} anim-btn`} style={{ opacity: 0 }}>RSVP NOW</a>
          <a href="#schedule" className={`${styles.btnOutline} anim-btn`} style={{ opacity: 0 }}>VIEW SCHEDULE</a>
        </div>
        
        <div className={`${styles.scrollExplore} anim-scroll`} style={{ opacity: 0 }}>
          SCROLL TO EXPLORE
          <svg className={styles.chevron} width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L7 7L13 1" stroke="#F7F1DE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <DiamondRow isBottom={true} />
      </div>
    </section>
  );
};

export default HeroSection;
