import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

export interface WeddingEvent {
  id: string;
  invitation_id: string;
  event_number: string | number;
  title: string;
  date_text: string;
  time_text: string;
  urdu_title: string;
  subtitle: string;
  venue: string;
  sort_order: number;
}

interface Invitation {
  id: string;
  groom_name: string;
  bride_name: string;
}

const EventsList: React.FC = () => {
  const { invitationId: paramInvitationId } = useParams<{ invitationId: string }>();
  const { role, user } = useAuth();

  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>(paramInvitationId || '');
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, [role, user]);

  useEffect(() => {
    if (selectedInvitationId) {
      fetchData(selectedInvitationId);
    } else {
      setEvents([]);
      setInvitationData(null);
    }
  }, [selectedInvitationId]);

  const fetchInvitations = async () => {
    if (!role) return;
    try {
      if (role === 'super_admin') {
        const { data, error } = await supabase
          .from('invitations')
          .select('id, groom_name, bride_name')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInvitations(data || []);
        if (data && data.length > 0 && !selectedInvitationId) {
          setSelectedInvitationId(data[0].id);
        }
      } else if (role === 'friend' && user) {
        const { data, error } = await supabase
          .from('invitation_members')
          .select('invitation_id, invitation:invitations(id, groom_name, bride_name)')
          .eq('user_id', user.id);

        if (error) throw error;
        
        const assignedInvs = (data || []).map((m: any) => m.invitation).filter(Boolean);
        setInvitations(assignedInvs);
        
        if (assignedInvs.length > 0 && !selectedInvitationId) {
          setSelectedInvitationId(assignedInvs[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error fetching invitations:', err);
      setError(err.message);
    }
  };

  const fetchData = async (invId: string) => {
    setLoading(true);
    try {
      // Fetch Invitation Details
      const { data: invData, error: invError } = await supabase
        .from('invitations')
        .select('groom_name, bride_name, slug')
        .eq('id', invId)
        .single();
      
      if (invError) throw invError;
      setInvitationData(invData);

      // Fetch Events
      const { data: evtData, error: evtError } = await supabase
        .from('events')
        .select('*')
        .eq('invitation_id', invId)
        .order('sort_order', { ascending: true });

      if (evtError) throw evtError;
      setEvents(evtData as WeddingEvent[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete the event "${title}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setEvents(events.filter(e => e.id !== id));
    } catch (err: any) {
      alert('Error deleting event: ' + err.message);
    }
  };

  if (loading && !invitations.length) {
    return <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Jost, sans-serif' }}>Loading events...</div>;
  }

  const selectStyle: React.CSSProperties = {
    padding: '10px 16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontFamily: 'Jost, sans-serif',
    fontSize: '15px',
    minWidth: '300px',
    backgroundColor: '#fff'
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '32px', color: '#0B3D2E', margin: '0 0 8px 0' }}>
            Events Management
          </h2>
          {invitationData && (
            <p style={{ fontFamily: 'Jost', fontSize: '15px', color: '#666', margin: 0 }}>
              {invitationData.groom_name} & {invitationData.bride_name} 
              <span style={{ color: '#ccc', margin: '0 8px' }}>|</span> 
              <a href={`/invite/${invitationData.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#0B3D2E', textDecoration: 'none' }}>View Live</a>
            </p>
          )}
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <select 
            style={selectStyle}
            value={selectedInvitationId}
            onChange={(e) => setSelectedInvitationId(e.target.value)}
          >
            <option value="" disabled>Select an invitation...</option>
            {invitations.map(inv => (
              <option key={inv.id} value={inv.id}>
                {inv.groom_name} & {inv.bride_name}
              </option>
            ))}
          </select>
          
          <Link 
            to={`/admin/invitations/${selectedInvitationId}/events/new`}
            style={{ 
              backgroundColor: '#0B3D2E', 
              color: '#F7F1DE', 
              padding: '10px 20px', 
              borderRadius: '4px', 
              textDecoration: 'none', 
              fontFamily: 'Jost', 
              fontWeight: 500,
              whiteSpace: 'nowrap',
              pointerEvents: selectedInvitationId ? 'auto' : 'none',
              opacity: selectedInvitationId ? 1 : 0.5
            }}
          >
            + Add Event
          </Link>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: '#fce8e6', color: '#c5221f', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}>
          {error}
        </div>
      )}

      {loading && invitations.length > 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Jost, sans-serif' }}>Loading events...</div>
      ) : events.length === 0 ? (
        <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Jost', color: '#666', margin: '0 0 16px 0' }}>No events added to this invitation yet.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Jost, sans-serif' }}>
            <thead style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '16px', color: '#4a5568', fontWeight: 600 }}>Order</th>
                <th style={{ padding: '16px', color: '#4a5568', fontWeight: 600 }}>Title</th>
                <th style={{ padding: '16px', color: '#4a5568', fontWeight: 600 }}>Date & Time</th>
                <th style={{ padding: '16px', color: '#4a5568', fontWeight: 600 }}>Venue</th>
                <th style={{ padding: '16px', color: '#4a5568', fontWeight: 600 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => (
                <tr key={event.id} style={{ borderBottom: idx === events.length - 1 ? 'none' : '1px solid #edf2f7' }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ backgroundColor: '#edf2f7', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '14px' }}>
                      {event.sort_order}
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 500, color: '#2d3748', marginBottom: '4px' }}>{event.title}</div>
                    <div style={{ fontSize: '13px', color: '#718096' }}>{event.subtitle}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ color: '#2d3748', marginBottom: '4px' }}>{event.date_text}</div>
                    <div style={{ fontSize: '13px', color: '#718096' }}>{event.time_text}</div>
                  </td>
                  <td style={{ padding: '16px', color: '#4a5568' }}>{event.venue}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <Link 
                        to={`/admin/invitations/${selectedInvitationId}/events/${event.id}/edit`}
                        style={{ color: '#0B3D2E', textDecoration: 'none', fontWeight: 500 }}
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(event.id, event.title)}
                        style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontWeight: 500, padding: 0 }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventsList;
