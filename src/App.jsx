import FunnelApp from './FunnelApp.jsx';

// Dashboard/AI-companion routing pulled back out (2026-08-23) — the
// accounts/dashboard feature was scoped as too much build/setup time for
// now. DashboardApp and its Supabase/router dependency stay in the repo
// unrouted (see src/dashboard/, src/lib/supabase.js, src/lib/useAuth.jsx,
// supabase/) in case this gets revisited later — same pattern as
// HomeScreen.jsx being kept unrouted after the homepage reversal.
export default function App() {
  return <FunnelApp />;
}
