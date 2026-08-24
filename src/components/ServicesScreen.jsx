export default function ServicesScreen({ onTakeDiagnostic }) {
  return (
    <section className="screen" aria-live="polite">
      <div className="wrap simple-page">
        <p className="eyebrow">What we do</p>
        <h1>We advise small and midsized business owners on the systems, brand, and go-to-market gaps holding back growth.</h1>
        <p className="simple-page__lead">
          Work covers three areas: internal systems and processes, external brand and web
          presence, and positioning and go-to-market strategy. Each engagement is scoped to the
          specific gaps identified, not a fixed package.
        </p>
        <p className="simple-page__lead">
          Cheema Capital also provides wealth education, with a specialty in crypto and digital
          assets. This practice is education-focused while Series 65 licensure is in progress.
        </p>
        <p className="simple-page__lead">
          For founders building a business before launch, Cheema Capital consults on positioning
          and go-to-market strategy.
        </p>
        <div className="simple-page__actions">
          <button type="button" className="btn btn--primary btn--large" onClick={onTakeDiagnostic}>Take the diagnostic</button>
          <a href="mailto:hello@cheemacapital.ai" className="btn-text">Email us</a>
        </div>
      </div>
    </section>
  );
}
