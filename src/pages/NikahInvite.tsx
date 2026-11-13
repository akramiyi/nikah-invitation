import React, { useState, useEffect, useMemo } from 'react';
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

  // Parse couple names from slug for instant preview during initial loading
  const slugCoupleName = useMemo(() => {
    if (!slug) return 'Noor-e-Nikah';
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' & ');
  }, [slug]);

  useEffect(() => {
    // Dynamic browser tab title per invitation
    if (invitation) {
      document.title = `${invitation.groom_name} & ${invitation.bride_name} | Nikah Invitation`;
    } else if (slugCoupleName) {
      document.title = `${slugCoupleName} | Nikah Invitation`;
    }
  }, [invitation, slugCoupleName]);

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
        {/* Glowing Royal Bismillah Calligraphy & Spinning Crescent */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Spinning Crescent & Star */}
          <div style={{
            animation: 'spinCrescent 4s linear infinite',
            marginBottom: '22px'
          }}>
            <svg width="48" height="48" viewBox="0 0 34 34" fill="#E8CF8A" style={{ filter: 'drop-shadow(0 0 10px rgba(232, 207, 138, 0.7))' }}>
              <path d="M 21 3.7 A 14.2 14.2 0 1 0 21 30.3 A 14 14 0 0 1 21 3.7 Z" />
              <path d="M 24 13 L 25 15.8 L 28 15.8 L 25.6 17.6 L 26.5 20.6 L 24 18.8 L 21.5 20.6 L 22.4 17.6 L 20 15.8 L 23 15.8 Z" />
            </svg>
          </div>

          {/* Bismillah Calligraphy with Deep Golden Glow (Brightness badegi aur ghotegi) */}
          <h1 style={{
            fontFamily: "'Amiri', serif",
            fontSize: '34px',
            color: '#F4E8D3',
            margin: '0 0 14px 0',
            fontWeight: 700,
            direction: 'rtl',
            lineHeight: 1.4,
            animation: 'noorBismillahGlow 2.5s ease-in-out infinite'
          }}>
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </h1>

          {/* Dynamic Couple Name derived from slug */}
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '22px',
            color: '#E8CF8A',
            letterSpacing: '0.12em',
            margin: '0 0 6px 0',
            fontWeight: 500,
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
            animation: 'noorTextGlow 2.5s ease-in-out infinite'
          }}>
            {slugCoupleName}
          </p>

          <span style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#C9A24B',
            opacity: 0.8
          }}>
            Wedding Invitation
          </span>
        </div>

        <style>{`
          @keyframes spinCrescent {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes noorBismillahGlow {
            0%, 100% {
              filter: drop-shadow(0 0 4px rgba(232, 207, 138, 0.4)) brightness(0.85);
              opacity: 0.75;
            }
            50% {
              filter: drop-shadow(0 0 20px rgba(232, 207, 138, 1)) drop-shadow(0 0 35px rgba(201, 162, 75, 0.8)) brightness(1.35);
              opacity: 1;
            }
          }
          @keyframes noorTextGlow {
            0%, 100% {
              opacity: 0.7;
              filter: brightness(0.9);
            }
            50% {
              opacity: 1;
              filter: drop-shadow(0 0 12px rgba(232, 207, 138, 0.8)) brightness(1.2);
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
