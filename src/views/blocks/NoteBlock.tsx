import type { BlockInstance } from '../../models';

interface Props {
  block: BlockInstance;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function NoteBlock({ block, onUpdate }: Props) {
  return (
    <div className="note-block">
      <p className="block-label">{block.name}</p>
      <textarea
        className="note-textarea"
        value={block.config.content || ''}
        onChange={(e) =>
          onUpdate(block.id, { config: { ...block.config, content: e.target.value } })
        }
        placeholder="Write your notes here…"
      />
    </div>
  );
}
