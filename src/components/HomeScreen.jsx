// The actual homepage. Previously led with the diagnostic itself ("A
// structured diagnostic of..."), which meant the tool was the first thing
// a visitor understood about the site, not the firm. Reworked so the hero
// states what Cheema Capital does in plain terms — the diagnostic is
// offered as how you engage, not what the business is. Everything below
// the hero still supports/explains the diagnostic.
const PILLARS = [
  { name: 'Systems', desc: 'Internal processes, tooling, and operational discipline.' },
  { name: 'Signal', desc: 'Website and brand presence relative to actual capability.' },
  { name: 'Pipeline', desc: 'Positioning and go-to-market strategy.' },
  { name: 'Capacity', desc: 'Team bandwidth and dependency on any one person.' }
];

// .screen is a flex container with a single child everywhere else in the
// app (see index.css) — keeping one outer .wrap here, with the sections
// stacked inside it, avoids turning this into the only screen with
// multiple flex children (which would sit side by side under the shared
// row-direction default instead of stacking).
export default function HomeScreen({ onTakeDiagnostic }) {
  return (
    <section className="screen home" aria-live="polite">
      <div className="wrap simple-page home__inner">
        <p className="eyebrow">Cheema Capital</p>
        <h1>Cheema Capital advises small and midsized businesses on the systems, brand, and go-to-market gaps holding back growth.</h1>
        <p className="simple-page__lead">
          Engagements address internal systems and process, external brand and web presence,
          and positioning and go-to-market strategy, scoped to the specific gaps identified.
        </p>
        <p className="simple-page__lead">
          Cheema Capital also provides wealth education, with a specialty in crypto and digital
          assets, pending Series 65 licensure.
        </p>
        <div className="simple-page__actions">
          <button type="button" className="btn btn--primary btn--large" onClick={onTakeDiagnostic}>Take the diagnostic</button>
          <a href="mailto:hello@cheemacapital.ai" className="btn-text">Email us</a>
        </div>

        <div className="home__section">
          <p className="eyebrow">What the diagnostic evaluates</p>
          <ul className="home__pillars">
            {PILLARS.map((p) => (
              <li key={p.name} className="home__pillar">
                <span className="home__pillar-name">{p.name}</span>
                <span className="home__pillar-desc">{p.desc}</span>
              </li>
            ))}
          </ul>
          <div className="simple-page__actions">
            <button type="button" className="btn btn--primary btn--large" onClick={onTakeDiagnostic}>Take the diagnostic</button>
          </div>
        </div>
      </div>
    </section>
  );
}
