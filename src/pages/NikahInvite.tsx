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
        const cacheKey = `nikah_invitation_${slug}`;
        const cached = sessionStorage.getItem(cacheKey);
        
        // 1. Instant Cache Load (Zero Network Delay)
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setInvitation(parsed);
            setLoading(false);
          } catch (e) {
            console.error('Failed to parse cached invitation', e);
          }
        }

        // 2. Fetch specific columns only (no raw wildcard '*')
        const { data, error } = await supabase
          .from('invitations')
          .select('id, slug, groom_name, bride_name, groom_family, bride_family, groom_contact, bride_contact, wedding_date, nikah_time, venue_name, venue_address, venue_parking_note, venue_maps_url, hashtag, is_published')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();
        
        if (error) {
          if (!cached) throw error;
        } else if (data) {
          setInvitation(data as InvitationData);
          sessionStorage.setItem(cacheKey, JSON.stringify(data));
        }
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
        {/* Spinning Crescent & Dynamic Couple Names */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Spinning Crescent & Star */}
          <div style={{
            animation: 'spinCrescent 4s linear infinite',
            marginBottom: '26px'
          }}>
            <svg width="52" height="52" viewBox="0 0 34 34" fill="#E8CF8A" style={{ filter: 'drop-shadow(0 0 12px rgba(232, 207, 138, 0.8))' }}>
              <path d="M 21 3.7 A 14.2 14.2 0 1 0 21 30.3 A 14 14 0 0 1 21 3.7 Z" />
              <path d="M 24 13 L 25 15.8 L 28 15.8 L 25.6 17.6 L 26.5 20.6 L 24 18.8 L 21.5 20.6 L 22.4 17.6 L 20 15.8 L 23 15.8 Z" />
            </svg>
          </div>

          {/* Prominent Dynamic Couple Names (Bada aur saaf) */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '44px',
            color: '#F4E8D3',
            letterSpacing: '0.04em',
            margin: '0 0 10px 0',
            fontWeight: 500,
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.9)',
            animation: 'noorNameGlow 2.5s ease-in-out infinite'
          }}>
            {slugCoupleName}
          </h1>

          <span style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '12px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#E8CF8A',
            opacity: 0.85
          }}>
            NIKAH INVITATION
          </span>
        </div>

        <style>{`
          @keyframes spinCrescent {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes noorNameGlow {
            0%, 100% {
              filter: drop-shadow(0 0 6px rgba(232, 207, 138, 0.35)) brightness(0.9);
              opacity: 0.85;
              transform: scale(0.99);
            }
            50% {
              filter: drop-shadow(0 0 24px rgba(232, 207, 138, 0.9)) drop-shadow(0 0 45px rgba(201, 162, 75, 0.6)) brightness(1.25);
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
