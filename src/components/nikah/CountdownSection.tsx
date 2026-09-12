import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CountdownSection.module.css';
import { useInvitation } from '../../contexts/InvitationContext';

gsap.registerPlugin(ScrollTrigger);

// Deterministic particles
const PARTICLES = Array.from({ length: 40 }).map((_, i) => {
  const seed = i * 137.5; 
  const random = (min: number, max: number, s: number) => min + ((Math.sin(s) + 1) / 2) * (max - min);
  
  return {
    id: i,
    top: random(5, 95, seed + 1),
    left: random(5, 95, seed + 2),
    size: random(2, 5, seed + 3), // Sizes between 2px and 5px
    baseOpacity: random(0.1, 0.35, seed + 4),
    pulseOpacity: random(0.5, 0.8, seed + 5),
    duration: random(3, 8, seed + 6), // Slow duration 3-8s
    delay: random(0, 4, seed + 7),
    xDrift: random(-5, 5, seed + 8), // Micro drift
    yDrift: random(-5, 5, seed + 9),
  };
});

const CountdownSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const invitation = useInvitation();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const targetDate = useMemo(() => {
    if (!invitation.wedding_date || !invitation.nikah_time) return new Date();
    
    // Parse the date (YYYY-MM-DD)
    const [year, month, day] = invitation.wedding_date.split('-').map(Number);
    
    // Parse the time gracefully supporting 12-hour AM/PM and 24-hour
    const timeString = invitation.nikah_time.trim();
    const isPM = timeString.toLowerCase().includes('pm');
    const isAM = timeString.toLowerCase().includes('am');
    
    // Remove AM/PM for parsing
    const cleanTime = timeString.replace(/am|pm/i, '').trim();
    const timeParts = cleanTime.split(':').map(Number);
    
    let hours = timeParts[0] || 0;
    let minutes = timeParts[1] || 0;
    let seconds = timeParts[2] || 0;

    if (isPM && hours < 12) {
      hours += 12;
    } else if (isAM && hours === 12) {
      hours = 0;
    }

    // Construct local date without string parsing ambiguities
    return new Date(year, month - 1, day, hours, minutes, seconds);
  }, [invitation.wedding_date, invitation.nikah_time]);

  const formattedDate = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(targetDate);
  }, [targetDate]);

  const formattedTime = useMemo(() => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(targetDate);
  }, [targetDate]);

  // Calculate time left
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft(); // initial call
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef.current);

      // Background particles continuous independent animation
      if (particlesRef.current) {
        const particleElements = particlesRef.current.children;
        Array.from(particleElements).forEach((el, index) => {
          const p = PARTICLES[index];
          gsap.to(el, {
            x: p.xDrift,
            y: p.yDrift,
            opacity: p.pulseOpacity,
            duration: p.duration,
            delay: p.delay,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        });
      }

      // ScrollTrigger Entrance Animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          // Step 2, 3, 4: Top Content
          tl.fromTo(
            q('.anim-crescent'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
          )
          .fromTo(
            q('.anim-eyebrow'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.6'
          )
          .fromTo(
            q('.anim-subheading'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.6'
          )
          // Step 5: Frame
          .fromTo(
            q('.anim-frame'),
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: 'power2.out' },
            '-=0.4'
          )
          // Step 6: Corner Stars
          .fromTo(
            q('.anim-corner-star'),
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 0.6, stagger: 0.1, ease: 'back.out(1.5)' },
            '-=0.6'
          )
          // Step 7: Vertical Separators
          .fromTo(
            q('.anim-separator'),
            { opacity: 0, scaleY: 0 },
            { opacity: 1, scaleY: 1, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
            '-=0.4'
          )
          // Step 8: Countdown Units
          .fromTo(
            q('.anim-unit'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out' },
            '-=0.6'
          )
          // Bottom Content
          .fromTo(
            q('.anim-bottom-note'),
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.4'
          )
          .fromTo(
            q('.anim-arabic'),
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.6'
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.countdownSection} id="countdown" ref={sectionRef}>
      
      {/* Background Particles */}
      <div className={styles.particlesContainer} ref={particlesRef}>
        {PARTICLES.map((p) => (
          <div 
            key={p.id} 
            className={styles.particle} 
            style={{
              top: `${p.top}%`,
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.baseOpacity,
              boxShadow: `0 0 ${p.size * 2.5}px ${p.size / 2}px rgba(210, 180, 113, 0.7)`
            }} 
          />
        ))}
      </div>

      <div className={styles.contentContainer}>
        {/* Top Content */}
        <svg className={`${styles.crescentIcon} anim-crescent`} style={{ opacity: 0 }} viewBox="0 0 34 34" fill="#E8CF8A" xmlns="http://www.w3.org/2000/svg">
          {/* Filled Crescent */}
          <path d="M 21 3.7 A 14.2 14.2 0 1 0 21 30.3 A 14 14 0 0 1 21 3.7 Z" />
          {/* Filled 5-Point Star */}
          <path d="M 24 13 L 25 15.8 L 28 15.8 L 25.6 17.6 L 26.5 20.6 L 24 18.8 L 21.5 20.6 L 22.4 17.6 L 20 15.8 L 23 15.8 Z" />
        </svg>

        <h2 className={`${styles.eyebrow} anim-eyebrow`} style={{ opacity: 0 }}>Until Our Nikah</h2>
        <p className={`${styles.subheading} anim-subheading`} style={{ opacity: 0 }}>COUNT DOWN</p>

        {/* Countdown Box */}
        <div className={styles.countdownFrameWrapper}>
          <div className={`${styles.countdownFrame} anim-frame`} style={{ opacity: 0 }}>
            
            {/* Corner Stars */}
            <svg className={`${styles.cornerStar} ${styles.topLeftStar} anim-corner-star`} style={{ opacity: 0 }} viewBox="0 0 24 24" fill="#06241B" stroke="#E8CF8A" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <svg className={`${styles.cornerStar} ${styles.topRightStar} anim-corner-star`} style={{ opacity: 0 }} viewBox="0 0 24 24" fill="#06241B" stroke="#E8CF8A" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <svg className={`${styles.cornerStar} ${styles.bottomLeftStar} anim-corner-star`} style={{ opacity: 0 }} viewBox="0 0 24 24" fill="#06241B" stroke="#E8CF8A" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <svg className={`${styles.cornerStar} ${styles.bottomRightStar} anim-corner-star`} style={{ opacity: 0 }} viewBox="0 0 24 24" fill="#06241B" stroke="#E8CF8A" strokeWidth="1" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>

            {/* Inner Frame */}
            <div className={styles.countdownInnerFrame}>
              {/* Units */}
            <div className={`${styles.countdownUnit} anim-unit`} style={{ opacity: 0 }}>
              <div className={styles.unitNumber}>
                {String(timeLeft.days).padStart(2, '0').split('').map((digit, i) => (
                  <span key={`day-${i}`} className={styles.digit}>{digit}</span>
                ))}
              </div>
              <span className={styles.unitLabel}>DAYS</span>
            </div>
            
            <div className={`${styles.separator} anim-separator`} style={{ opacity: 0 }}></div>

            <div className={`${styles.countdownUnit} anim-unit`} style={{ opacity: 0 }}>
              <div className={styles.unitNumber}>
                {String(timeLeft.hours).padStart(2, '0').split('').map((digit, i) => (
                  <span key={`hour-${i}`} className={styles.digit}>{digit}</span>
                ))}
              </div>
              <span className={styles.unitLabel}>HOURS</span>
            </div>

            <div className={`${styles.separator} anim-separator`} style={{ opacity: 0 }}></div>

            <div className={`${styles.countdownUnit} anim-unit`} style={{ opacity: 0 }}>
              <div className={styles.unitNumber}>
                {String(timeLeft.minutes).padStart(2, '0').split('').map((digit, i) => (
                  <span key={`min-${i}`} className={styles.digit}>{digit}</span>
                ))}
              </div>
              <span className={styles.unitLabel}>MIN</span>
            </div>

            <div className={`${styles.separator} anim-separator`} style={{ opacity: 0 }}></div>

            <div className={`${styles.countdownUnit} anim-unit`} style={{ opacity: 0 }}>
              <div className={styles.unitNumber}>
                {String(timeLeft.seconds).padStart(2, '0').split('').map((digit, i) => (
                  <span key={`sec-${i}`} className={styles.digit}>{digit}</span>
                ))}
              </div>
              <span className={styles.unitLabel}>SEC</span>
            </div>
            
            </div>
          </div>
        </div>

        {/* Bottom Content */}
        <p className={`${styles.bottomNote} anim-bottom-note`} style={{ opacity: 0 }}>
          Until our Nikah on {formattedDate} at {formattedTime}.
        </p>
        <p className={`${styles.arabicText} anim-arabic`} style={{ opacity: 0 }}>
          إن شاء الله
        </p>
      </div>
    </section>
  );
};

export default CountdownSection;
