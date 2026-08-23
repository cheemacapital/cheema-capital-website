import { QUESTIONS, SECTION_LABELS, BASIC_CHECKPOINT } from '../data/content.js';
import Question from './Question.jsx';

export default function BusinessFunnelScreen({ current, onAnswer, onBack }) {
  const q = QUESTIONS[current];
  const isDeep = current >= BASIC_CHECKPOINT;
  const tierLength = isDeep ? QUESTIONS.length - BASIC_CHECKPOINT : BASIC_CHECKPOINT;
  const tierIndex = isDeep ? current - BASIC_CHECKPOINT : current;
  const pct = Math.round((tierIndex / tierLength) * 100);
  const progressLabel = `${isDeep ? 'Deeper dive, question ' : 'Question '}${tierIndex + 1} of ${tierLength}`;

  return (
    <section className="screen" aria-live="polite">
      <Question
        title={q.title}
        options={q.options}
        progressPct={pct}
        progressLabel={progressLabel}
        sectionLabel={SECTION_LABELS[q.section]}
        onAnswer={onAnswer}
        onBack={onBack}
        backVisible={current > 0}
      />
    </section>
  );
}
