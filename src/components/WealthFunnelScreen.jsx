import { WEALTH_QUESTIONS } from '../data/content.js';
import Question from './Question.jsx';

export default function WealthFunnelScreen({ current, onAnswer, onBack }) {
  const q = WEALTH_QUESTIONS[current];
  // Same guard as BusinessFunnelScreen.jsx: `current` moves past the last
  // valid index the instant the final question is answered, but this
  // screen keeps rendering for SCREEN_LEAVE_MS while it fades out (see
  // setScreen in FunnelApp.jsx) — without this, WEALTH_QUESTIONS[current]
  // is undefined and `q.title` crashes the app to a blank screen.
  if (!q) return null;
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
