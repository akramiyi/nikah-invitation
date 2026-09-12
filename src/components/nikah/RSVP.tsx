import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './RSVP.module.css';

gsap.registerPlugin(ScrollTrigger);

const RSVP: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    attending: '',
    guests: '1',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate elements sequentially when scrolled into view
      gsap.fromTo(
        '.anim-rsvp',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRadioChange = (val: string) => {
    setFormData({ ...formData, attending: val });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    
    // Simulate submission delay
    setTimeout(() => {
      console.log('RSVP Submitted:', formData);
      setStatus('success');
    }, 1500);
  };

  return (
    <section id="rsvp" className={styles.rsvpSection} ref={sectionRef}>
      <div className={styles.contentWrapper}>
        <div className={`${styles.eyebrow} anim-rsvp`}>KINDLY RESPOND</div>
        <h2 className={`${styles.title} anim-rsvp`}>RSVP</h2>
        <p className={`${styles.description} anim-rsvp`}>
          We've saved you a seat — kindly let us know if you'll be joining us.
        </p>

        <form className={`${styles.form} anim-rsvp`} onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">Full Name</label>
            <input 
              className={styles.input}
              type="text" 
              id="name" 
              name="name" 
              placeholder="Your full name"
              required 
              value={formData.name} 
              onChange={handleChange} 
            />
          </div>

          {/* Mobile Number */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="mobile">Mobile Number</label>
            <input 
              className={styles.input}
              type="tel" 
              id="mobile" 
              name="mobile" 
              placeholder="+91 00000 00000"
              required 
              value={formData.mobile} 
              onChange={handleChange} 
            />
          </div>
          
          {/* Email Address */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input 
              className={styles.input}
              type="email" 
              id="email" 
              name="email" 
              placeholder="you@example.com"
              required 
              value={formData.email} 
              onChange={handleChange} 
            />
          </div>

          {/* Attendance */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Will you attend?</label>
            <div className={styles.radioGroup}>
              <label 
                className={`${styles.radioOption} ${formData.attending === 'accept' ? styles.selected : ''}`}
                onClick={() => handleRadioChange('accept')}
              >
                <input 
                  type="radio" 
                  name="attending" 
                  value="accept" 
                  className={styles.radioInput}
                  checked={formData.attending === 'accept'}
                  onChange={() => handleRadioChange('accept')}
                  required
                />
                <span className={styles.radioLabel}>JOYFULLY ACCEPT</span>
              </label>
              <label 
                className={`${styles.radioOption} ${formData.attending === 'decline' ? styles.selected : ''}`}
                onClick={() => handleRadioChange('decline')}
              >
                <input 
                  type="radio" 
                  name="attending" 
                  value="decline" 
                  className={styles.radioInput}
                  checked={formData.attending === 'decline'}
                  onChange={() => handleRadioChange('decline')}
                  required
                />
                <span className={styles.radioLabel}>REGRETFULLY DECLINE</span>
              </label>
            </div>
          </div>

          {/* Guests */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="guests">Number of Guests (Incl. you)</label>
            <select 
              className={styles.select}
              id="guests" 
              name="guests" 
              required 
              value={formData.guests} 
              onChange={handleChange}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="message">Message for the couple (Optional)</label>
            <textarea 
              className={styles.textarea}
              id="message" 
              name="message" 
              placeholder="Leave your wishes here..."
              value={formData.message} 
              onChange={handleChange}
            />
          </div>

          {status === 'success' ? (
            <div className={`${styles.formMessage} ${styles.success}`}>
              Thank you! Your response has been received.
            </div>
          ) : (
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={status === 'submitting'}
            >
              {status === 'submitting' ? 'SENDING...' : 'SEND RSVP'}
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

export default RSVP;
