import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/useAuth.jsx';

const SAVE_DELAY_MS = 800;

// A single running notes doc per user (not a list of entries) — the
// "area for them to reference internally" from the request. Autosaves
// on a short debounce so there's no separate save button to remember to
// click; status line just says what's happening.
export default function NotesPanel() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('loading'); // 'loading' | 'idle' | 'saving' | 'saved'
  const timerRef = useRef(null);

  useEffect(() => {
    supabase
      .from('notes')
      .select('content')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setContent(data?.content || '');
        setStatus('idle');
      });
  }, [user.id]);

  function handleChange(e) {
    const value = e.target.value;
    setContent(value);
    setStatus('saving');
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      await supabase.from('notes').upsert({ user_id: user.id, content: value, updated_at: new Date().toISOString() });
      setStatus('saved');
    }, SAVE_DELAY_MS);
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className="dash-panel">
      <p className="eyebrow">Your notes</p>
      <p className="simple-page__lead">A running place to reference internally — questions for a call, follow-ups, whatever's useful.</p>
      <textarea
        className="dash-notes__textarea"
        value={content}
        onChange={handleChange}
        placeholder="Start typing…"
        disabled={status === 'loading'}
      />
      <p className="dash-panel__meta">
        {status === 'loading' && 'Loading…'}
        {status === 'saving' && 'Saving…'}
        {status === 'saved' && 'Saved'}
        {status === 'idle' && ' '}
      </p>
    </div>
  );
}
