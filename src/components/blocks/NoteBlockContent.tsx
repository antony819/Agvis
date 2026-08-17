import type { BlockInstance } from '../../types';

interface Props {
  block: BlockInstance;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function NoteBlockContent({ block, onUpdate }: Props) {
  const handleChange = (value: string) => {
    onUpdate(block.id, {
      config: { ...block.config, content: value },
    });
  };

  return (
    <div className="note-block-content">
      <textarea
        value={block.config.content || ''}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Write your notes here (Markdown supported)..."
        className="note-textarea"
      />

      <style>{`
        .note-block-content {
          min-height: 200px;
        }

        .note-textarea {
          width: 100%;
          min-height: 250px;
          padding: 0.875rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          font-family: var(--mono);
          line-height: 1.6;
          resize: vertical;
          background: var(--bg-secondary);
          color: var(--text);
        }

        .note-textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-bg);
        }
      `}</style>
    </div>
  );
}
