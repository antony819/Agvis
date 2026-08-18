import './TopBar.css';

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-logo">✦</span>
        <span className="topbar-name">Agvis</span>
      </div>
      <nav className="topbar-nav">
        <button className="topbar-nav-btn active">Workspace</button>
        <button className="topbar-nav-btn">Community</button>
        <button className="topbar-nav-btn">Settings</button>
      </nav>
    </header>
  );
}
