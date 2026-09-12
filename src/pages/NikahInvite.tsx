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
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0B3D2E', color: '#E8CF8A', fontFamily: 'Cormorant Garamond' }}>Loading Invitation...</div>;
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
