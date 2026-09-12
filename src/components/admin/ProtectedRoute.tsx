import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#0B3D2E',
        color: '#F7F1DE',
        fontFamily: 'Jost, sans-serif'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role !== 'super_admin' && role !== 'friend') {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#0B3D2E',
        color: '#F7F1DE',
        fontFamily: 'Jost, sans-serif'
      }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '42px', color: '#E8CF8A' }}>Access Denied</h1>
        <p style={{ marginTop: '16px' }}>You do not have permission to view this page.</p>
        <button 
          onClick={() => {
            // Provide a way out for users stuck in wrong role
            import('../../lib/supabase').then(({ supabase }) => supabase.auth.signOut());
          }}
          style={{
            marginTop: '24px',
            padding: '10px 20px',
            backgroundColor: '#FAF6EC',
            color: '#0B3D2E',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.1em'
          }}
        >
          Sign Out
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
