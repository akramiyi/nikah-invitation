import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './EventTimeline.module.css';

gsap.registerPlugin(ScrollTrigger);

const events = [
  {
    id: '01',
    title: 'Mangni',
    urduTitle: 'منگنی',
    subtitle: 'Engagement',
    date: '10 DECEMBER · 6:00 PM',
    venue: 'Khan Residence, Lucknow',
  },
  {
    id: '02',
    title: 'Mehendi',
    urduTitle: 'مہندی',
    subtitle: 'Henna Ceremony',
    date: '11 DECEMBER',
    venue: 'Residence of the Bride',
  },
  {
    id: '03',
    title: 'Nikah',
    urduTitle: 'نکاح',
    subtitle: 'Wedding Ceremony',
    date: '12 DECEMBER',
    venue: 'Central Mosque, Hazratganj',
  },
  {
    id: '04',
    title: 'Walima',
    urduTitle: 'ولیمہ',
    subtitle: 'Wedding Reception',
    date: '12 DECEMBER',
    venue: 'Noor Banquet & Gardens',
  },
];

const EventTimeline: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sectionRef.current);

      // 1. Initial reveal animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          tl.fromTo(
            q('.anim-eyebrow'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
          )
          .fromTo(
            q('.anim-title'),
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
            '-=0.6'
          )
          .fromTo(
            q('.anim-divider'),
            { opacity: 0, scaleX: 0.8 },
            { opacity: 1, scaleX: 1, duration: 0.8, ease: 'power2.out' },
            '-=0.6'
          )
          .fromTo(
            q(`.${styles.timelineLine}`),
            { opacity: 0 },
            { opacity: 1, duration: 1, ease: 'power1.inOut' },
            '-=0.2'
          );

        }
      });

      // 1.5. Reveal nodes and cards as they scroll into view
      events.forEach((_, i) => {
        const isLeft = i % 2 === 0;
        ScrollTrigger.create({
          trigger: q(`.anim-card-${i}`)[0],
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              q(`.anim-card-${i}`),
              { opacity: 0, x: isLeft ? -20 : 20, y: 30 },
              { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power2.out' }
            );

            gsap.fromTo(
              q(`.anim-card-text-${i}`),
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
            );

            gsap.fromTo(
              q(`.anim-node-${i}`),
              { opacity: 0, scale: 0.5, xPercent: -50, yPercent: -50 },
              { opacity: 1, scale: 1, xPercent: -50, yPercent: -50, duration: 0.4, ease: 'power2.out' }
            );
          }
        });
      });

      // 2. Scrub animation for the slider/progress line
      ScrollTrigger.create({
        trigger: q(`.${styles.timelineContainer}`)[0],
        start: 'top 50%',
        end: 'bottom 60%',
        scrub: 1,
        animation: gsap.fromTo(
          q('.anim-progress'),
          { height: '0%' },
          { height: '100%', ease: 'none' }
        )
      });

      // 3. Node lighting triggers (when slider dot reaches them)
      events.forEach((_, i) => {
        ScrollTrigger.create({
          trigger: q(`.anim-node-${i}`)[0],
          start: 'top 55%', // triggers when the node is near the center of the screen (where the dot is)
          onEnter: () => q(`.anim-node-${i}`)[0].classList.add('is-lit'),
          onLeaveBack: () => q(`.anim-node-${i}`)[0].classList.remove('is-lit')
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.timelineSection} id="events" ref={sectionRef}>
      <div className={styles.timelineSectionInner}>
        
        <p className={`${styles.eyebrow} anim-eyebrow`} style={{ opacity: 0 }}>CELEBRATING TOGETHER</p>
        <h2 className={`${styles.sectionTitle} anim-title`} style={{ opacity: 0 }}>Wedding Events</h2>
        
        <div className={`${styles.divider} anim-divider`} style={{ opacity: 0 }}>
          <svg width="160" height="24" viewBox="0 0 160 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 12h58" stroke="#D2B471" strokeWidth="1"/>
            <path d="M102 12h58" stroke="#D2B471" strokeWidth="1"/>
            <path d="M80 3C78 6 76 9 76 12C76 15 78 18 80 21C82 18 84 15 84 12C84 9 82 6 80 3Z" fill="none" stroke="#D2B471" strokeWidth="1"/>
            <circle cx="80" cy="12" r="1.5" fill="#D2B471"/>
          </svg>
        </div>

        <div className={styles.timelineContainer}>
          
          <div className={styles.timelineLine}>
            {/* Scroll-driven progress line & slider dot */}
            <div className={`${styles.timelineProgress} anim-progress`}>
              <div className={styles.sliderDot}></div>
            </div>
          </div>

          {events.map((event, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div key={index} className={styles.eventRow}>
                
                {/* Central Node */}
                <div className={`${styles.timelineNode} anim-node-${index}`} style={{ opacity: 0 }}>
                  
                  {/* Lit State: Gold 4-line box with Gold Star */}
                  <div className={styles.litState}>
                    <svg className={styles.octagonBg} width="58" height="58" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 0.5 L 44 0.5 M 57.5 14 L 57.5 44 M 44 57.5 L 14 57.5 M 0.5 44 L 0.5 14" stroke="#C19A5B" strokeWidth="1.5" />
                    </svg>
                    <svg className={styles.starIcon} width="22" height="22" viewBox="0 0 24 24" fill="#C19A5B" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>

                  {/* Unlit State: Grey Octagon with Dark Star */}
                  <div className={styles.unlitState}>
                    <div className={styles.greyOctagonShape}>
                      <svg className={styles.starIcon} width="22" height="22" viewBox="0 0 24 24" fill="#555" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    </div>
                  </div>

                </div>
                {/* Event Card */}
                <div className={`${styles.cardContainer} ${isLeft ? styles.leftCardContainer : styles.rightCardContainer}`}>
                  <div className={`${styles.eventCard} ${isLeft ? styles.leftCard : styles.rightCard} anim-card-${index}`} style={{ opacity: 0 }}>
                    
                    {/* Corner Brackets */}
                    <div className={`${styles.cornerBracket} ${styles.cornerTopLeft}`}></div>
                    <div className={`${styles.cornerBracket} ${styles.cornerBottomRight}`}></div>
                    
                    <div className={`${styles.badge} anim-card-text-${index}`} style={{ opacity: 0 }}>
                      <div className={styles.badgeNumber}>{event.id}</div>
                      <h4 className={styles.badgeDate}>{event.date}</h4>
                    </div>

                    <div className={`${styles.titleRow} anim-card-text-${index}`} style={{ opacity: 0 }}>
                      <h3 className={styles.cardTitle}>{event.title}</h3>
                      <span className={styles.cardTitleUrdu}>{event.urduTitle}</span>
                    </div>
                    <p className={`${styles.cardSubtitle} anim-card-text-${index}`} style={{ opacity: 0 }}>{event.subtitle}</p>
                    <p className={`${styles.cardVenue} anim-card-text-${index}`} style={{ opacity: 0 }}>{event.venue}</p>

                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default EventTimeline;
