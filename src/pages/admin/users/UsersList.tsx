import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import styles from '../rsvps/RSVPsList.module.css'; // Reusing the same table styles

interface Profile {
  id: string;
  full_name: string | null;
  role: string;
  created_at: string;
}

interface Invitation {
  id: string;
  groom_name: string;
  bride_name: string;
  slug: string;
}

interface Membership {
  id: string;
  user_id: string;
  invitation_id: string;
  invitation?: Invitation;
}

const UsersList: React.FC = () => {
  const { role } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Assignment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>('');
  const [assignError, setAssignError] = useState<string | null>(null);

  useEffect(() => {
    if (role === 'super_admin') {
      fetchData();
    }
  }, [role]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch profiles
      const { data: profs, error: profsErr } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (profsErr) throw profsErr;
      setProfiles(profs || []);

      // Fetch memberships with invitation details
      // Since it's a related table, we can select invitation_id and the invitation details
      const { data: mems, error: memsErr } = await supabase
        .from('invitation_members')
        .select(`
          id,
          user_id,
          invitation_id,
          invitation:invitations (
            id,
            groom_name,
            bride_name,
            slug
          )
        `);
      if (memsErr) throw memsErr;
      // Depending on Supabase setup, invitation might be an array or object. Usually object for many-to-one.
      setMemberships((mems as any) || []);

      // Fetch all invitations for the assignment dropdown
      const { data: invs, error: invsErr } = await supabase
        .from('invitations')
        .select('id, groom_name, bride_name, slug');
      if (invsErr) throw invsErr;
      setInvitations(invs || []);

    } catch (err: any) {
      console.error('Error fetching users data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignClick = (userId: string) => {
    setSelectedUserId(userId);
    setAssignError(null);
    setIsModalOpen(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedInvitationId) return;

    // Check if membership already exists locally to prevent unique constraint error smoothly
    const exists = memberships.find(m => m.user_id === selectedUserId && m.invitation_id === selectedInvitationId);
    if (exists) {
      setAssignError('User is already assigned to this invitation.');
      return;
    }

    try {
      const { error } = await supabase
        .from('invitation_members')
        .insert({
          user_id: selectedUserId,
          invitation_id: selectedInvitationId
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
           setAssignError('User is already assigned to this invitation.');
           return;
        }
        throw error;
      }
      
      setIsModalOpen(false);
      setSelectedInvitationId('');
      fetchData(); // Refresh list
    } catch (err: any) {
      console.error('Error assigning invitation:', err);
      setAssignError(err.message);
    }
  };

  const handleRemoveMembership = async (membershipId: string) => {
    if (!window.confirm('Are you sure you want to remove this assignment?')) return;
    try {
      const { error } = await supabase
        .from('invitation_members')
        .delete()
        .eq('id', membershipId);
      
      if (error) throw error;
      fetchData();
    } catch (err: any) {
      console.error('Error removing membership:', err);
      alert('Failed to remove assignment: ' + err.message);
    }
  };

  if (role !== 'super_admin') {
    return <div className={styles.emptyState}>Access Denied. Only super admins can view this page.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>User Management</h1>
        <button 
          className={styles.exportBtn}
          onClick={() => alert('SECURITY LIMITATION:\n\nCreating Auth users from the browser requires logging out the current admin or exposing the server-side service_role key.\n\nTo securely add a friend user, please invite them via Supabase Dashboard or implement a secure server-side Edge Function endpoint.')}
        >
          Add Friend User
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '16px' }}>Error: {error}</div>}

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loadingState}>Loading Users...</div>
        ) : profiles.length === 0 ? (
          <div className={styles.emptyState}>No users found.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Assigned Invitation(s)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(profile => {
                const userMemberships = memberships.filter(m => m.user_id === profile.id);
                
                return (
                  <tr key={profile.id}>
                    <td>{profile.full_name || 'Unknown'} <br/><small style={{color:'#718096'}}>{profile.id}</small></td>
                    <td>
                      <span className={`${styles.badge} ${profile.role === 'super_admin' ? styles.badgeAccepted : styles.badgeDeclined}`}>
                        {profile.role}
                      </span>
                    </td>
                    <td>
                      {userMemberships.length > 0 ? (
                        <ul style={{ margin: 0, paddingLeft: '16px' }}>
                          {userMemberships.map(m => (
                            <li key={m.id} style={{ marginBottom: '4px' }}>
                              {m.invitation ? `${m.invitation.groom_name} & ${m.invitation.bride_name} ` : 'Unknown Invitation '}
                              <span style={{ fontSize: '11px', color: '#718096' }}>(/invite/{m.invitation?.slug})</span>
                              {' '}
                              <button 
                                onClick={() => handleRemoveMembership(m.id)}
                                style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '12px', padding: '0 4px' }}
                                title="Remove assignment"
                              >
                                ✕
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span style={{ color: '#a0aec0', fontStyle: 'italic' }}>Not assigned</span>
                      )}
                    </td>
                    <td>
                      {profile.role === 'friend' && (
                        <button 
                          onClick={() => handleAssignClick(profile.id)}
                          style={{ background: '#edf2f7', border: '1px solid #cbd5e0', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}
                        >
                          Assign Invitation
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '100%', maxWidth: '400px' }}>
            <h2 style={{ marginTop: 0 }}>Assign Invitation</h2>
            <form onSubmit={handleAssignSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Select Invitation</label>
                <select 
                  required
                  value={selectedInvitationId}
                  onChange={(e) => setSelectedInvitationId(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
                >
                  <option value="" disabled>-- Select an Invitation --</option>
                  {invitations.map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.groom_name} & {inv.bride_name}
                    </option>
                  ))}
                </select>
              </div>
              
              {assignError && <div style={{ color: '#e53e3e', fontSize: '14px', marginBottom: '16px' }}>{assignError}</div>}
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #cbd5e0', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{ padding: '8px 16px', background: '#38a169', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
