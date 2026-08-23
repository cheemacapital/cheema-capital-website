import {
  ASPIRING_HEADLINE, ASPIRING_BODY_PARAGRAPHS,
  ASPIRING_STAGE_POINTS, ASPIRING_BLOCKER_POINTS, ASPIRING_NEED_POINTS
} from '../data/content.js';
import FollowUp from './FollowUp.jsx';

export default function AspiringReadoutScreen({ answers, sessionId, onRestart }) {
  const stageTag = answers[0];
  const blockerTag = answers[1];
  const needTag = answers[2];
  const points = [
    ASPIRING_STAGE_POINTS[stageTag],
    ASPIRING_BLOCKER_POINTS[blockerTag],
    ASPIRING_NEED_POINTS[needTag]
  ].filter(Boolean);

  return (
    <section className="screen" aria-live="polite">
      <div className="wrap readout">
        <p className="eyebrow">Current position</p>
        <h2 className="pullquote">{ASPIRING_HEADLINE}</h2>
        <div className="readout__body">
          {points.map((p, i) => <p key={i}>{p}</p>)}
          {ASPIRING_BODY_PARAGRAPHS.map((p, i) => <p key={`static-${i}`}>{p}</p>)}
        </div>
        <button type="button" className="btn-text" onClick={onRestart}>Start over</button>
        <FollowUp track="aspiring" sessionId={sessionId} />
      </div>
    </section>
  );
}
