// All diagnostic copy and question data, ported directly from the original
// site's js/funnel.js. This is the single source of truth for what each
// track asks and what each answer means — components and the report-text
// builder both read from here, nothing is duplicated.

export const SECTION_LABELS = { Ops: 'Systems', Brand: 'Signal', GTM: 'Pipeline', Bandwidth: 'Capacity' };
export const SECTION_ORDER = ['Ops', 'Brand', 'GTM', 'Bandwidth'];

// First 5 = the quick diagnostic (one per area, Brand gets two). Checkpoint after this.
// Remaining 11 = the deeper dive, only reached if they opt in.
export const BASIC_CHECKPOINT = 5;

export const QUESTIONS = [
  // ---- Quick diagnostic (questions 1-5) ----
  { section: 'Ops', title: 'How does your team currently track leads, clients, or projects?', options: [
    { label: 'A spreadsheet, a notebook, or no formal system', tag: 'Ops' },
    { label: 'Email threads and handwritten notes', tag: 'Ops' },
    { label: 'A CRM or project tool that isn’t used consistently', tag: 'Ops' },
    { label: 'A CRM or project tool used consistently across the team', tag: 'none' }
  ]},
  { section: 'Brand', title: 'When someone Googles your business right now, what do they find?', options: [
    { label: 'An outdated website, or no website', tag: 'Brand' },
    { label: 'A website that hasn’t been updated in several years', tag: 'Brand' },
    { label: 'A website that doesn’t clearly convey what makes the business different', tag: 'Brand' },
    { label: 'A website and online presence that represents the business accurately', tag: 'none' }
  ]},
  { section: 'GTM', title: 'How do most of your new clients find you today?', options: [
    { label: 'Referrals only', tag: 'GTM' },
    { label: 'Not tracked or measured', tag: 'GTM' },
    { label: 'A mix of referrals and marketing, with inconsistent results', tag: 'GTM' },
    { label: 'A consistent, repeatable pipeline', tag: 'none' }
  ]},
  { section: 'Brand', title: 'If a stranger read your website for 10 seconds, would they know exactly what you do and who it’s for?', options: [
    { label: 'No', tag: 'Brand' },
    { label: 'Unclear', tag: 'Brand' },
    { label: 'Mostly', tag: 'none' },
    { label: 'Yes, clearly', tag: 'none' }
  ]},
  { section: 'Bandwidth', title: 'Who on your team is responsible for keeping the website, brand, and systems up to date?', options: [
    { label: 'No one specifically, handled inconsistently', tag: 'Bandwidth' },
    { label: 'The owner, in addition to other responsibilities', tag: 'Bandwidth' },
    { label: 'One person, with limited capacity for it', tag: 'Bandwidth' },
    { label: 'This is clearly assigned and managed', tag: 'none' }
  ]},
  // ---- Deeper dive (questions 6-16, only if they opt in) ----
  { section: 'Ops', title: 'If you took a full week off with no phone, what would happen to daily operations?', options: [
    { label: 'Operations would be significantly disrupted', tag: 'Ops' },
    { label: 'Some tasks would be delayed', tag: 'Ops' },
    { label: 'Minor issues, mostly unaffected', tag: 'Ops' },
    { label: 'No disruption', tag: 'none' }
  ]},
  { section: 'Ops', title: 'How do you currently handle invoicing and getting paid?', options: [
    { label: 'Manually, without a set schedule', tag: 'Ops' },
    { label: 'Partially automated, with manual follow-up required', tag: 'Ops' },
    { label: 'Mostly automated, with some inconsistency', tag: 'Ops' },
    { label: 'Fully automated and on schedule', tag: 'none' }
  ]},
  { section: 'Ops', title: 'How much of your process knowledge lives only in your head, not written down anywhere?', options: [
    { label: 'Most of it', tag: 'Ops' },
    { label: 'A significant portion', tag: 'Ops' },
    { label: 'Some of it, key processes are documented', tag: 'Ops' },
    { label: 'Little to none, it’s documented', tag: 'none' }
  ]},
  { section: 'Brand', title: 'How does your business look compared to your newer, more tech-savvy competitors?', options: [
    { label: 'Noticeably behind', tag: 'Brand' },
    { label: 'Somewhat dated', tag: 'Brand' },
    { label: 'About the same', tag: 'none' },
    { label: 'More current', tag: 'none' }
  ]},
  { section: 'Brand', title: 'When was the last time your website or brand materials were meaningfully updated?', options: [
    { label: 'Not within recent memory', tag: 'Brand' },
    { label: 'Years ago', tag: 'Brand' },
    { label: 'Within the last year or two', tag: 'none' },
    { label: 'Recently, as part of a planned update', tag: 'none' }
  ]},
  { section: 'GTM', title: 'If your best referral source disappeared tomorrow, what would happen to your pipeline?', options: [
    { label: 'It would be significantly reduced', tag: 'GTM' },
    { label: 'It would slow considerably', tag: 'GTM' },
    { label: 'It would be affected, but manageable', tag: 'GTM' },
    { label: 'Other channels would sustain it', tag: 'none' }
  ]},
  { section: 'GTM', title: 'Do you know your actual cost to acquire a new client?', options: [
    { label: 'Not tracked', tag: 'GTM' },
    { label: 'An estimate, not a measured figure', tag: 'GTM' },
    { label: 'Approximately, not precisely', tag: 'GTM' },
    { label: 'Yes, it’s tracked', tag: 'none' }
  ]},
  { section: 'GTM', title: 'How predictable is your revenue three months out?', options: [
    { label: 'Not predictable', tag: 'GTM' },
    { label: 'Somewhat, based on estimates', tag: 'GTM' },
    { label: 'Fairly predictable', tag: 'none' },
    { label: 'Very predictable, based on forecasting', tag: 'none' }
  ]},
  { section: 'Bandwidth', title: 'How many hats are you personally wearing in the business right now?', options: [
    { label: 'Most of them', tag: 'Bandwidth' },
    { label: 'Most of the important ones', tag: 'Bandwidth' },
    { label: 'More than is sustainable', tag: 'Bandwidth' },
    { label: 'A sustainable number', tag: 'none' }
  ]},
  { section: 'Bandwidth', title: 'If you wanted to take a real two-week vacation, could you?', options: [
    { label: 'No', tag: 'Bandwidth' },
    { label: 'Only while remaining reachable', tag: 'Bandwidth' },
    { label: 'Mostly, with some check-ins', tag: 'Bandwidth' },
    { label: 'Yes', tag: 'none' }
  ]},
  { section: 'Bandwidth', title: 'Is there a clear next hire that would relieve the pressure on your team, and do you have a plan to make it?', options: [
    { label: 'There is a need, but no plan', tag: 'Bandwidth' },
    { label: 'Discussed, but not formalized', tag: 'Bandwidth' },
    { label: 'A plan exists, not finalized', tag: 'Bandwidth' },
    { label: 'In motion, or not needed', tag: 'none' }
  ]}
];

// The first 5 questions are not evenly split across pillars: Ops/GTM/Bandwidth
// get 1 question each, Brand gets 2 (Q2 and Q4). A raw tally would let Brand
// win the "primary gap" purely by having more chances to score, regardless of
// actual severity. QUICK_TIER_MAX records each pillar's max possible raw count
// in this 5-question tier so counts can be normalized to a 0-1 scale before
// comparing across pillars.
export const QUICK_TIER_MAX = { Ops: 1, Brand: 2, GTM: 1, Bandwidth: 1 };

export const BASIC_NONE_HEADLINE = 'No significant gap was identified.';
export const BASIC_NONE_BODY = 'Current systems and brand presence are consistent with the scale of the business.';

export const SECONDARY_LINE = {
  Ops: 'A secondary gap was identified in Systems.',
  Brand: 'A secondary gap was identified in Signal.',
  GTM: 'A secondary gap was identified in Pipeline.',
  Bandwidth: 'A secondary gap was identified in Capacity.'
};

// Narrative strings carry a literal <strong> tag for the one emphasized
// clause. Rendered via a small helper (see lib/richText.jsx) that turns
// this into real JSX rather than dangerouslySetInnerHTML — the emailed
// plain-text version strips the tags back out with the same stripHtml
// helper the original site used.
export const SECTION_NARRATIVE = {
  Ops: 'Operations currently rely on manual processes and undocumented knowledge. This is functional at the current scale but limits capacity for growth. Time spent on repeated manual tasks reduces time available for client work. <strong>Internal systems are addressed first</strong> to support scaling without disruption.',
  Brand: 'The business’s capabilities are not fully reflected in its website and online presence. This affects credibility prior to initial contact, since online impressions are typically formed within seconds. <strong>The external presentation is addressed</strong> to align with the business’s actual capabilities.',
  GTM: 'Growth currently depends primarily on word of mouth rather than a structured pipeline. This limits growth to the existing network. <strong>Positioning and go-to-market strategy are addressed</strong> to build a repeatable acquisition process.',
  Bandwidth: 'Brand and operations currently depend on one person’s time and availability. This is a capacity constraint rather than a strategy issue, and is typically the first limiting factor under growth. <strong>Operations and brand work are reassigned</strong> to reduce dependency on one person.'
};

export const SEVERITY_LABELS = ['No gap identified', 'Minor gap', 'Moderate gap', 'Major gap', 'Severe gap'];

export const WEALTH_QUESTIONS = [
  { title: 'Where are you with your wealth and investments today?', options: [
    { label: 'Managed independently, without a formal system', tag: 'unstructured' },
    { label: 'Holdings exist across multiple accounts or asset types, without a unified strategy', tag: 'unstructured' },
    { label: 'Generally established, seeking an outside perspective', tag: 'active' },
    { label: 'Seeking to understand the landscape before taking action', tag: 'learner' }
  ]},
  { title: 'What are you looking for right now?', options: [
    { label: 'A comprehensive view of overall finances', tag: 'education' },
    { label: 'Insight into a specific asset class or holding', tag: 'conversation' },
    { label: 'A review of the current approach', tag: 'conversation' },
    { label: 'Not yet determined', tag: 'unsure' }
  ]}
];

export const WEALTH_OPENING_LINE = {
  unstructured: 'Current holdings exist without a formal plan.',
  active: 'Existing positions are established. Interest is in additional perspective, not introductory material.',
  learner: 'Interest is in understanding the landscape prior to taking action.'
};

export const WEALTH_DISCLOSURE_TEXT = 'Cheema Capital\'s wealth practice provides a comprehensive view of an individual\'s financial picture, with a specialty in crypto and digital assets. This practice is currently education-focused and is not a registered investment adviser (Series 65 licensure is in progress). Information provided is educational and does not constitute personalized investment advice.';

// Curated points shown on the wealth readout, built from the two collected
// answers rather than a generic body of text — no report content is ever
// emailed to a visitor on any track, so the readout itself needs to carry
// real signal back to them instead.
export const WEALTH_STAGE_POINTS = {
  unstructured: 'Current holdings exist without a unified strategy across assets.',
  active: 'Existing positions are established — the gap is perspective, not education.',
  learner: 'No positions are in place yet; the priority is understanding the landscape before acting.'
};

export const WEALTH_INTEREST_POINTS = {
  education: 'Interest is in a comprehensive view across all holdings, not a narrow crypto-only lens.',
  conversation: 'The interest is in a direct conversation or review, not generic self-serve education.',
  unsure: 'The specific need hasn\'t been defined yet — a direct conversation is the fastest way to clarify it.'
};

export const ASPIRING_QUESTIONS = [
  { title: 'Where are you in building this?', options: [
    { label: 'An idea under consideration', tag: 'idea' },
    { label: 'Actively validating it, speaking with potential customers', tag: 'validating' },
    { label: 'Building a product or a first version', tag: 'building' },
    { label: 'First paying customers acquired', tag: 'early-revenue' }
  ]},
  { title: 'What’s slowing you down right now?', options: [
    { label: 'Uncertainty about whether the idea is worth pursuing', tag: 'idea-doubt' },
    { label: 'No clear go-to-market plan', tag: 'no-gtm' },
    { label: 'Working independently, without additional perspective', tag: 'alone' },
    { label: 'Limited capital', tag: 'capital' }
  ]},
  { title: 'What would be most useful to you right now?', options: [
    { label: 'An assessment of the idea', tag: 'gut-check' },
    { label: 'Help shaping positioning and go-to-market before launch', tag: 'positioning' },
    { label: 'A discussion partner', tag: 'sounding-board' },
    { label: 'Not yet determined', tag: 'unsure' }
  ]}
];

export const ASPIRING_HEADLINE = 'Positioning work is applicable prior to launch.';
export const ASPIRING_BODY_PARAGRAPHS = [
  'Cheema Capital\'s consulting practice is designed for operating businesses. Positioning and go-to-market strategy, the areas covered for existing clients, are also applicable prior to launch.',
  'Contact is available for an additional perspective during the building phase.'
];

// Curated points shown on the aspiring readout, built from the three
// collected answers. Previously this readout was fully static and ignored
// everything the visitor answered — the on-screen content needs to
// actually reflect their answers instead, since no report is ever emailed.
export const ASPIRING_STAGE_POINTS = {
  idea: 'The idea is still under consideration, not yet in active development.',
  validating: 'Active validation is underway — speaking directly with potential customers.',
  building: 'A product or first version is in active development.',
  'early-revenue': 'First paying customers are already acquired, the earliest go-to-market signal.'
};

export const ASPIRING_BLOCKER_POINTS = {
  'idea-doubt': 'The primary uncertainty is whether the idea itself is worth pursuing.',
  'no-gtm': 'There is no clear go-to-market plan in place yet.',
  alone: 'The work is being done independently, without outside perspective.',
  capital: 'Capital is the binding constraint right now, not strategy.'
};

export const ASPIRING_NEED_POINTS = {
  'gut-check': 'What would help most right now is an outside assessment of the idea itself.',
  positioning: 'What would help most right now is shaping positioning and go-to-market before launch.',
  'sounding-board': 'What would help most right now is a discussion partner, not a formal engagement.',
  unsure: 'The most useful next step hasn\'t been defined yet.'
};
