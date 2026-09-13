import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Settings.module.css';

const Settings: React.FC = () => {
  const { user, role } = useAuth();
  
  const [, setProfile] = useState<{ id: string; full_name: string | null; role: string } | null>(null);
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      if (data.full_name) {
        setFullName(data.full_name);
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setMessage(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
      setProfile(prev => prev ? { ...prev, full_name: fullName } : null);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingState}>Loading settings...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>
      
      {message && (
        <div className={message.type === 'success' ? styles.successAlert : styles.errorAlert}>
          {message.text}
        </div>
      )}

      {/* SECTION A — PROFILE */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Profile</h2>
        <div className={styles.card}>
          <form onSubmit={handleUpdateProfile}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="text" className={styles.input} value={user?.email || ''} disabled />
              <div className={styles.helpText}>Email cannot be changed directly from this dashboard.</div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input 
                type="text" 
                className={styles.input} 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Role</label>
              <input type="text" className={styles.input} value={role?.replace('_', ' ').toUpperCase() || ''} disabled />
            </div>

            <button type="submit" className={styles.primaryBtn} disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </section>

      {/* SECTION C — SECURITY */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Security</h2>
        <div className={styles.card}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Authentication Status</span>
            <span className={styles.badgeSuccess}>Authenticated</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Account Email</span>
            <span>{user?.email}</span>
          </div>
          
          <button 
            type="button" 
            className={styles.secondaryBtn} 
            onClick={() => supabase.auth.signOut()}
            style={{ marginTop: '16px' }}
          >
            Sign Out
          </button>
        </div>
      </section>

      {/* SECTION D — APPLICATION INFORMATION */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Application Information</h2>
        <div className={styles.card}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Application Name</span>
            <span>Nikah Invitation Admin</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Environment</span>
            <span>{import.meta.env.MODE || 'production'}</span>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Settings;
