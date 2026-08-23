// Supabase Edge Function: the AI companion's chat endpoint.
//
// This is the ONLY place the Anthropic API key exists — it's set as a
// Supabase secret (never in client code, never in this repo). The
// frontend calls this function with just a message; this function looks
// up the caller's own diagnostic results and recent chat history (scoped
// by their JWT, so RLS guarantees they can only ever see their own data),
// builds a bounded system prompt, calls Claude, saves both sides of the
// exchange, and returns the reply.
//
// Deploy with the Supabase CLI: `supabase functions deploy chat`
// Set the secret once: `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...`
//
// Model: claude-haiku-4-5 by default — this is a bounded, explanatory
// assistant (results + Operator's Framework), not open-ended reasoning,
// so the cheapest current model is the right default for per-message
// cost at this stage. Swap to 'claude-sonnet-5' below if quality matters
// more than cost once there's real usage to justify it.

import { createClient } from 'jsr:@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const MODEL = 'claude-haiku-4-5';

// Required: the browser calls this function cross-origin (your site's
// domain -> the *.supabase.co functions domain), and supabase-js sends
// Authorization/apikey headers, which are "non-simple" and trigger a CORS
// preflight (OPTIONS) before the real POST. Without these headers and an
// explicit OPTIONS handler below, every call from ChatPanel fails silently
// in the browser (blocked before it reaches this function at all) even
// though it works fine from curl/Postman. This is the standard Supabase
// Edge Function CORS boilerplate.
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const SECTION_LABELS: Record<string, string> = { Ops: 'Systems', Brand: 'Signal', GTM: 'Pipeline', Bandwidth: 'Capacity' };

// Deliberately bounded: explains the diagnostic and the Operator's
// Framework, helps the visitor think through their own results, and
// routes anything beyond that back to an actual human consultation —
// this is a companion to the diagnostic, not a substitute for the firm's
// paid advisory work, and (for the wealth track specifically) never
// gives personalized investment advice pre-Series 65.
const SYSTEM_PROMPT_BASE = `You are the Cheema Capital AI companion. You help a business owner understand their own diagnostic results, structured around the Operator's Framework (Systems, Signal, Pipeline, Capacity — internal operations, brand/web presence, go-to-market, and team bandwidth).

Rules:
- Stay grounded in the person's actual diagnostic answers, provided below. Don't invent facts about their business you weren't given.
- You can explain what a gap means, why it matters, and what general categories of action address it (matching the Operator's Framework).
- You are NOT a substitute for an actual consulting engagement. For anything requiring real strategic work — a concrete plan, hands-on execution, anything that should involve looking at their actual systems/website/numbers — say plainly that this is exactly what a real engagement with Cheema Capital covers, and suggest they request a consultation.
- If the person's diagnostic was on the wealth track: you are educational only. Never give personalized investment advice or recommend specific assets, trades, or allocations. Cheema Capital's wealth practice is not a registered investment adviser (Series 65 is pending). If asked for investment advice, say so plainly and redirect to general education or a real conversation with the firm.
- Keep responses concise and direct. No filler, no bullet-point overload for a simple answer.`;

function buildContext(result: Record<string, unknown> | null) {
  if (!result) return 'No saved diagnostic result is on file for this person yet.';
  const track = result.track as string;
  if (track === 'business') {
    const scores = (result.scores as Record<string, number>) || {};
    const scoreLines = Object.keys(scores).length
      ? Object.entries(scores).map(([k, v]) => `${SECTION_LABELS[k] || k}: ${v}/4`).join(', ')
      : 'not available (quick tier only)';
    return [
      `Track: business diagnostic (${result.tier || 'unknown'} tier)`,
      `Primary gap: ${result.primary_gap || 'none identified'}`,
      `Secondary gap: ${result.secondary_gap || 'none'}`,
      `Pillar scores: ${scoreLines}`
    ].join('\n');
  }
  if (track === 'wealth') {
    return `Track: wealth education. Answers: ${JSON.stringify(result.answers)}`;
  }
  return `Track: aspiring founder. Answers: ${JSON.stringify(result.answers)}`;
}

Deno.serve(async (req) => {
  // Preflight: the browser sends this before the real POST because of the
  // Authorization/apikey headers. Must return 2xx with the CORS headers or
  // the actual request never goes out.
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
  if (!ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'Chat not configured yet.' }), { status: 500, headers: { ...CORS_HEADERS, 'content-type': 'application/json' } });
  }

  try {
    const { message } = await req.json();
    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'message is required' }), { status: 400, headers: { ...CORS_HEADERS, 'content-type': 'application/json' } });
    }

    // A client scoped to the caller's own JWT — every query below is
    // subject to the RLS policies in supabase/schema.sql, so this
    // function can only ever read/write the calling user's own rows.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401, headers: { ...CORS_HEADERS, 'content-type': 'application/json' } });
    }

    const [{ data: result }, { data: history }] = await Promise.all([
      supabase.from('diagnostic_results').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('chat_messages').select('role, content').eq('user_id', user.id).order('created_at', { ascending: true }).limit(20)
    ]);

    const systemPrompt = `${SYSTEM_PROMPT_BASE}\n\nThis person's diagnostic result:\n${buildContext(result)}`;
    const messages = [...(history || []).map((m) => ({ role: m.role, content: m.content })), { role: 'user', content: message }];

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 1024, system: systemPrompt, messages })
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      return new Response(JSON.stringify({ error: 'AI request failed', detail: errText }), { status: 502, headers: { ...CORS_HEADERS, 'content-type': 'application/json' } });
    }

    const anthropicJson = await anthropicRes.json();
    const reply = anthropicJson.content?.[0]?.text || '';

    await supabase.from('chat_messages').insert([
      { user_id: user.id, role: 'user', content: message },
      { user_id: user.id, role: 'assistant', content: reply }
    ]);

    return new Response(JSON.stringify({ reply }), { headers: { ...CORS_HEADERS, 'content-type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(err) }), { status: 500, headers: { ...CORS_HEADERS, 'content-type': 'application/json' } });
  }
});
