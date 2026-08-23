import { useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase.js';
import { stagePendingResult } from '../lib/pendingResult.js';
import { EMAIL_RE } from '../lib/backend.js';

// Lives only on the full business readout — "after people go through the
// main funnel" — not the basic mid-point, wealth, or aspiring tracks for
// this first pass. Separate from FollowUp: this creates an account
// (magic-link, no password), FollowUp does not. Renders nothing if
// Supabase isn't configured yet, so this is silently inert until it's
// set up, same pattern as postToBackend with an unset WEBHOOK_URL.
export default function SaveToDashboard({ resultPayload }) {
  const [phase, setPhase] = useState('offer'); // 'offer' | 'sent' | 'error'
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');

  if (!supabaseConfigured) return null;

  async function handleSend() {
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setNote('Enter a valid email address.');
      return;
    }
    stagePendingResult(resultPayload);
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: { emailRedirectTo: window.location.origin + window.location.pathname + '#/dashboard' }
    });
    if (error) {
      setPhase('error');
      setNote(error.message);
      return;
    }
    setPhase('sent');
  }

  return (
    <div className="save-dashboard">
      {phase === 'offer' && (
        <>
          <p className="save-dashboard__title">Save these results and keep working with them</p>
          <p className="save-dashboard__desc">
            Create a free account to save this report, add your own notes, and talk it through
            with the AI companion — no password, just a one-time link to your email.
          </p>
          <div className="email-capture__row">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="button" className="btn btn--ghost" onClick={handleSend}>Send my link</button>
          </div>
          {note && <p className="email-capture__note">{note}</p>}
        </>
      )}
      {phase === 'sent' && (
        <p className="save-dashboard__desc">Check your email for a link to your dashboard.</p>
      )}
      {phase === 'error' && (
        <p className="email-capture__note">{note}</p>
      )}
    </div>
  );
}
