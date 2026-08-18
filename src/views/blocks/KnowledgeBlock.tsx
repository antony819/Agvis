import type { BlockInstance } from '../../models';

interface Props {
  block: BlockInstance;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function KnowledgeBlock({ block }: Props) {
  return (
    <div className="knowledge-block">
      <p className="block-label">{block.name}</p>
      <p className="knowledge-empty">No documents yet.</p>
      <button className="knowledge-add-btn">+ Add Document</button>
    </div>
  );
}
