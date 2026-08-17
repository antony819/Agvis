import { useState } from 'react';
import './TopBar.css';

type Page = 'workspace' | 'community' | 'settings';

export default function TopBar() {
  const [page, setPage] = useState<Page>('workspace');

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-logo">✦</span>
        <span className="topbar-name">Agvis</span>
      </div>

      <nav className="topbar-nav">
        {(['workspace', 'community', 'settings'] as Page[]).map((p) => (
          <button
            key={p}
            className={`topbar-nav-btn ${page === p ? 'active' : ''}`}
            onClick={() => setPage(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </nav>

      <div className="topbar-right">
        <span className="topbar-workspace-name">My Workspace</span>
      </div>
    </header>
  );
}
