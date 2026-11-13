import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import IntroAnimation from '../components/IntroAnimation/IntroAnimation';
import HeroSection from '../components/HeroSection/HeroSection';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import CoupleStory from '../components/nikah/CoupleStory';
import InvitationSection from '../components/nikah/InvitationSection';
import VenueSection from '../components/nikah/VenueSection';
import EventTimeline from '../components/nikah/EventTimeline';
import CountdownSection from '../components/nikah/CountdownSection';
import RSVP from '../components/nikah/RSVP';
import Blessings from '../components/nikah/Blessings';
import HostsContact from '../components/nikah/HostsContact';
import Footer from '../components/nikah/Footer';
import { supabase } from '../lib/supabase';
import { InvitationProvider } from '../contexts/InvitationContext';
import type { InvitationData } from '../contexts/InvitationContext';

const NikahInvite: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [introComplete, setIntroComplete] = useState(false);
  const [startAudio, setStartAudio] = useState(false);
  const [invitation, setInvitation] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();
        
        if (error) throw error;
        setInvitation(data as InvitationData);
      } catch (err) {
        setError('Invitation not found or unavailable');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchInvitation();
    } else {
      setError('Invalid link');
      setLoading(false);
    }
  }, [slug]);

  if (loading) {
    return (
      <div style={{
        height: '100dvh',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#051A11',
        color: '#E8CF8A',
        fontFamily: 'Cormorant Garamond, serif'
      }}>
        {/* Elegant Royal Crescent / Star Spinner */}
        <svg width="40" height="40" viewBox="0 0 34 34" fill="#E8CF8A" style={{ animation: 'spinCrescent 3s linear infinite', marginBottom: '20px' }}>
          <path d="M 21 3.7 A 14.2 14.2 0 1 0 21 30.3 A 14 14 0 0 1 21 3.7 Z" />
          <path d="M 24 13 L 25 15.8 L 28 15.8 L 25.6 17.6 L 26.5 20.6 L 24 18.8 L 21.5 20.6 L 22.4 17.6 L 20 15.8 L 23 15.8 Z" />
        </svg>
        <p style={{
          fontFamily: 'Jost, sans-serif',
          fontSize: '13px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#F4E8D3',
          opacity: 0.85
        }}>
          Preparing Invitation...
        </p>
        <style>{`
          @keyframes spinCrescent {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B3D2E', color: '#E8CF8A', fontFamily: 'Cormorant Garamond' }}>
        <h2>Invitation Unavailable</h2>
        <p style={{ fontFamily: 'Jost, sans-serif', fontSize: '14px', color: '#F7F1DE' }}>We couldn't find an active invitation at this link.</p>
      </div>
    );
  }

  return (
    <InvitationProvider invitation={invitation}>
      <div className="nikah-invite-page" style={{ position: 'relative' }}>
        {!introComplete && (
          <IntroAnimation 
            onComplete={() => setIntroComplete(true)} 
            onSealClick={() => setStartAudio(true)}
          />
        )}
        
        <HeroSection introComplete={introComplete} />
        
        {/* Global Audio Player Control */}
        <AudioPlayer playTrigger={startAudio} />
        
        <div style={{ position: 'relative', zIndex: 10, backgroundColor: 'var(--color-emerald)' }}>
          <CoupleStory />
          <InvitationSection />
          <VenueSection />
          <div id="schedule"><EventTimeline /></div>
          <CountdownSection />
          <div id="rsvp"><RSVP /></div>
          <Blessings />
          <HostsContact />
          <Footer />
        </div>
      </div>
    </InvitationProvider>
  );
};

export default NikahInvite;
