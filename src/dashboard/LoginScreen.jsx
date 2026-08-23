import { useState } from 'react';
import { useAuth } from '../lib/useAuth.jsx';
import { EMAIL_RE } from '../lib/backend.js';

// Reached either directly (someone bookmarks /#/dashboard) or after
// clicking "Save & get your AI companion" on the full readout. Same
// magic-link mechanism either way — no separate signup/login split,
// since there's no password to get wrong.
export default function LoginScreen() {
  const { sendMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [phase, setPhase] = useState('form'); // 'form' | 'sent' | 'error'
  const [note, setNote] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!EMAIL_RE.test(trimmed)) {
      setNote('Enter a valid email address.');
      return;
    }
    const { error } = await sendMagicLink(trimmed);
    if (error) {
      setPhase('error');
      setNote(error.message);
      return;
    }
    setPhase('sent');
  }

  return (
    <div className="wrap dash-login">
      <p className="eyebrow">Dashboard</p>
      <h1>Sign in</h1>
      {phase !== 'sent' && (
        <form onSubmit={handleSubmit} className="dash-login__form">
          <p className="simple-page__lead">
            Enter the email you used for your diagnostic, or any email to start fresh.
            No password — you'll get a one-time link.
          </p>
          <div className="email-capture__row">
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" className="btn btn--primary">Send my link</button>
          </div>
          {note && <p className="email-capture__note">{note}</p>}
        </form>
      )}
      {phase === 'sent' && (
        <p className="simple-page__lead">Check your email for a link back in.</p>
      )}
    </div>
  );
}
