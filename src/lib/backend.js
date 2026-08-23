// ---- Data backend ----
// Every readout POSTs the session's answers to a Google Apps Script Web App,
// which appends a row to the matching Google Sheet. Set this after deploying
// the Apps Script (see cheema-capital-backend-setup.md). Until it's a real
// URL, postToBackend() is a silent no-op, so the site works exactly the same
// with or without the backend configured. Same contract as the original
// vanilla-JS site: the Apps Script code and setup doc need no changes.
export const WEBHOOK_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

export function generateSessionId() {
  return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
}

export function postToBackend(payload) {
  if (!WEBHOOK_URL || WEBHOOK_URL.indexOf('PASTE_YOUR') === 0) return; // not configured yet
  try {
    fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script Web Apps don't return CORS headers; fire-and-forget
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids a preflight OPTIONS request
      body: JSON.stringify(payload)
    });
  } catch (err) {
    // Never let a network failure block the diagnostic itself.
  }
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
