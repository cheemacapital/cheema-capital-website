import { SECTION_ORDER, SECTION_LABELS, SEVERITY_LABELS } from '../data/content.js';

export default function Scorecard({ scores, maxes }) {
  return (
    <ul className="scorecard">
      {SECTION_ORDER.map((section) => {
        const score = scores[section];
        const max = maxes[section];
        const pct = Math.round((score / max) * 100);
        return (
          <li className="scorecard__row" key={section}>
            <span className="scorecard__name">{SECTION_LABELS[section]}</span>
            <span className="scorecard__bar">
              <span className="scorecard__fill" style={{ width: pct + '%' }} />
            </span>
            <span className="scorecard__severity">{SEVERITY_LABELS[score]}</span>
          </li>
        );
      })}
    </ul>
  );
}
