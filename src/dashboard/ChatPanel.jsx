import { useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/useAuth.jsx';

// Talks to the `chat` Supabase Edge Function — see
// supabase/functions/chat/index.ts. The function itself holds the
// Anthropic API key and looks up this user's saved diagnostic result and
// chat history server-side (scoped by their JWT); this component never
// touches either directly, it just sends the new message and renders
// whatever comes back.
export default function ChatPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    supabase
      .from('chat_messages')
      .select('role, content, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setMessages(data || []);
        setLoading(false);
      });
  }, [user.id]);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setError('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setInput('');
    setSending(true);

    const { data, error: fnError } = await supabase.functions.invoke('chat', { body: { message: text } });

    if (fnError || data?.error) {
      setError((fnError && fnError.message) || data?.error || 'Something went wrong.');
      setSending(false);
      return;
    }

    setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    setSending(false);
  }

  return (
    <div className="dash-panel dash-chat">
      <p className="eyebrow">AI companion</p>
      <p className="simple-page__lead">Ask about your results or the Operator's Framework. For hands-on strategy work, request a consultation.</p>

      <div className="dash-chat__log" ref={listRef}>
        {loading && <p className="simple-page__lead">Loading…</p>}
        {!loading && messages.length === 0 && (
          <p className="dash-chat__empty">No messages yet — ask something about your results below.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={'dash-chat__bubble dash-chat__bubble--' + m.role}>
            {m.content}
          </div>
        ))}
        {sending && <div className="dash-chat__bubble dash-chat__bubble--assistant dash-chat__bubble--pending">…</div>}
      </div>

      {error && <p className="email-capture__note">{error}</p>}

      <form onSubmit={handleSend} className="dash-chat__form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          disabled={sending}
        />
        <button type="submit" className="btn btn--primary" disabled={sending || !input.trim()}>Send</button>
      </form>
    </div>
  );
}
