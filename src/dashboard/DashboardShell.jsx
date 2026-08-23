import { useState } from 'react';
import { useAuth } from '../lib/useAuth.jsx';
import ResultsPanel from './ResultsPanel.jsx';
import NotesPanel from './NotesPanel.jsx';
import ChatPanel from './ChatPanel.jsx';

const TABS = [
  { key: 'results', label: 'Results' },
  { key: 'notes', label: 'Notes' },
  { key: 'chat', label: 'AI companion' }
];

export default function DashboardShell() {
  const { user, signOut } = useAuth();
  const [tab, setTab] = useState('results');

  return (
    <div className="dash">
      <header className="dash-header">
        <div className="wrap dash-header__inner">
          <span className="wordmark">Cheema Capital</span>
          <div className="dash-header__right">
            <span className="dash-header__email">{user?.email}</span>
            <button type="button" className="btn-text" onClick={signOut}>Sign out</button>
          </div>
        </div>
      </header>

      <nav className="dash-tabs">
        <div className="wrap dash-tabs__inner">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={'dash-tab' + (tab === t.key ? ' dash-tab--active' : '')}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="wrap dash-content">
        {tab === 'results' && <ResultsPanel />}
        {tab === 'notes' && <NotesPanel />}
        {tab === 'chat' && <ChatPanel />}
      </main>
    </div>
  );
}
