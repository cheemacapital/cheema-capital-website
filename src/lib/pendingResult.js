// Bridges the funnel (public, no auth) and the dashboard (authenticated).
// When someone finishes the full diagnostic and requests a magic link,
// there's no session yet to write a diagnostic_results row against — the
// session only exists after they click the email link and land back on
// /#/dashboard. So the result is staged in localStorage first; the
// dashboard picks it up once a session exists, inserts it, and clears it.
const KEY = 'cheema_pending_result';

export function stagePendingResult(result) {
  try {
    localStorage.setItem(KEY, JSON.stringify(result));
  } catch {
    // localStorage can throw in some private-browsing modes — losing the
    // staged result just means the dashboard opens empty, never breaks
    // the funnel itself.
  }
}

export function takePendingResult() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    localStorage.removeItem(KEY);
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
