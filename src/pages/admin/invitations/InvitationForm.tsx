import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';

const InvitationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    groom_name: '',
    bride_name: '',
    groom_family: '',
    bride_family: '',
    groom_contact: '',
    bride_contact: '',
    wedding_date: '',
    nikah_time: '',
    venue_name: '',
    venue_address: '',
    venue_parking_note: '',
    venue_maps_url: '',
    hashtag: '',
    slug: '',
    is_published: false
  });

  useEffect(() => {
    if (id) {
      const fetchInvitation = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase.from('invitations').select('*').eq('id', id).single();
          if (error) throw error;
          if (data) {
            setFormData({
              groom_name: data.groom_name || '',
              bride_name: data.bride_name || '',
              groom_family: data.groom_family || '',
              bride_family: data.bride_family || '',
              groom_contact: data.groom_contact || '',
              bride_contact: data.bride_contact || '',
              wedding_date: data.wedding_date || '',
              nikah_time: data.nikah_time || '',
              venue_name: data.venue_name || '',
              venue_address: data.venue_address || '',
              venue_parking_note: data.venue_parking_note || '',
              venue_maps_url: data.venue_maps_url || '',
              hashtag: data.hashtag || '',
              slug: data.slug || '',
              is_published: data.is_published || false
            });
          }
        } catch (err: any) {
          setError('Failed to load invitation.');
        } finally {
          setLoading(false);
        }
      };
      fetchInvitation();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name === 'slug') {
      // Allow only lowercase, numbers, hyphens
      const formattedSlug = value.toLowerCase().replace(/[^a-z0-9-]/g, '');
      setFormData(prev => ({ ...prev, [name]: formattedSlug }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.slug) {
      setError('Slug is required');
      setLoading(false);
      return;
    }

    try {
      // Check slug uniqueness
      const { data: existingData } = await supabase
        .from('invitations')
        .select('id')
        .eq('slug', formData.slug)
        .maybeSingle();

      if (existingData && existingData.id !== id) {
        setError('Slug is already taken. Please choose a unique one.');
        setLoading(false);
        return;
      }

      if (id) {
        // Update
        const { error } = await supabase
          .from('invitations')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('invitations')
          .insert([{
            ...formData,
            created_by: user?.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
        
        if (error) throw error;
      }

      navigate('/admin/invitations');
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px', marginTop: '4px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'Jost, sans-serif' };
  const labelStyle = { display: 'block', marginBottom: '16px', fontSize: '14px', fontWeight: 600, color: '#333' };

  if (loading && id) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '28px', color: '#0B3D2E', marginTop: 0, marginBottom: '20px' }}>
        {id ? 'Edit Invitation' : 'Create Invitation'}
      </h2>
      
      {error && <div style={{ backgroundColor: '#fce8e6', color: '#c5221f', padding: '12px', borderRadius: '4px', marginBottom: '20px' }}>{error}</div>}

      <form onSubmit={handleSubmit} style={{ fontFamily: 'Jost, sans-serif' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <label style={labelStyle}>
            Groom Name
            <input type="text" name="groom_name" value={formData.groom_name} onChange={handleChange} style={inputStyle} required />
          </label>
          <label style={labelStyle}>
            Bride Name
            <input type="text" name="bride_name" value={formData.bride_name} onChange={handleChange} style={inputStyle} required />
          </label>

          <label style={labelStyle}>
            Groom Family (e.g., S/o Mr. & Mrs...)
            <textarea name="groom_family" value={formData.groom_family} onChange={handleChange} style={{...inputStyle, height: '60px'}} />
          </label>
          <label style={labelStyle}>
            Bride Family
            <textarea name="bride_family" value={formData.bride_family} onChange={handleChange} style={{...inputStyle, height: '60px'}} />
          </label>

          <label style={labelStyle}>
            Groom Contact Number
            <input type="text" name="groom_contact" value={formData.groom_contact} onChange={handleChange} style={inputStyle} placeholder="e.g. +91 98123 45678" />
          </label>
          <label style={labelStyle}>
            Bride Contact Number
            <input type="text" name="bride_contact" value={formData.bride_contact} onChange={handleChange} style={inputStyle} placeholder="e.g. +91 98765 12345" />
          </label>

          <label style={labelStyle}>
            Wedding Date
            <input type="text" name="wedding_date" value={formData.wedding_date} onChange={handleChange} style={inputStyle} placeholder="e.g. 2026-12-12 or December 12, 2026" required />
          </label>
          <label style={labelStyle}>
            Nikah Time
            <input type="text" name="nikah_time" value={formData.nikah_time} onChange={handleChange} style={inputStyle} />
          </label>

          <label style={labelStyle}>
            Venue Name
            <input type="text" name="venue_name" value={formData.venue_name} onChange={handleChange} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Venue Address
            <textarea name="venue_address" value={formData.venue_address} onChange={handleChange} style={{...inputStyle, height: '60px'}} />
          </label>

          <label style={labelStyle}>
            Hashtag
            <input type="text" name="hashtag" value={formData.hashtag} onChange={handleChange} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            Slug (URL path)
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} style={inputStyle} placeholder="e.g. akram-ayesha" required />
            <small style={{ fontWeight: 'normal', color: '#666', marginTop: '4px', display: 'block' }}>Only lowercase letters, numbers, and hyphens.</small>
          </label>
        </div>

        <label style={labelStyle}>
          Venue Parking Note
          <input type="text" name="venue_parking_note" value={formData.venue_parking_note} onChange={handleChange} style={inputStyle} />
        </label>

        <label style={labelStyle}>
          Venue Maps URL
          <input type="text" name="venue_maps_url" value={formData.venue_maps_url} onChange={handleChange} style={inputStyle} />
        </label>

        <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '20px' }}>
          <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
          Publish Invitation (make it publicly accessible)
        </label>

        <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
          <button type="submit" disabled={loading} style={{ backgroundColor: '#0B3D2E', color: '#F7F1DE', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 600 }}>
            {loading ? 'Saving...' : 'Save Invitation'}
          </button>
          <button type="button" onClick={() => navigate('/admin/invitations')} style={{ backgroundColor: '#f1f1f1', color: '#333', padding: '12px 24px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvitationForm;
