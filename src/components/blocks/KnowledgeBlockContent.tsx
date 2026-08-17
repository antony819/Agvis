import type { BlockInstance } from '../../types';

interface Props {
  block: BlockInstance;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function KnowledgeBlockContent({ }: Props) {
  return (
    <div className="knowledge-block-content">
      <div className="knowledge-empty">
        <p>No documents in this collection yet</p>
        <p className="knowledge-hint">
          Connect Document blocks to add them here
        </p>
      </div>

      <button className="knowledge-add-btn">
        + Add Document
      </button>

      <style>{`
        .knowledge-block-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 200px;
        }

        .knowledge-empty {
          text-align: center;
          padding: 2rem 1rem;
          color: var(--text);
          opacity: 0.6;
        }

        .knowledge-empty p {
          margin: 0.5rem 0;
        }

        .knowledge-hint {
          font-size: 13px;
          font-style: italic;
        }

        .knowledge-add-btn {
          padding: 0.75rem;
          background: var(--accent-bg);
          color: var(--accent);
          border: 1px dashed var(--accent-border);
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .knowledge-add-btn:hover {
          background: var(--accent);
          color: white;
          border-style: solid;
        }
      `}</style>
    </div>
  );
}
