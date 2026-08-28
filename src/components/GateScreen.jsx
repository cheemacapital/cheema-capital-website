// The very first thing anyone sees. Branding now lives in the always-visible
// Header above this, per this turn's request — the screen itself is unchanged.
export default function GateScreen({ onYes, onNo }) {
  return (
    <section className="screen" aria-live="polite">
      <div className="wrap gate">
        <h1>Do you own or help run a business?</h1>
        <div className="gate__actions">
          <button type="button" className="gate-btn gate-btn--yes" onClick={onYes}>Yes</button>
          <button type="button" className="gate-btn gate-btn--no" onClick={onNo}>No</button>
        </div>
        <div className="gate__local">
          <a href="/champaign-urbana/" className="gate__local-link">Based in Champaign-Urbana? &rarr;</a>
        </div>
      </div>
    </section>
  );
}
