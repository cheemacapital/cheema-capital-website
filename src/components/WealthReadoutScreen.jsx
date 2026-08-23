import { WEALTH_OPENING_LINE, WEALTH_DISCLOSURE_TEXT, WEALTH_STAGE_POINTS, WEALTH_INTEREST_POINTS } from '../data/content.js';
import FollowUp from './FollowUp.jsx';

export default function WealthReadoutScreen({ answers, sessionId, onRestart }) {
  const stageTag = answers[0] || 'unstructured';
  const interestTag = answers[1] || 'unsure';
  const headline = WEALTH_OPENING_LINE[stageTag];
  const points = [WEALTH_STAGE_POINTS[stageTag], WEALTH_INTEREST_POINTS[interestTag]].filter(Boolean);

  return (
    <section className="screen" aria-live="polite">
      <div className="wrap readout">
        <p className="eyebrow">Current position</p>
        <h2 className="pullquote">{headline}</h2>
        <div className="readout__body">
          {points.map((p, i) => <p key={i}>{p}</p>)}
        </div>
        <div className="disclosure">{WEALTH_DISCLOSURE_TEXT}</div>
        <button type="button" className="btn-text" onClick={onRestart}>Start over</button>
        <FollowUp track="wealth" sessionId={sessionId} />
      </div>
    </section>
  );
}
