import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

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

const EventsList: React.FC = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const [events, setEvents] = useState<WeddingEvent[]>([]);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Invitation Details
      const { data: invData, error: invError } = await supabase
        .from('invitations')
        .select('groom_name, bride_name, slug')
        .eq('id', invitationId)
        .single();
      
      if (invError) throw invError;
      setInvitationData(invData);

      // Fetch Events
      const { data: evtData, error: evtError } = await supabase
        .from('events')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('sort_order', { ascending: true });

      if (evtError) throw evtError;
      setEvents(evtData as WeddingEvent[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (invitationId) {
      fetchData();
    }
  }, [invitationId]);

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete the event "${title}"?`)) {
      try {
        const { error } = await supabase.from('events').delete().eq('id', id);
        if (error) throw error;
        fetchData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete event');
      }
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === events.length - 1)) {
      return;
    }

    const newEvents = [...events];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap sort_order
    const currentEvent = newEvents[index];
    const targetEvent = newEvents[targetIndex];

    const currentSort = currentEvent.sort_order;
    currentEvent.sort_order = targetEvent.sort_order;
    targetEvent.sort_order = currentSort;

    newEvents[index] = targetEvent;
    newEvents[targetIndex] = currentEvent;

    setEvents(newEvents); // Optimistic update

    try {
      await supabase.from('events').update({ sort_order: currentEvent.sort_order }).eq('id', currentEvent.id);
      await supabase.from('events').update({ sort_order: targetEvent.sort_order }).eq('id', targetEvent.id);
    } catch (err: any) {
      alert(err.message || 'Failed to update order');
      fetchData(); // Revert on failure
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin/invitations" style={{ color: '#4A8393', textDecoration: 'none', fontFamily: 'Jost, sans-serif' }}>
          &larr; Back to Invitations
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '24px', margin: 0, color: '#0B3D2E' }}>
            Events for {invitationData?.groom_name} & {invitationData?.bride_name}
          </h2>
          <p style={{ fontFamily: 'Jost, sans-serif', color: '#666', margin: '4px 0 0 0' }}>
            Slug: {invitationData?.slug}
          </p>
        </div>
        <Link 
          to={`/admin/invitations/${invitationId}/events/new`} 
          style={{
            backgroundColor: '#0B3D2E',
            color: '#F7F1DE',
            padding: '10px 16px',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontFamily: 'Jost, sans-serif'
          }}
        >
          + Add Event
        </Link>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Jost, sans-serif', fontSize: '14px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '12px 16px', color: '#666' }}>Order</th>
              <th style={{ padding: '12px 16px', color: '#666' }}>No.</th>
              <th style={{ padding: '12px 16px', color: '#666' }}>Event Title</th>
              <th style={{ padding: '12px 16px', color: '#666' }}>Date & Time</th>
              <th style={{ padding: '12px 16px', color: '#666' }}>Venue</th>
              <th style={{ padding: '12px 16px', color: '#666' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt, index) => (
              <tr key={evt.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                  <button onClick={() => handleMove(index, 'up')} disabled={index === 0} style={{ cursor: index === 0 ? 'not-allowed' : 'pointer', background: 'none', border: 'none', color: index === 0 ? '#ccc' : '#333' }}>&#9650;</button>
                  <span style={{ margin: '0 8px' }}>{evt.sort_order}</span>
                  <button onClick={() => handleMove(index, 'down')} disabled={index === events.length - 1} style={{ cursor: index === events.length - 1 ? 'not-allowed' : 'pointer', background: 'none', border: 'none', color: index === events.length - 1 ? '#ccc' : '#333' }}>&#9660;</button>
                </td>
                <td style={{ padding: '12px 16px' }}>{evt.event_number}</td>
                <td style={{ padding: '12px 16px' }}>
                  <strong>{evt.title}</strong>
                  <div style={{ fontSize: '12px', color: '#888' }}>{evt.urdu_title} | {evt.subtitle}</div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {evt.date_text} <br/>
                  <span style={{ color: '#888', fontSize: '12px' }}>{evt.time_text}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>{evt.venue}</td>
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                  <Link to={`/admin/invitations/${invitationId}/events/${evt.id}/edit`} style={{ marginRight: '12px', color: '#4A8393', textDecoration: 'none' }}>Edit</Link>
                  <button 
                    onClick={() => handleDelete(evt.id, evt.title)}
                    style={{ background: 'none', border: 'none', color: '#c5221f', cursor: 'pointer', padding: 0 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {events.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                  No events found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsList;
