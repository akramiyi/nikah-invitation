import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './RSVPsList.module.css';

interface RSVP {
  id: string;
  invitation_id: string;
  full_name: string;
  mobile_number: string;
  email: string | null;
  attendance: 'accepted' | 'declined';
  guest_count: number;
  message: string | null;
  created_at: string;
}

interface Invitation {
  id: string;
  groom_name: string;
  bride_name: string;
}

const RSVPsList: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>('');
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { role, user } = useAuth();
  
  useEffect(() => {
    fetchInvitations();
  }, [role, user]);

  useEffect(() => {
    if (selectedInvitationId) {
      fetchRsvps(selectedInvitationId);
    } else {
      setRsvps([]);
    }
  }, [selectedInvitationId]);

  const fetchInvitations = async () => {
    if (!role) return;
    
    setLoading(true);
    try {
      if (role === 'super_admin') {
        const { data, error } = await supabase
          .from('invitations')
          .select('id, groom_name, bride_name')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInvitations(data || []);
        if (data && data.length > 0) {
          setSelectedInvitationId(data[0].id);
        }
      } else if (role === 'friend' && user) {
        const { data, error } = await supabase
          .from('invitation_members')
          .select('invitation_id, invitation:invitations(id, groom_name, bride_name)')
          .eq('user_id', user.id);

        if (error) throw error;
        
        // Extract the invitation details
        const assignedInvs = (data || []).map((m: any) => m.invitation).filter(Boolean);
        setInvitations(assignedInvs);
        
        if (assignedInvs.length > 0) {
          setSelectedInvitationId(assignedInvs[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error fetching invitations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRsvps = async (invitationId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rsvps')
        .select('*')
        .eq('invitation_id', invitationId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRsvps(data || []);
    } catch (err: any) {
      console.error('Error fetching RSVPs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (rsvps.length === 0) return;

    const headers = ['Guest Name', 'Mobile', 'Email', 'Attendance', 'Number of Guests', 'Message', 'Submitted At'];
    
    const csvContent = [
      headers.join(','),
      ...rsvps.map(r => {
        return [
          `"${r.full_name.replace(/"/g, '""')}"`,
          `"${r.mobile_number}"`,
          `"${r.email || ''}"`,
          `"${r.attendance}"`,
          r.guest_count,
          `"${(r.message || '').replace(/"/g, '""')}"`,
          `"${new Date(r.created_at).toLocaleString()}"`
        ].join(',');
      })
    ].join('\n');

    const selectedInv = invitations.find(i => i.id === selectedInvitationId);
    const slug = selectedInv ? `${selectedInv.groom_name}-${selectedInv.bride_name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'export';
    const filename = `rsvp-${slug}.csv`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalResponses = rsvps.length;
  const totalAttending = rsvps.filter(r => r.attendance === 'accepted').length;
  const totalDeclined = rsvps.filter(r => r.attendance === 'declined').length;
  const totalGuests = rsvps
    .filter(r => r.attendance === 'accepted')
    .reduce((sum, r) => sum + r.guest_count, 0);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>RSVP Responses</h1>
        <button 
          className={styles.exportBtn} 
          onClick={handleExportCSV}
          disabled={rsvps.length === 0}
        >
          Export CSV
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '16px' }}>Error: {error}</div>}

      <div className={styles.controls}>
        <select 
          className={styles.select}
          value={selectedInvitationId}
          onChange={(e) => setSelectedInvitationId(e.target.value)}
        >
          <option value="" disabled>Select Invitation</option>
          {invitations.map(inv => (
            <option key={inv.id} value={inv.id}>
              {inv.groom_name} & {inv.bride_name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Total Responses</h3>
          <p className={styles.cardValue}>{totalResponses}</p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Attending Responses</h3>
          <p className={styles.cardValue}>{totalAttending}</p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Declined</h3>
          <p className={styles.cardValue}>{totalDeclined}</p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Total Attending Guests</h3>
          <p className={styles.cardValue}>{totalGuests}</p>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingState}>Loading RSVPs...</div>
        ) : rsvps.length === 0 ? (
          <div className={styles.emptyState}>No RSVP responses yet.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Contact</th>
                <th>Attendance</th>
                <th>Guests</th>
                <th>Message</th>
                <th>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map(rsvp => (
                <tr key={rsvp.id}>
                  <td>{rsvp.full_name}</td>
                  <td>
                    <div>{rsvp.mobile_number}</div>
                    {rsvp.email && <div style={{ fontSize: '12px', color: '#718096' }}>{rsvp.email}</div>}
                  </td>
                  <td>
                    <span className={`${styles.badge} ${rsvp.attendance === 'accepted' ? styles.badgeAccepted : styles.badgeDeclined}`}>
                      {rsvp.attendance === 'accepted' ? 'Accepted' : 'Declined'}
                    </span>
                  </td>
                  <td>{rsvp.guest_count}</td>
                  <td>{rsvp.message || '-'}</td>
                  <td>{new Date(rsvp.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RSVPsList;
