import { QUESTIONS, SECTION_LABELS, BASIC_CHECKPOINT } from '../data/content.js';
import Question from './Question.jsx';

export default function BusinessFunnelScreen({ current, onAnswer, onBack }) {
  const q = QUESTIONS[current];
  // `current` advances synchronously the instant the last question is
  // answered, but the screen swap to the readout is deliberately delayed
  // by SCREEN_LEAVE_MS (see setScreen in FunnelApp.jsx) so the outgoing
  // screen can fade out first. That means THIS component keeps rendering
  // for ~200ms with `current` already one past the end of QUESTIONS —
  // QUESTIONS[current] is undefined and `q.title` below would throw,
  // crashing the whole app to a blank white screen right as someone
  // finishes the diagnostic. Bail out to nothing for that brief window
  // instead; main is already fading to opacity 0 at this point anyway.
  if (!q) return null;
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
