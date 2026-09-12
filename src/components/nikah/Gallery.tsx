import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Gallery.module.css';

const Gallery: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const images = Array.from({ length: 6 }).map((_, i) => `https://picsum.photos/400/400?random=${i}`);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && sectionRef.current) {
          gsap.fromTo(
            sectionRef.current.querySelectorAll('.gsap-gallery-item'),
            { opacity: 0, scale: 0.9 },
            { opacity: 1, scale: 1, duration: 0.8, stagger: 0.15, ease: 'power2.out' }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.gallerySection} ref={sectionRef}>
      <h2 className={styles.sectionTitle}>Moments</h2>
      <div className={styles.grid}>
        {images.map((src, index) => (
          <div key={index} className={`${styles.imageWrapper} gsap-gallery-item`}>
            <img src={src} alt={`Gallery ${index}`} className={styles.image} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
