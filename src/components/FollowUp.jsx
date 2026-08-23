import { useState } from 'react';
import { postToBackend, EMAIL_RE } from '../lib/backend.js';

// End-of-track follow-up. Previously two separate yes/no questions (email
// the report / free consultation); collapsed into one lead-capture flow —
// no report content is ever emailed to a visitor anymore. A single
// yes/no gate ("Would you like to move forward?") keeps this from being
// an always-visible contact form dropped on every readout screen (a
// deliberate earlier decision — see git history / build-status doc on why
// there's no bare "Contact us" block); saying yes reveals a short form
// (name, organization, position, email) instead of sending anything to the
// visitor directly. Only ever rendered on true end-of-path screens (full
// report, wealth readout, aspiring readout) — the basic 5-question readout
// is a mid-point with "Continue to full report" instead, so it renders no
// FollowUp at all. Skippable, never blocks anything.
export default function FollowUp({ track, sessionId }) {
  const [phase, setPhase] = useState('question'); // 'question' | 'form' | 'done'
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  function handleYes() {
    setPhase('form');
  }

  function handleNo() {
    setPhase('done');
  }

  function handleSubmit() {
    const trimmedName = name.trim();
    const trimmedOrg = organization.trim();
    const trimmedPosition = position.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedOrg || !trimmedPosition) {
      setNote('Fill in your name, organization, and position.');
      return;
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setNote('Enter a valid email address.');
      return;
    }

    postToBackend({
      action: 'move_forward',
      track,
      sessionId,
      name: trimmedName,
      organization: trimmedOrg,
      position: trimmedPosition,
      email: trimmedEmail
    });
    setNote('Sent.');
    setSent(true);
  }

  return (
    <div className="followup">
      {phase === 'question' && (
        <div className="followup__question">
          <p>Would you like to move forward?</p>
          <div className="followup__actions">
            <button type="button" className="btn btn--ghost btn--small" onClick={handleYes}>Yes</button>
            <button type="button" className="btn btn--ghost btn--small" onClick={handleNo}>No</button>
          </div>
        </div>
      )}

      {phase === 'form' && (
        <div className="lead-capture">
          <p className="lead-capture__intro">
            Our team will review your diagnostic and get back to you. Share your name, organization,
            position, and email, and we'll be in touch.
          </p>
          <div className="lead-capture__grid">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={sent}
              autoFocus
            />
            <input
              type="text"
              placeholder="Organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              disabled={sent}
            />
            <input
              type="text"
              placeholder="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={sent}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sent}
            />
          </div>
          <button type="button" className="btn btn--ghost" onClick={handleSubmit} disabled={sent}>Send</button>
          <p className="email-capture__note">{note}</p>
          {sent && <p className="followup__confirm">Thanks — we'll be in touch.</p>}
        </div>
      )}
    </div>
  );
}
