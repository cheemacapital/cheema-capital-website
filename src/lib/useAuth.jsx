import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, supabaseConfigured } from './supabase.js';

const AuthContext = createContext(null);

// Wraps the dashboard in a single source of truth for "who's signed in
// right now," backed by Supabase's magic-link (passwordless) auth — no
// passwords for us to handle or secure, Supabase emails a one-time link
// and redirects back here with a session.
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function sendMagicLink(email) {
    if (!supabaseConfigured) return { error: new Error('Dashboard not configured yet.') };
    return supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + window.location.pathname + '#/dashboard' }
    });
  }

  async function signOut() {
    if (!supabaseConfigured) return;
    await supabase.auth.signOut();
  }

  const value = { session, user: session?.user ?? null, loading, sendMagicLink, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
