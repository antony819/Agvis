import { useEffect } from 'react';
import { useWorkspaceStore, type AppPage } from '../../viewmodels/workspaceViewModel';
import './TopBar.css';

interface Props {
  onExport?: () => void;
}

export default function TopBar({ onExport }: Props) {
  const { currentPage, setPage, undo, redo, past, future } = useWorkspaceStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      if (!ctrl) return;
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) { e.preventDefault(); redo(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const pages: AppPage[] = ['workspace', 'community', 'settings'];

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-logo">✦</span>
        <span className="topbar-name">Agvis</span>
      </div>

      <nav className="topbar-nav">
        {pages.map((p) => (
          <button
            key={p}
            className={`topbar-nav-btn ${currentPage === p ? 'active' : ''}`}
            onClick={() => setPage(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </nav>

      <div className="topbar-actions">
        <button className="topbar-tool-btn" onClick={undo} disabled={past.length === 0} title="Undo (Ctrl+Z)">↩</button>
        <button className="topbar-tool-btn" onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Y)">↪</button>
        {onExport && (
          <button className="topbar-tool-btn export-btn" onClick={onExport} title="Export as Pack">
            ⬆ Export
          </button>
        )}
      </div>
    </header>
  );
}
