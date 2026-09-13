import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import InvitationsList from './invitations/InvitationsList';
import InvitationForm from './invitations/InvitationForm';
import UsersList from './users/UsersList';
import MediaList from './media/MediaList';

import EventsList from './events/EventsList';
import EventForm from './events/EventForm';
import RSVPsList from './rsvps/RSVPsList';

import Settings from './settings/Settings';
import DashboardOverview from './dashboard/DashboardOverview';

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
    } else if (location.pathname.includes('/media')) {
      setActiveTab('media');
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

  const friendNavItems = [
    { id: 'dashboard', label: 'My Invitations', path: '/admin' },
    { id: 'events', label: 'Events', path: '/admin/events' },
    { id: 'rsvp', label: 'RSVP Responses', path: '/admin/rsvp' },
    { id: 'media', label: 'Media', path: '/admin/media' },
    { id: 'settings', label: 'Settings', path: '/admin/settings' },
  ];

  const currentNavItems = role === 'super_admin' ? navItems : friendNavItems;

  const renderContent = () => {
    if (role === 'friend' && !['/admin', '/admin/events', '/admin/rsvp', '/admin/media', '/admin/settings'].some(p => location.pathname.startsWith(p) || location.pathname === p)) {
      return (
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '24px', color: '#0B3D2E' }}>Access Denied</h2>
          <p>You do not have permission to view this module.</p>
        </div>
      );
    }

    if (location.pathname === '/admin/users' && role === 'super_admin') {
      return <UsersList />;
    }
    
    if (location.pathname === '/admin/media') {
      return <MediaList />;
    }

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
    
    if (location.pathname === '/admin/settings') {
      return <Settings />;
    }

    if (location.pathname === '/admin') {
      return <DashboardOverview />;
    }

    return (
      <>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>
            {currentNavItems.find(i => i.id === activeTab)?.label || 'Dashboard'}
          </h1>
          <p className={styles.pageSubtitle}>
            {role === 'super_admin' ? 'Manage your invitation and guest details' : 'Manage your assigned invitations'}
          </p>
        </header>

        <div className={styles.placeholderCard}>
          <div className={styles.placeholderIcon}>{role === 'super_admin' ? '🚧' : '✨'}</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond', fontSize: '24px', margin: '0 0 8px 0' }}>
            {role === 'super_admin' ? 'Module Under Construction' : 'Welcome to Nikah Admin'}
          </h3>
          <p className={styles.placeholderText}>
            {role === 'super_admin' 
              ? `The ${currentNavItems.find(i => i.id === activeTab)?.label} module will be implemented in future steps.` 
              : 'Select an option from the sidebar to manage your invitations.'}
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
          {currentNavItems.map(item => (
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
