import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import InvitationsList from './invitations/InvitationsList';
import InvitationForm from './invitations/InvitationForm';

import EventsList from './events/EventsList';
import EventForm from './events/EventForm';
import RSVPsList from './rsvps/RSVPsList';

const AdminDashboard: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (location.pathname.includes('/invitations')) {
      setActiveTab('invitations');
    } else if (location.pathname.includes('/rsvp')) {
      setActiveTab('rsvp');
    } else {
      setActiveTab('dashboard');
    }
  }, [location]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', path: '/admin' },
    { id: 'invitations', label: 'Invitations', path: '/admin/invitations' },
    { id: 'events', label: 'Events', path: '/admin/events' },
    { id: 'rsvp', label: 'RSVP Responses', path: '/admin/rsvp' },
    { id: 'media', label: 'Media', path: '/admin/media' },
    { id: 'users', label: 'Users', path: '/admin/users' },
    { id: 'settings', label: 'Settings', path: '/admin/settings' },
  ];

  const renderContent = () => {
    if (location.pathname.includes('/events')) {
      if (location.pathname.endsWith('/new') || location.pathname.endsWith('/edit')) {
        return <EventForm />;
      }
      return <EventsList />;
    }
    
    if (location.pathname === '/admin/invitations') {
      return <InvitationsList />;
    }
    
    if (location.pathname === '/admin/rsvp') {
      return <RSVPsList />;
    }
    
    if (location.pathname === '/admin/invitations/new' || location.pathname.includes('/edit')) {
      return <InvitationForm />;
    }
    
    return (
      <>
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
      </>
    );
  };

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
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
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
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;
