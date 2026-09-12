import React, { useState } from 'react';
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

const NikahInvite: React.FC = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [startAudio, setStartAudio] = useState(false);

  return (
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
  );
};

export default NikahInvite;
