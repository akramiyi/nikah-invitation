import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './LocationMap.module.css';

const LocationMap: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && sectionRef.current) {
          gsap.fromTo(
            sectionRef.current.querySelector('.gsap-map'),
            { opacity: 0, scale: 0.95 },
            { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }
          );
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.locationSection} ref={sectionRef}>
      <h2 className={styles.sectionTitle}>Venue Location</h2>
      <div className={styles.container}>
        <div className={styles.details}>
          <h3 className={styles.venueName}>Central Mosque</h3>
          <p className={styles.address}>123 Wedding Boulevard, Celebration City, 12345</p>
        </div>
        <div className={`${styles.mapContainer} gsap-map`}>
          {/* Placeholder for Google Maps */}
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115132.86317208742!2d-74.1359339!3d40.712775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1689234850123!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={false} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
