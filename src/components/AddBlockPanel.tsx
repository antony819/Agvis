import { useState } from 'react';
import { BLOCK_TYPES } from '../lib/blockTypes';
import './AddBlockPanel.css';

interface Props {
  onAdd: (type: string) => void;
}

export default function AddBlockPanel({ onAdd }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div className="panel-backdrop" onClick={() => setOpen(false)} />
      )}

      {/* Block picker */}
      {open && (
        <div className="add-block-panel">
          <div className="panel-header">
            <span className="panel-title">Add a Block</span>
            <button className="panel-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="panel-grid">
            {Object.values(BLOCK_TYPES).map((bt) => (
              <button
                key={bt.type}
                className="panel-item"
                onClick={() => {
                  onAdd(bt.type);
                  setOpen(false);
                }}
              >
                <span className="panel-item-icon">{bt.icon}</span>
                <span className="panel-item-name">{bt.name}</span>
                <span className="panel-item-desc">{bt.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating action button */}
      <button
        className="add-block-fab"
        onClick={() => setOpen((v) => !v)}
        title="Add block"
      >
        <span className="fab-icon">{open ? '✕' : '+'}</span>
        <span className="fab-label">Add Block</span>
      </button>
    </>
  );
}
