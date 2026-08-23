import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from '../lib/useAuth.jsx';
import { supabase, supabaseConfigured } from '../lib/supabase.js';
import { takePendingResult } from '../lib/pendingResult.js';
import LoginScreen from './LoginScreen.jsx';
import DashboardShell from './DashboardShell.jsx';

// The dashboard's own root, separate from FunnelApp — it owns nothing
// about the diagnostic itself, only "is someone signed in, and if so
// show them their stuff." Not configured yet → a plain message instead
// of a crash, so visiting /#/dashboard before Supabase is wired in fails
// gracefully.
export default function DashboardApp() {
  if (!supabaseConfigured) {
    return (
      <div className="wrap dash-unconfigured">
        <p className="eyebrow">Dashboard</p>
        <h1>Not set up yet.</h1>
        <p className="simple-page__lead">
          This needs a Supabase project connected — see cheema-capital-dashboard-setup.md.
        </p>
      </div>
    );
  }
  return (
    <AuthProvider>
      <DashboardInner />
    </AuthProvider>
  );
}

function DashboardInner() {
  const { session, loading } = useAuth();
  const [savingPending, setSavingPending] = useState(false);

  // Once a session exists (right after the magic-link redirect lands
  // here), write any diagnostic result staged by SaveToDashboard before
  // showing the rest of the dashboard — so "save & get a link" actually
  // ends with the result on the dashboard, not just a signed-in account.
  useEffect(() => {
    if (!session) return;
    const pending = takePendingResult();
    if (!pending) return;
    setSavingPending(true);
    supabase
      .from('diagnostic_results')
      .insert([{ ...pending, user_id: session.user.id }])
      .then(() => setSavingPending(false));
  }, [session]);

  if (loading || savingPending) {
    return <div className="wrap dash-unconfigured"><p className="simple-page__lead">Loading…</p></div>;
  }

  if (!session) return <LoginScreen />;
  return <DashboardShell />;
}
