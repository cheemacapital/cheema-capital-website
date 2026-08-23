import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { useAuth } from '../lib/useAuth.jsx';
import { renderStrong } from '../lib/richText.jsx';
import { SECTION_LABELS, SECTION_NARRATIVE } from '../data/content.js';
import Scorecard from '../components/Scorecard.jsx';

// Every pillar carries exactly 4 questions in the full business tier
// (see content.js) — that's not stored per-row, so it's reconstructed
// here rather than persisted redundantly on every result.
const FULL_MAXES = { Ops: 4, Brand: 4, GTM: 4, Bandwidth: 4 };

export default function ResultsPanel() {
  const { user } = useAuth();
  const [result, setResult] = useState(undefined); // undefined = loading, null = none found

  useEffect(() => {
    supabase
      .from('diagnostic_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setResult(data || null));
  }, [user.id]);

  if (result === undefined) return <p className="simple-page__lead">Loading…</p>;

  if (result === null) {
    return (
      <div className="dash-panel">
        <p className="simple-page__lead">No saved diagnostic yet. Take the diagnostic and save the results to see them here.</p>
      </div>
    );
  }

  const primaryLabel = Object.keys(SECTION_LABELS).find((k) => SECTION_LABELS[k] === result.primary_gap);

  return (
    <div className="dash-panel">
      <p className="eyebrow">Your results</p>
      <h2 className="pullquote">
        {result.primary_gap
          ? <>The largest gap identified is in <span className="accent">{result.primary_gap}</span>.</>
          : 'No significant gaps were identified.'}
      </h2>

      {result.scores && (
        <Scorecard scores={result.scores} maxes={FULL_MAXES} />
      )}

      {primaryLabel && SECTION_NARRATIVE[primaryLabel] && (
        <div className="readout__body">
          <p>{renderStrong(SECTION_NARRATIVE[primaryLabel])}</p>
        </div>
      )}

      {Array.isArray(result.answers) && result.answers.length > 0 && (
        <details className="dash-panel__raw">
          <summary>Your answers</summary>
          <ol>
            {result.answers.map((a, i) => <li key={i}>{a}</li>)}
          </ol>
        </details>
      )}

      <p className="dash-panel__meta">Saved {new Date(result.created_at).toLocaleDateString()}</p>
    </div>
  );
}
