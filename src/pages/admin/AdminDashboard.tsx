import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import styles from './AdminDashboard.module.css';

const AdminDashboard: React.FC = () => {
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'invitations', label: 'Invitations' },
    { id: 'events', label: 'Events' },
    { id: 'rsvp', label: 'RSVP Responses' },
    { id: 'media', label: 'Media' },
    { id: 'users', label: 'Users' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Nikah Admin</h2>
          <div className={styles.adminInfo}>
            <div>{user?.email}</div>
            <div style={{ color: '#E8CF8A', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Role: {role?.replace('_', ' ')}
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <div 
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </div>
          ))}
        </nav>

        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </button>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {navItems.find(i => i.id === activeTab)?.label}
          </h1>
          <p className={styles.pageSubtitle}>
            Manage your invitation and guest details
          </p>
        </header>

        <div className={styles.placeholderCard}>
          <div className={styles.placeholderIcon}>🚧</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '24px', margin: '0 0 8px 0' }}>
            Module Under Construction
          </h3>
          <p className={styles.placeholderText}>
            The {navItems.find(i => i.id === activeTab)?.label} module will be implemented in future steps.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
