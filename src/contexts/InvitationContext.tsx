import React, { createContext, useContext } from 'react';

export interface InvitationData {
  id: string;
  slug: string;
  groom_name: string;
  bride_name: string;
  groom_family: string;
  bride_family: string;
  wedding_date: string;
  nikah_time: string;
  venue_name: string;
  venue_address: string;
  venue_parking_note: string;
  venue_maps_url: string;
  hashtag: string;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

const InvitationContext = createContext<InvitationData | null>(null);

export const InvitationProvider: React.FC<{
  invitation: InvitationData;
  children: React.ReactNode;
}> = ({ invitation, children }) => {
  return (
    <InvitationContext.Provider value={invitation}>
      {children}
    </InvitationContext.Provider>
  );
};

export const useInvitation = () => {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error('useInvitation must be used within an InvitationProvider');
  }
  return context;
};
