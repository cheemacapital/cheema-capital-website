import { WEALTH_QUESTIONS } from '../data/content.js';
import Question from './Question.jsx';

export default function WealthFunnelScreen({ current, onAnswer, onBack }) {
  const q = WEALTH_QUESTIONS[current];
  const pct = Math.round((current / WEALTH_QUESTIONS.length) * 100);
  const progressLabel = `Question ${current + 1} of ${WEALTH_QUESTIONS.length}`;

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
