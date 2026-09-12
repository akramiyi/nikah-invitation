import React, { useEffect, useRef } from 'react';
import { useInvitation } from '../../contexts/InvitationContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HostsContact.module.css';

gsap.registerPlugin(ScrollTrigger);

const HostsContact: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const invitation = useInvitation();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Subtle entrance animation
      gsap.fromTo(
        '.anim-contact',
        { opacity: 0, y: 15, filter: 'blur(5px)' },
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
    <section className={styles.hostsSection} id="hosts" ref={sectionRef}>
      <div className={styles.contentWrapper}>
        
        <div className={`${styles.eyebrow} anim-contact`}>GET IN TOUCH</div>
        <h2 className={`${styles.title} anim-contact`}>Hosts & Contact</h2>
        
        {/* Decorative Divider */}
        <div className={`${styles.divider} anim-contact`}>
          <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="0" y1="10" x2="85" y2="10" stroke="#C2A878" strokeWidth="1"/>
            <rect x="95" y="5" width="10" height="10" transform="rotate(45 100 10)" stroke="#C2A878" strokeWidth="1" fill="none"/>
            <line x1="115" y1="10" x2="200" y2="10" stroke="#C2A878" strokeWidth="1"/>
          </svg>
        </div>

        <div className={styles.hostsContainer}>
          
          {/* Left Column: Groom's Family */}
          <div className={`${styles.hostColumn} anim-contact`}>
            <h3 className={styles.familyLabel}>GROOM'S FAMILY</h3>
            <div className={styles.personName}>{invitation.groom_name}</div>
            <p className={styles.parentInfo}>
              {invitation.groom_family}
            </p>
            {invitation.groom_contact && (
              <a href={`tel:${invitation.groom_contact.replace(/\D/g, '')}`} className={styles.phoneNumber}>
                {invitation.groom_contact}
              </a>
            )}
          </div>

          <div className={`${styles.verticalDivider} anim-contact`}></div>
          <div className={`${styles.mobileDivider} anim-contact`}></div>

          {/* Right Column: Bride's Family */}
          <div className={`${styles.hostColumn} anim-contact`}>
            <h3 className={styles.familyLabel}>BRIDE'S FAMILY</h3>
            <div className={styles.personName}>{invitation.bride_name}</div>
            <p className={styles.parentInfo}>
              {invitation.bride_family}
            </p>
            {invitation.bride_contact && (
              <a href={`tel:${invitation.bride_contact.replace(/\D/g, '')}`} className={styles.phoneNumber}>
                {invitation.bride_contact}
              </a>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HostsContact;
