// Pure scoring/tallying logic, ported directly from js/funnel.js. Kept
// separate from any component so the exact same computation feeds both what
// renders on screen and what gets emailed — one source of truth, no risk of
// the two drifting apart.
import {
  QUESTIONS, QUICK_TIER_MAX, SECTION_ORDER, SECTION_LABELS, SECTION_NARRATIVE,
  SECONDARY_LINE, SEVERITY_LABELS, BASIC_CHECKPOINT,
  WEALTH_OPENING_LINE, WEALTH_DISCLOSURE_TEXT
} from '../data/content.js';

export function tallyBasic(answerTags) {
  const counts = {};
  answerTags.forEach((tag) => {
    if (tag === 'none') return;
    counts[tag] = (counts[tag] || 0) + 1;
  });
  return counts;
}

// answerTags here is exactly the first BASIC_CHECKPOINT entries.
export function computeBasicResult(answerTags) {
  const counts = tallyBasic(answerTags);
  const tags = Object.keys(counts);

  if (tags.length === 0) {
    return { hasGap: false, primaryTag: '', secondaryTag: '' };
  }

  const normalized = (tag) => counts[tag] / QUICK_TIER_MAX[tag];
  const sortedTags = tags.slice().sort((a, b) => normalized(b) - normalized(a));
  const primaryTag = sortedTags[0];
  let secondaryTag = '';
  if (sortedTags.length > 1 && (normalized(primaryTag) - normalized(sortedTags[1])) <= 0.5) {
    secondaryTag = sortedTags[1];
  }
  return { hasGap: true, primaryTag, secondaryTag };
}

export function computeSectionScores(answerTags) {
  const scores = { Ops: 0, Brand: 0, GTM: 0, Bandwidth: 0 };
  const maxes = { Ops: 0, Brand: 0, GTM: 0, Bandwidth: 0 };
  QUESTIONS.forEach((q, i) => {
    maxes[q.section] += 1;
    if (answerTags[i] && answerTags[i] !== 'none') scores[q.section] += 1;
  });
  return { scores, maxes };
}

export function computeFullResult(answerTags) {
  const { scores, maxes } = computeSectionScores(answerTags);
  const total = SECTION_ORDER.reduce((sum, s) => sum + scores[s], 0);
  const sorted = SECTION_ORDER.slice().sort((a, b) => scores[b] - scores[a]);

  if (total === 0) {
    return { total, scores, maxes, sorted, primarySection: '', secondarySection: '', narrativeSections: [] };
  }

  const primarySection = sorted[0];
  const secondarySection = scores[sorted[1]] > 0 ? sorted[1] : '';
  const narrativeSections = sorted.filter((s) => scores[s] > 0);
  return { total, scores, maxes, sorted, primarySection, secondarySection, narrativeSections };
}

export function basicReportText({ hasGap, primaryTag, secondaryTag }) {
  const lines = ['Your Cheema Capital Diagnostic Report', ''];
  if (!hasGap) {
    lines.push('No significant gap was identified.', '', 'Current systems and brand presence are consistent with the scale of the business.');
  } else {
    lines.push(`${SECTION_LABELS[primaryTag]} is the primary gap identified.`, '', stripHtml(SECTION_NARRATIVE[primaryTag]));
    if (secondaryTag) {
      lines.push('', stripHtml(SECONDARY_LINE[secondaryTag]));
    }
  }
  return lines.join('\n');
}

export function fullReportText(result) {
  const { total, scores, primarySection, narrativeSections } = result;
  const headlineText = total === 0
    ? 'No significant gaps were identified.'
    : `The largest gap identified is in ${SECTION_LABELS[primarySection]}.`;

  const bodyParagraphs = total === 0
    ? ['Current systems and brand presence are consistent with the scale of the business. A conversation may be useful when planning for further growth.']
    : narrativeSections.map((s) => stripHtml(SECTION_NARRATIVE[s]));

  const scorecardLines = SECTION_ORDER.map((section) => `${SECTION_LABELS[section]} — ${SEVERITY_LABELS[scores[section]]}`).join('\n');

  return [
    'Your Cheema Capital Diagnostic Report',
    '',
    headlineText,
    '',
    'SCORECARD',
    scorecardLines,
    '',
    bodyParagraphs.join('\n\n')
  ].join('\n');
}

// Same "one source of truth" pattern as basicReportText/fullReportText: the
// wealth readout screen and the emailed report both build off this instead
// of duplicating the opening-line lookup + disclosure text in two places.
export function wealthReportText(stageTag) {
  const headline = WEALTH_OPENING_LINE[stageTag] || WEALTH_OPENING_LINE.unstructured;
  return [
    'Your Cheema Capital Wealth Positioning',
    '',
    headline,
    '',
    WEALTH_DISCLOSURE_TEXT
  ].join('\n');
}

function stripHtml(html) {
  return html.replace(/<[^>]+>/g, '');
}

export { BASIC_CHECKPOINT };
