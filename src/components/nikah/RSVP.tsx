import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './RSVP.module.css';
import { useInvitation } from '../../contexts/InvitationContext';
import { supabase } from '../../lib/supabase';

gsap.registerPlugin(ScrollTrigger);

const RSVP: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  const invitation = useInvitation();
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    attending: '',
    guests: '1',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'submitting' || status === 'success') return;
    
    setErrorMsg('');
    setStatus('submitting');
    
    if (!invitation?.id) {
      setErrorMsg('No invitation context found.');
      setStatus('error');
      return;
    }
    
    if (!formData.name || !formData.mobile || !formData.attending) {
      setErrorMsg('Please fill in all required fields.');
      setStatus('error');
      return;
    }

    const attendanceValue = formData.attending === 'accept' ? 'accepted' : 'declined';
    const guestCount = parseInt(formData.guests, 10);
    
    if (guestCount < 1 || isNaN(guestCount)) {
      setErrorMsg('Invalid guest count.');
      setStatus('error');
      return;
    }

    try {
      const payload = {
        invitation_id: invitation.id,
        full_name: formData.name,
        mobile_number: formData.mobile,
        email: formData.email || null,
        attendance: attendanceValue,
        guest_count: guestCount,
        message: formData.message || null
      };
      
      console.log('RSVP invitation ID:', invitation.id);
      console.log('RSVP invitation slug:', invitation.slug);
      console.log('RSVP payload:', payload);
      
      const { data, error } = await supabase.from('rsvps').insert(payload).select().single();

      if (error) {
        console.error('RSVP Insert Error:', error);
        setErrorMsg('Failed to submit RSVP. Please try again.');
        setStatus('error');
      } else if (!data) {
        console.error('RSVP Insert Failed: No data returned. Possible RLS violation.');
        setErrorMsg('Failed to submit RSVP due to security policies.');
        setStatus('error');
      } else {
        console.log('RSVP Insert Success:', data);
        setStatus('success');
      }
    } catch (err) {
      console.error('RSVP Exception:', err);
      setErrorMsg('An unexpected error occurred. Please try again.');
      setStatus('error');
    }
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
            <>
              {status === 'error' && (
                <div className={`${styles.formMessage} ${styles.error}`} style={{ color: '#e74c3c', marginBottom: '16px', fontSize: '14px', textAlign: 'center' }}>
                  {errorMsg}
                </div>
              )}
              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'SENDING...' : 'SEND RSVP'}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export default RSVP;
