import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './CoupleStory.module.css';

gsap.registerPlugin(ScrollTrigger);

const CoupleStory: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Use GSAP ScrollTrigger for 100% reliable scroll detection
    // IntersectionObserver can fail on mobile if the element height exceeds the viewport
    const elements = sectionRef.current.querySelectorAll('.scroll-anim');
    
    // Set initial hidden state
    gsap.set(elements, { opacity: 0, y: 30 });

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 85%", // Triggers reliably when the top of the section enters the bottom 15% of the screen
      once: true, // Guarantees it stays visible after triggering
      onEnter: () => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power2.out'
        });
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section className={styles.verseSection} ref={sectionRef}>
      <div className={styles.container}>
        {/* 2. Gold Arch Icon */}
        <div className={`${styles.archIcon} scroll-anim`}>
          <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.875,36 L1.875,15.375 A13.125,13.125 0 0,1 28.125,15.375 L28.125,36" stroke="#E8CF8A" strokeWidth="1" />
            <path d="M7.5,36 L7.5,17.91 A7.5,7.5 0 0,1 22.5,17.91 L22.5,36" stroke="#E8CF8A" strokeWidth="1" />
            <circle cx="15" cy="14" r="1.5" fill="#E8CF8A" />
          </svg>
        </div>

        {/* 3. Arabic Verse */}
        <p className={`${styles.arabicVerse} scroll-anim`} dir="rtl">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً
        </p>

        {/* 4. English Translation */}
        <p className={`${styles.englishTranslation} scroll-anim`}>
          "And among His signs is that He created for you spouses from among<br/>
          yourselves, that you may find tranquility in them; and He placed between you<br/>
          affection and mercy."
        </p>

        {/* 5. Surah Reference */}
        <p className={`${styles.surahRef} scroll-anim`}>
          SURAH AR-RUM 30:21
        </p>
      </div>
    </section>
  );
};

export default CoupleStory;
