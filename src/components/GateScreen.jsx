// The very first thing anyone sees. Branding now lives in the always-visible
// Header above this, per this turn's request — the screen itself is unchanged.
export default function GateScreen({ onYes, onNo, onChampaignClick }) {
  // This link leaves the SPA for a real static page, so a plain <a> click
  // would cut away instantly with no transition. Intercept ordinary clicks
  // to run the same fade-out the rest of the app uses first (see
  // navigateExternal in FunnelApp.jsx) — but let modified clicks (new tab,
  // new window) through untouched, since preventDefault would break those.
  function handleChampaignClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    onChampaignClick();
  }

  return (
    <section className="screen" aria-live="polite">
      <div className="wrap gate">
        <h1>Do you own or help run a business?</h1>
        <div className="gate__actions">
          <button type="button" className="gate-btn gate-btn--yes" onClick={onYes}>Yes</button>
          <button type="button" className="gate-btn gate-btn--no" onClick={onNo}>No</button>
        </div>
        <div className="gate__local">
          <a href="/champaign-urbana/" className="gate__local-link" onClick={handleChampaignClick}>Based in Champaign-Urbana? &rarr;</a>
        </div>
      </div>
    </section>
  );
}
