import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch the user's role from public.profiles
    const fetchUserRole = async (currentUser: User) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();
        
        if (error) {
          console.error('Error fetching role:', error);
          setRole(null);
        } else {
          setRole(data?.role || null);
        }
      } catch (err) {
        console.error('Unexpected error fetching role:', err);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setLoading(true);
        fetchUserRole(session.user);
      } else {
        setRole(null);
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
