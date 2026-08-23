import { computeFullResult } from '../lib/diagnostics.js';
import { renderStrong } from '../lib/richText.jsx';
import { SECTION_LABELS, SECTION_NARRATIVE } from '../data/content.js';
import Scorecard from './Scorecard.jsx';
import FollowUp from './FollowUp.jsx';

export default function FullReadoutScreen({ answers, sessionId, onRestart }) {
  const result = computeFullResult(answers);
  const { total, scores, maxes, primarySection, narrativeSections } = result;

  return (
    <section className="screen" aria-live="polite">
      <div className="wrap readout">
        <p className="eyebrow">Your full diagnostic report</p>
        <p className="kicker">Structured around Cheema Capital's Operator's Framework — Systems, Signal, Pipeline, Capacity.</p>
        <h2 className="pullquote">
          {total === 0
            ? 'No significant gaps were identified.'
            : <>The largest gap identified is in <span className="accent">{SECTION_LABELS[primarySection]}</span>.</>}
        </h2>
        <Scorecard scores={scores} maxes={maxes} />
        <div className="readout__body">
          {total === 0 ? (
            <p>Current systems and brand presence are consistent with the scale of the business. A conversation may be useful when planning for further growth.</p>
          ) : (
            narrativeSections.map((s) => <p key={s}>{renderStrong(SECTION_NARRATIVE[s])}</p>)
          )}
        </div>
        <button type="button" className="btn-text" onClick={onRestart}>Start over</button>
        <FollowUp track="business" sessionId={sessionId} />
      </div>
    </section>
  );
}
