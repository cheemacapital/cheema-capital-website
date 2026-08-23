// Shared question renderer used by all three funnels (business, wealth,
// aspiring). sectionLabel is optional — only the business track has pillar
// sections to show under the progress bar.
export default function Question({ title, options, progressPct, progressLabel, sectionLabel, onAnswer, onBack, backVisible }) {
  return (
    <div className="wrap funnel">
      <div className="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progressPct}>
        <div className="progress__fill" style={{ width: progressPct + '%' }} />
      </div>
      <p className="progress__label">{progressLabel}</p>
      {sectionLabel ? <p className="progress__section">{sectionLabel}</p> : null}
      <div className="question">
        <h2>{title}</h2>
        <div className="options" role="group" aria-label={title}>
          {options.map((opt, i) => (
            <button
              key={i}
              type="button"
              className="option-btn"
              onClick={() => onAnswer(opt.tag, opt.label)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="funnel__nav">
        <button
          type="button"
          className="btn btn--ghost"
          style={{ visibility: backVisible ? 'visible' : 'hidden' }}
          onClick={onBack}
        >
          Back
        </button>
      </div>
    </div>
  );
}
