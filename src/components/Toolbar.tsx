import { useWorkspaceStore } from '../store/workspaceStore';
import './Toolbar.css';

export default function Toolbar() {
  const { toggleBlockLibrary } = useWorkspaceStore();

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button onClick={toggleBlockLibrary} className="toolbar-btn">
          ≡
        </button>
        <nav className="toolbar-nav">
          <a href="#workspace" className="active">Workspace</a>
          <a href="#library">Library</a>
          <a href="#community">Community</a>
          <a href="#settings">Settings</a>
        </nav>
      </div>
      
      <div className="toolbar-right">
        <button className="toolbar-btn" title="Select">⎚</button>
        <button className="toolbar-btn" title="Undo">⟲</button>
        <button className="toolbar-btn" title="Redo">⟳</button>
        <button className="toolbar-btn" title="Run">▶</button>
      </div>
    </div>
  );
}
