import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import type { BlockInstance } from '../../models';
import ChatBlock from '../blocks/ChatBlock';
import DocumentBlock from '../blocks/DocumentBlock';
import NoteBlock from '../blocks/NoteBlock';
import KnowledgeBlock from '../blocks/KnowledgeBlock';
import './Block.css';

interface Props {
  block: BlockInstance;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function Block({ block, onRemove, onUpdate }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(block.position);

  return (
    <Draggable
      nodeRef={nodeRef}
      position={pos}
      onStop={(_e, data) => {
        const next = { x: data.x, y: data.y };
        setPos(next);
        onUpdate(block.id, { position: next });
      }}
      handle=".block-drag-handle"
    >
      <div ref={nodeRef} className="block-card">
        {/* Close button — always top-right, above content */}
        <button
          className="block-close"
          onClick={() => onRemove(block.id)}
          title="Remove"
        >
          ✕
        </button>

        {/* Drag grip — invisible strip across the top */}
        <div className="block-drag-handle block-drag-strip" />

        {/* Content (name lives inside each block component) */}
        <div className="block-content">
          {block.type === 'chat' && <ChatBlock block={block} onUpdate={onUpdate} />}
          {block.type === 'document' && <DocumentBlock block={block} onUpdate={onUpdate} />}
          {block.type === 'note' && <NoteBlock block={block} onUpdate={onUpdate} />}
          {block.type === 'knowledge' && <KnowledgeBlock block={block} onUpdate={onUpdate} />}
        </div>
      </div>
    </Draggable>
  );
}
