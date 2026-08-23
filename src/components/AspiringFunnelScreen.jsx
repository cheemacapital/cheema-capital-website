import { ASPIRING_QUESTIONS } from '../data/content.js';
import Question from './Question.jsx';

export default function AspiringFunnelScreen({ current, onAnswer, onBack }) {
  const q = ASPIRING_QUESTIONS[current];
  const pct = Math.round((current / ASPIRING_QUESTIONS.length) * 100);
  const progressLabel = `Question ${current + 1} of ${ASPIRING_QUESTIONS.length}`;

  return (
    <section className="screen" aria-live="polite">
      <Question
        title={q.title}
        options={q.options}
        progressPct={pct}
        progressLabel={progressLabel}
        onAnswer={onAnswer}
        onBack={onBack}
        backVisible={current > 0}
      />
    </section>
  );
}
