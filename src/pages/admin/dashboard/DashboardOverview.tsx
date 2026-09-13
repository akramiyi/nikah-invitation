import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import styles from './DashboardOverview.module.css';

interface DashboardStats {
  totalInvitations: number;
  publishedInvitations: number;
  totalEvents: number;
  totalRSVPs: number;
  totalGuests: number;
  totalMedia: number;
}

const DashboardOverview: React.FC = () => {
  const { role, user } = useAuth();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalInvitations: 0,
    publishedInvitations: 0,
    totalEvents: 0,
    totalRSVPs: 0,
    totalGuests: 0,
    totalMedia: 0
  });
  
  const [recentInvitations, setRecentInvitations] = useState<any[]>([]);
  const [recentRSVPs, setRecentRSVPs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && role) {
      fetchDashboardData();
    }
  }, [user, role]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (role === 'super_admin') {
        // Stats
        const [{ count: invCount }, { count: pubInvCount }, { count: evCount }, { data: rsvpData }, { count: mediaCount }] = await Promise.all([
          supabase.from('invitations').select('*', { count: 'exact', head: true }),
          supabase.from('invitations').select('*', { count: 'exact', head: true }).eq('is_published', true),
          supabase.from('events').select('*', { count: 'exact', head: true }),
          supabase.from('rsvps').select('guest_count'),
          supabase.from('media').select('*', { count: 'exact', head: true }),
        ]);

        const totalRsvpCount = rsvpData ? rsvpData.length : 0;
        const totalGuestsCount = rsvpData ? rsvpData.reduce((sum, r) => sum + (r.guest_count || 1), 0) : 0;

        setStats({
          totalInvitations: invCount || 0,
          publishedInvitations: pubInvCount || 0,
          totalEvents: evCount || 0,
          totalRSVPs: totalRsvpCount,
          totalGuests: totalGuestsCount,
          totalMedia: mediaCount || 0
        });

        // Recent Data
        const { data: recInvs } = await supabase.from('invitations').select('id, groom_name, bride_name, slug, wedding_date, is_published').order('created_at', { ascending: false }).limit(5);
        setRecentInvitations(recInvs || []);

        const { data: recRsvps } = await supabase.from('rsvps').select('id, full_name, attendance, guest_count, created_at, invitation:invitations(groom_name, bride_name)').order('created_at', { ascending: false }).limit(5);
        setRecentRSVPs(recRsvps || []);
        
      } else if (role === 'friend' && user) {
        // Friend Data
        const { data: memberData } = await supabase.from('invitation_members').select('invitation_id').eq('user_id', user.id);
        const invIds = memberData?.map(m => m.invitation_id) || [];

        if (invIds.length > 0) {
          const [{ count: invCount }, { count: pubInvCount }, { count: evCount }, { data: rsvpData }, { count: mediaCount }] = await Promise.all([
            supabase.from('invitations').select('*', { count: 'exact', head: true }).in('id', invIds),
            supabase.from('invitations').select('*', { count: 'exact', head: true }).in('id', invIds).eq('is_published', true),
            supabase.from('events').select('*', { count: 'exact', head: true }).in('invitation_id', invIds),
            supabase.from('rsvps').select('guest_count').in('invitation_id', invIds),
            supabase.from('media').select('*', { count: 'exact', head: true }).in('invitation_id', invIds),
          ]);

          const totalRsvpCount = rsvpData ? rsvpData.length : 0;
          const totalGuestsCount = rsvpData ? rsvpData.reduce((sum, r) => sum + (r.guest_count || 1), 0) : 0;

          setStats({
            totalInvitations: invCount || 0,
            publishedInvitations: pubInvCount || 0,
            totalEvents: evCount || 0,
            totalRSVPs: totalRsvpCount,
            totalGuests: totalGuestsCount,
            totalMedia: mediaCount || 0
          });

          // Recent Data
          const { data: recInvs } = await supabase.from('invitations').select('id, groom_name, bride_name, slug, wedding_date, is_published').in('id', invIds).order('created_at', { ascending: false }).limit(5);
          setRecentInvitations(recInvs || []);

          const { data: recRsvps } = await supabase.from('rsvps').select('id, full_name, attendance, guest_count, created_at, invitation:invitations(groom_name, bride_name)').in('invitation_id', invIds).order('created_at', { ascending: false }).limit(5);
          setRecentRSVPs(recRsvps || []);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingState}>Loading Dashboard...</div>;
  }

  return (
    <div className={styles.container}>
      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Invitations</div>
          <div className={styles.statValue}>{stats.totalInvitations}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Published</div>
          <div className={styles.statValue}>{stats.publishedInvitations}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Events</div>
          <div className={styles.statValue}>{stats.totalEvents}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>RSVP Responses</div>
          <div className={styles.statValue}>{stats.totalRSVPs}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Guests</div>
          <div className={styles.statValue}>{stats.totalGuests}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Media Files</div>
          <div className={styles.statValue}>{stats.totalMedia}</div>
        </div>
      </div>

      <div className={styles.contentGrid}>
        {/* Recent Invitations */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Recent Invitations</h2>
            {role === 'super_admin' && (
              <Link to="/admin/invitations/new" className={styles.actionBtn}>+ Create</Link>
            )}
          </div>
          <div className={styles.tableWrapper}>
            {recentInvitations.length === 0 ? (
              <div className={styles.emptyState}>No invitations found.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Couple</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvitations.map(inv => (
                    <tr key={inv.id}>
                      <td>{inv.groom_name} & {inv.bride_name}</td>
                      <td>{inv.wedding_date || 'TBD'}</td>
                      <td>
                        <span className={inv.is_published ? styles.badgeSuccess : styles.badgePending}>
                          {inv.is_published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actionLinks}>
                          <Link to={`/admin/invitations/${inv.id}/edit`}>Edit</Link>
                          <a href={`/invite/${inv.slug}`} target="_blank" rel="noopener noreferrer">View</a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent RSVPs */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Recent RSVPs</h2>
            <Link to="/admin/rsvp" className={styles.viewAllLink}>View All</Link>
          </div>
          <div className={styles.tableWrapper}>
            {recentRSVPs.length === 0 ? (
              <div className={styles.emptyState}>No RSVPs received yet.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Guest Name</th>
                    <th>Invitation</th>
                    <th>Status</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRSVPs.map(rsvp => (
                    <tr key={rsvp.id}>
                      <td>{rsvp.full_name}</td>
                      <td>
                        {rsvp.invitation 
                          ? `${rsvp.invitation.groom_name} & ${rsvp.invitation.bride_name}` 
                          : 'Unknown'}
                      </td>
                      <td>
                        <span className={rsvp.attendance === 'accepted' ? styles.badgeSuccess : styles.badgeError}>
                          {rsvp.attendance}
                        </span>
                      </td>
                      <td>{rsvp.guest_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
