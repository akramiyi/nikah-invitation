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
        padding: '20px',
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        {/* Glowing Royal Bismillah Calligraphy & Crescent */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'deepGlowPulse 2.4s ease-in-out infinite'
        }}>
          {/* Crescent & Star */}
          <svg width="44" height="44" viewBox="0 0 34 34" fill="#E8CF8A" style={{ marginBottom: '18px' }}>
            <path d="M 21 3.7 A 14.2 14.2 0 1 0 21 30.3 A 14 14 0 0 1 21 3.7 Z" />
            <path d="M 24 13 L 25 15.8 L 28 15.8 L 25.6 17.6 L 26.5 20.6 L 24 18.8 L 21.5 20.6 L 22.4 17.6 L 20 15.8 L 23 15.8 Z" />
          </svg>

          {/* Bismillah Calligraphy */}
          <h1 style={{
            fontFamily: "'Amiri', serif",
            fontSize: '32px',
            color: '#E8CF8A',
            margin: '0 0 12px 0',
            fontWeight: 700,
            direction: 'rtl',
            lineHeight: 1.4
          }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h1>

          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '18px',
            color: '#F4E8D3',
            letterSpacing: '0.15em',
            margin: '0',
            fontStyle: 'italic',
            opacity: 0.9
          }}>
            Noor-e-Nikah
          </p>
        </div>

        <style>{`
          @keyframes deepGlowPulse {
            0%, 100% {
              filter: drop-shadow(0 0 6px rgba(232, 207, 138, 0.3)) brightness(0.85);
              opacity: 0.75;
              transform: scale(0.98);
            }
            50% {
              filter: drop-shadow(0 0 24px rgba(232, 207, 138, 0.95)) drop-shadow(0 0 45px rgba(201, 162, 75, 0.7)) brightness(1.25);
              opacity: 1;
              transform: scale(1.02);
            }
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
