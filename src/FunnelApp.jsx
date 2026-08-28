import { useState, useRef, useEffect } from 'react';
import {
  QUESTIONS, WEALTH_QUESTIONS, ASPIRING_QUESTIONS,
  SECTION_LABELS, SEVERITY_LABELS, BASIC_CHECKPOINT
} from './data/content.js';
import { computeBasicResult, computeFullResult } from './lib/diagnostics.js';
import { generateSessionId, postToBackend } from './lib/backend.js';

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import GateScreen from './components/GateScreen.jsx';
import AspiringGateScreen from './components/AspiringGateScreen.jsx';
import BusinessFunnelScreen from './components/BusinessFunnelScreen.jsx';
import BasicReadoutScreen from './components/BasicReadoutScreen.jsx';
import FullReadoutScreen from './components/FullReadoutScreen.jsx';
import WealthFunnelScreen from './components/WealthFunnelScreen.jsx';
import WealthReadoutScreen from './components/WealthReadoutScreen.jsx';
import AspiringFunnelScreen from './components/AspiringFunnelScreen.jsx';
import AspiringReadoutScreen from './components/AspiringReadoutScreen.jsx';
import ServicesScreen from './components/ServicesScreen.jsx';

// Top-down, single source of truth: this component owns every piece of
// state for all three tracks (which screen is showing, where each track's
// funnel is, and the answers collected so far) and passes data + handlers
// down as props. Screen components derive what they render from those
// props; nothing below this component holds state that App doesn't know
// about. Only one screen component is ever mounted at a time, matching the
// original site's one-active-screen behavior without needing the CSS
// display-toggling the vanilla version relied on.
//
// This was the app's sole top-level component until the dashboard was
// added (see App.jsx, dashboard/DashboardApp.jsx) — it's public, has no
// concept of accounts, and stays that way. The only bridge to the
// dashboard is SaveToDashboard on the full readout, which stages a
// result in localStorage and hands off to Supabase auth; nothing here
// imports Supabase directly.
// How long the outgoing screen has to fade out (via the `main-leaving`
// class in index.css) before the incoming one swaps in and plays its own
// fade-in (the `screen-enter` keyframe on `.screen`, already shared by
// every screen component). Keep this in sync with that CSS transition's
// duration below — it's what turns a plain unmount/mount cut into an
// actual out-then-in crossfade.
const SCREEN_LEAVE_MS = 200;

export default function FunnelApp() {
  const [screen, setScreenState] = useState('gate');
  const [leaving, setLeaving] = useState(false);
  const pendingScreenRef = useRef(null);
  const leaveTimeoutRef = useRef(null);

  // Every existing call site below still just calls `setScreen(next)` —
  // this wrapper is what makes ALL of them (header buttons, gate yes/no,
  // funnel-to-readout, everything) fade the outgoing screen out before
  // swapping, instead of cutting instantly. No call site needed to change.
  function setScreen(next) {
    if (next === screen) return;
    window.clearTimeout(leaveTimeoutRef.current);
    pendingScreenRef.current = next;
    setLeaving(true);
    leaveTimeoutRef.current = window.setTimeout(() => {
      setScreenState(pendingScreenRef.current);
      setLeaving(false);
    }, SCREEN_LEAVE_MS);
  }

  useEffect(() => () => window.clearTimeout(leaveTimeoutRef.current), []);

  // For the one link that leaves the SPA entirely (GateScreen's "Based in
  // Champaign-Urbana?" -> the static /champaign-urbana/ page): a real page
  // navigation can't be "swapped" like setScreen above, but it can still
  // fade out first instead of cutting instantly — same SCREEN_LEAVE_MS,
  // same main-leaving class, so it reads as one continuous transition
  // instead of the SPA suddenly cutting to a browser navigation.
  function navigateExternal(href) {
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      window.location.href = href;
      return;
    }
    setLeaving(true);
    window.clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = window.setTimeout(() => {
      window.location.href = href;
    }, SCREEN_LEAVE_MS);
  }

  const [sessionId, setSessionId] = useState(() => generateSessionId());

  // Business track
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answerLabels, setAnswerLabels] = useState([]);

  // Wealth track
  const [wCurrent, setWCurrent] = useState(0);
  const [wAnswers, setWAnswers] = useState([]);
  const [wAnswerLabels, setWAnswerLabels] = useState([]);

  // Aspiring track
  const [aCurrent, setACurrent] = useState(0);
  const [aAnswers, setAAnswers] = useState([]);
  const [aAnswerLabels, setAAnswerLabels] = useState([]);

  function goToGate() {
    setScreen('gate');
  }

  function goToServices() {
    setScreen('services');
  }

  // ---- Gate 1 ----
  function handleGateYes() {
    setCurrent(0);
    setAnswers([]);
    setAnswerLabels([]);
    setSessionId(generateSessionId());
    setScreen('funnel');
  }

  function handleGateNo() {
    setScreen('aspiringGate'); // still no branding decision needed here — header is always visible now
  }

  // ---- Gate 2 (only reached from "No") ----
  function handleAspiringYes() {
    setACurrent(0);
    setAAnswers([]);
    setAAnswerLabels([]);
    setSessionId(generateSessionId());
    setScreen('aspiringFunnel');
  }

  function handleAspiringNo() {
    setWCurrent(0);
    setWAnswers([]);
    setWAnswerLabels([]);
    setSessionId(generateSessionId());
    setScreen('wealthFunnel');
  }

  // ---- Business track: 5-question tier, then an 11-question tier if they opt in ----
  function handleBusinessAnswer(tag, label) {
    const nextAnswers = answers.slice();
    nextAnswers[current] = tag;
    const nextLabels = answerLabels.slice();
    nextLabels[current] = label;
    const nextIndex = current + 1;

    setAnswers(nextAnswers);
    setAnswerLabels(nextLabels);
    setCurrent(nextIndex);

    if (nextIndex === BASIC_CHECKPOINT) {
      const { primaryTag, secondaryTag } = computeBasicResult(nextAnswers.slice(0, BASIC_CHECKPOINT));
      postToBackend({
        action: 'submit',
        track: 'business',
        row: [
          new Date().toISOString(), sessionId, 'basic',
          nextLabels[0] || '', nextLabels[1] || '', nextLabels[2] || '', nextLabels[3] || '', nextLabels[4] || '',
          '', '', '', '', '', '', '', '', '', '', '',
          primaryTag ? SECTION_LABELS[primaryTag] : '', secondaryTag ? SECTION_LABELS[secondaryTag] : '',
          '', '', '', '',
          'FALSE', '', '', '', ''
        ]
      });
      setScreen('basicReadout');
    } else if (nextIndex >= QUESTIONS.length) {
      const result = computeFullResult(nextAnswers);
      const { scores, primarySection, secondarySection } = result;
      postToBackend({
        action: 'submit',
        track: 'business',
        row: [
          new Date().toISOString(), sessionId, 'full',
          nextLabels[0] || '', nextLabels[1] || '', nextLabels[2] || '', nextLabels[3] || '', nextLabels[4] || '',
          nextLabels[5] || '', nextLabels[6] || '', nextLabels[7] || '', nextLabels[8] || '', nextLabels[9] || '',
          nextLabels[10] || '', nextLabels[11] || '', nextLabels[12] || '', nextLabels[13] || '', nextLabels[14] || '', nextLabels[15] || '',
          primarySection ? SECTION_LABELS[primarySection] : '', secondarySection ? SECTION_LABELS[secondarySection] : '',
          SEVERITY_LABELS[scores.Ops], SEVERITY_LABELS[scores.Brand], SEVERITY_LABELS[scores.GTM], SEVERITY_LABELS[scores.Bandwidth],
          'FALSE', '', '', '', ''
        ]
      });
      setScreen('readout');
    }
    // otherwise: stay on 'funnel', current has already advanced to the next question
  }

  function handleBusinessBack() {
    if (current > 0) {
      const nextIndex = current - 1;
      setCurrent(nextIndex);
      setAnswers((prev) => prev.slice(0, nextIndex));
      setAnswerLabels((prev) => prev.slice(0, nextIndex));
    }
  }

  function handleDiveDeeper() {
    setScreen('funnel'); // current is already BASIC_CHECKPOINT, this continues into the deeper set
  }

  // ---- Wealth track ----
  function handleWealthAnswer(tag, label) {
    const nextAnswers = wAnswers.slice();
    nextAnswers[wCurrent] = tag;
    const nextLabels = wAnswerLabels.slice();
    nextLabels[wCurrent] = label;
    const nextIndex = wCurrent + 1;

    setWAnswers(nextAnswers);
    setWAnswerLabels(nextLabels);
    setWCurrent(nextIndex);

    if (nextIndex >= WEALTH_QUESTIONS.length) {
      const stageTag = nextAnswers[0] || 'unstructured';
      postToBackend({
        action: 'submit',
        track: 'wealth',
        row: [
          new Date().toISOString(), sessionId,
          nextLabels[0] || '', nextLabels[1] || '', stageTag,
          'FALSE', '', '', '', ''
        ]
      });
      setScreen('wealthReadout');
    }
  }

  function handleWealthBack() {
    if (wCurrent > 0) {
      const nextIndex = wCurrent - 1;
      setWCurrent(nextIndex);
      setWAnswers((prev) => prev.slice(0, nextIndex));
      setWAnswerLabels((prev) => prev.slice(0, nextIndex));
    }
  }

  // ---- Aspiring / early-stage founder track ----
  function handleAspiringAnswer(tag, label) {
    const nextAnswers = aAnswers.slice();
    nextAnswers[aCurrent] = tag;
    const nextLabels = aAnswerLabels.slice();
    nextLabels[aCurrent] = label;
    const nextIndex = aCurrent + 1;

    setAAnswers(nextAnswers);
    setAAnswerLabels(nextLabels);
    setACurrent(nextIndex);

    if (nextIndex >= ASPIRING_QUESTIONS.length) {
      postToBackend({
        action: 'submit',
        track: 'aspiring',
        row: [
          new Date().toISOString(), sessionId,
          nextLabels[0] || '', nextLabels[1] || '', nextLabels[2] || '',
          'FALSE', '', '', '', ''
        ]
      });
      setScreen('aspiringReadout');
    }
  }

  function handleAspiringBack() {
    if (aCurrent > 0) {
      const nextIndex = aCurrent - 1;
      setACurrent(nextIndex);
      setAAnswers((prev) => prev.slice(0, nextIndex));
      setAAnswerLabels((prev) => prev.slice(0, nextIndex));
    }
  }

  let screenEl;
  switch (screen) {
    case 'gate':
      screenEl = <GateScreen onYes={handleGateYes} onNo={handleGateNo} onChampaignClick={() => navigateExternal('/champaign-urbana/')} />;
      break;
    case 'aspiringGate':
      screenEl = <AspiringGateScreen onYes={handleAspiringYes} onNo={handleAspiringNo} />;
      break;
    case 'funnel':
      screenEl = <BusinessFunnelScreen current={current} onAnswer={handleBusinessAnswer} onBack={handleBusinessBack} />;
      break;
    case 'basicReadout':
      screenEl = <BasicReadoutScreen answers={answers} onDiveDeeper={handleDiveDeeper} onRestart={goToGate} />;
      break;
    case 'readout':
      screenEl = <FullReadoutScreen answers={answers} answerLabels={answerLabels} sessionId={sessionId} onRestart={goToGate} />;
      break;
    case 'wealthFunnel':
      screenEl = <WealthFunnelScreen current={wCurrent} onAnswer={handleWealthAnswer} onBack={handleWealthBack} />;
      break;
    case 'wealthReadout':
      screenEl = <WealthReadoutScreen answers={wAnswers} sessionId={sessionId} onRestart={goToGate} />;
      break;
    case 'aspiringFunnel':
      screenEl = <AspiringFunnelScreen current={aCurrent} onAnswer={handleAspiringAnswer} onBack={handleAspiringBack} />;
      break;
    case 'aspiringReadout':
      screenEl = <AspiringReadoutScreen answers={aAnswers} sessionId={sessionId} onRestart={goToGate} />;
      break;
    case 'services':
      screenEl = <ServicesScreen onTakeDiagnostic={goToGate} />;
      break;
    default:
      screenEl = <GateScreen onYes={handleGateYes} onNo={handleGateNo} />;
  }

  return (
    <>
      <Header onLogoClick={goToGate} onServicesClick={goToServices} onBookClick={() => navigateExternal('/book/')} />
      <main className={leaving ? 'main-leaving' : ''}>{screenEl}</main>
      <Footer />
    </>
  );
}
