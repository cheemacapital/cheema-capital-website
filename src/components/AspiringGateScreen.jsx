// Only reached from Gate 1's "No" answer.
export default function AspiringGateScreen({ onYes, onNo }) {
  return (
    <section className="screen" aria-live="polite">
      <div className="wrap gate">
        <h1>Are you already building, or planning to start, a business?</h1>
        <div className="gate__actions">
          <button type="button" className="gate-btn gate-btn--yes" onClick={onYes}>Yes</button>
          <button type="button" className="gate-btn gate-btn--no" onClick={onNo}>No</button>
        </div>
      </div>
    </section>
  );
}
