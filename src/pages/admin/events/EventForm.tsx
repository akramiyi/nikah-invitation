import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';

const EventForm: React.FC = () => {
  const { invitationId, eventId } = useParams<{ invitationId: string, eventId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    event_number: '',
    title: '',
    date_text: '',
    time_text: '',
    urdu_title: '',
    subtitle: '',
    venue: '',
    sort_order: 1
  });

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase.from('events').select('*').eq('id', eventId).single();
          if (error) throw error;
          if (data) {
            setFormData({
              event_number: data.event_number || '',
              title: data.title || '',
              date_text: data.date_text || '',
              time_text: data.time_text || '',
              urdu_title: data.urdu_title || '',
              subtitle: data.subtitle || '',
              venue: data.venue || '',
              sort_order: data.sort_order || 1
            });
          }
        } catch (err: any) {
          setError('Failed to load event.');
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [eventId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (eventId) {
        // Update
        const { error } = await supabase
          .from('events')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', eventId);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('events')
          .insert([{
            ...formData,
            invitation_id: invitationId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        
        if (error) throw error;
      }

      navigate(`/admin/invitations/${invitationId}/events`);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', marginTop: '4px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Jost, sans-serif' };
  const labelStyle = { display: 'block', marginBottom: '16px', fontSize: '14px', fontWeight: 600, color: '#333' };

  if (loading && eventId) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ marginBottom: '20px' }}>
        <Link to={`/admin/invitations/${invitationId}/events`} style={{ color: '#4A8393', textDecoration: 'none', fontFamily: 'Jost, sans-serif' }}>
          &larr; Back to Events
        </Link>
      </div>

      <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '28px', color: '#0B3D2E', marginTop: 0, marginBottom: '20px' }}>
        {eventId ? 'Edit Event' : 'Create Event'}
      </h2>
      
      {error && <div style={{ backgroundColor: '#fce8e6', color: '#c5221f', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ fontFamily: 'Jost, sans-serif' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <label style={labelStyle}>
            Event Number (e.g. 01)
            <input type="text" name="event_number" value={formData.event_number} onChange={handleChange} style={inputStyle} required />
          </label>
          <label style={labelStyle}>
            Title (e.g. Mangni)
            <input type="text" name="title" value={formData.title} onChange={handleChange} style={inputStyle} required />
          </label>

          <label style={labelStyle}>
            Date Text (e.g. 10 DEC)
            <input type="text" name="date_text" value={formData.date_text} onChange={handleChange} style={inputStyle} required />
          </label>
          <label style={labelStyle}>
            Time Text (e.g. 7:00 PM)
            <input type="text" name="time_text" value={formData.time_text} onChange={handleChange} style={inputStyle} required />
          </label>

          <label style={labelStyle}>
            Urdu Title (optional)
            <input type="text" name="urdu_title" value={formData.urdu_title} onChange={handleChange} style={inputStyle} dir="rtl" />
          </label>
          <label style={labelStyle}>
            Sort Order
            <input type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} style={inputStyle} required />
          </label>
        </div>

        <label style={labelStyle}>
          Subtitle (e.g. The beginning of our beautiful journey)
          <input type="text" name="subtitle" value={formData.subtitle} onChange={handleChange} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Venue
          <textarea name="venue" value={formData.venue} onChange={handleChange} style={{...inputStyle, height: '60px'}} required />
        </label>

        <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
          <button type="submit" disabled={loading} style={{ backgroundColor: '#0B3D2E', color: '#F7F1DE', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 600 }}>
            {loading ? 'Saving...' : 'Save Event'}
          </button>
          <button type="button" onClick={() => navigate(`/admin/invitations/${invitationId}/events`)} style={{ backgroundColor: '#f1f1f1', color: '#333', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
