import { computeBasicResult } from '../lib/diagnostics.js';
import { renderStrong } from '../lib/richText.jsx';
import { BASIC_NONE_HEADLINE, BASIC_NONE_BODY, SECTION_LABELS, SECTION_NARRATIVE, SECONDARY_LINE, BASIC_CHECKPOINT } from '../data/content.js';

// Mid-point, not an end of path: offers "Continue to full report" instead of
// a FollowUp block. Deliberately no email/consultation questions here — see
// the "only true end-of-path screens" scope decision from earlier this build.
export default function BasicReadoutScreen({ answers, onDiveDeeper, onRestart }) {
  const { hasGap, primaryTag, secondaryTag } = computeBasicResult(answers.slice(0, BASIC_CHECKPOINT));

  return (
    <section className="screen" aria-live="polite">
      <div className="wrap readout">
        <p className="eyebrow">Your quick diagnostic</p>
        <h2 className="pullquote">
          {hasGap
            ? <><span className="accent">{SECTION_LABELS[primaryTag]}</span> is the primary gap identified.</>
            : BASIC_NONE_HEADLINE}
        </h2>
        <div className="readout__body">
          {hasGap ? (
            <>
              <p>{renderStrong(SECTION_NARRATIVE[primaryTag])}</p>
              {secondaryTag ? <p>{SECONDARY_LINE[secondaryTag]}</p> : null}
            </>
          ) : (
            <p>{BASIC_NONE_BODY}</p>
          )}
        </div>
        <p className="dive-deeper__prompt">Eleven additional questions covering all four pillars produce a complete, section-by-section report.</p>
        <div className="simple-page__actions">
          <button type="button" className="btn btn--primary btn--large" onClick={onDiveDeeper}>Continue to full report</button>
          <button type="button" className="btn-text" onClick={onRestart}>Start over</button>
        </div>
      </div>
    </section>
  );
}
