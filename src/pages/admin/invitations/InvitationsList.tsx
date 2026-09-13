import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import type { InvitationData } from '../../../contexts/InvitationContext';

const InvitationsList: React.FC = () => {
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data as InvitationData[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch invitations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleDelete = async (id: string, slug: string) => {
    if (window.confirm(`Are you sure you want to delete the invitation for "${slug}"? Related records may also be deleted.`)) {
      try {
        const { error } = await supabase.from('invitations').delete().eq('id', id);
        if (error) throw error;
        fetchInvitations();
      } catch (err: any) {
        alert(err.message || 'Failed to delete invitation');
      }
    }
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .update({ is_published: !currentStatus })
        .eq('id', id);
      
      if (error) throw error;
      fetchInvitations();
    } catch (err: any) {
      alert(err.message || 'Failed to update publish status');
    }
  };

  if (loading) return <div>Loading invitations...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '24px', margin: 0, color: '#0B3D2E' }}>Invitations</h2>
        <Link 
          to="/admin/invitations/new" 
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
          + Create Invitation
        </Link>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'Jost, sans-serif', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '12px 16px', color: '#666' }}>Couple</th>
                <th style={{ padding: '12px 16px', color: '#666' }}>Slug / URL</th>
                <th style={{ padding: '12px 16px', color: '#666' }}>Date</th>
                <th style={{ padding: '12px 16px', color: '#666' }}>Status</th>
                <th style={{ padding: '12px 16px', color: '#666' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invitations.map(inv => (
                <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <strong>{inv.groom_name} & {inv.bride_name}</strong>
                    <div style={{ fontSize: '12px', color: '#888' }}>{inv.venue_name}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div>{inv.slug}</div>
                    <Link to={`/invite/${inv.slug}`} target="_blank" style={{ fontSize: '12px', color: '#4A8393' }}>View Public Page</Link>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {inv.wedding_date}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <button 
                      onClick={() => togglePublish(inv.id, inv.is_published)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: inv.is_published ? '#e6f4ea' : '#fce8e6',
                        color: inv.is_published ? '#137333' : '#c5221f',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      {inv.is_published ? 'Published' : 'Unpublished'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Link to={`/admin/invitations/${inv.id}/events`} style={{ marginRight: '12px', color: '#0B3D2E', textDecoration: 'none', fontWeight: 600 }}>Manage Events</Link>
                    <Link to={`/admin/invitations/${inv.id}/edit`} style={{ marginRight: '12px', color: '#4A8393', textDecoration: 'none' }}>Edit</Link>
                    <button 
                      onClick={() => handleDelete(inv.id, inv.slug)}
                      style={{ background: 'none', border: 'none', color: '#c5221f', cursor: 'pointer', padding: 0 }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {invitations.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                    No invitations found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvitationsList;
