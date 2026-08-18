import { useRef, useState } from 'react';
import Draggable from 'react-draggable';
import type { BlockInstance } from '../../models';
import ChatBlock from '../blocks/ChatBlock';
import DocumentBlock from '../blocks/DocumentBlock';
import NoteBlock from '../blocks/NoteBlock';
import KnowledgeBlock from '../blocks/KnowledgeBlock';
import { resolveNoOverlap } from '../../services/collisionService';
import './Block.css';

interface Props {
  block: BlockInstance;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
  /** Called once the DOM node is available so the canvas can track sizes */
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  /** Returns bounding rects of every block except the one being dragged */
  getOtherRects: (excludeId: string) => { x: number; y: number; w: number; h: number }[];
}

export default function Block({ block, onRemove, onUpdate, registerRef, getOtherRects }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(block.position);

  const handleStop = (_e: unknown, data: { x: number; y: number }) => {
    const el = nodeRef.current;
    if (!el) {
      const next = { x: data.x, y: data.y };
      setPos(next);
      onUpdate(block.id, { position: next });
      return;
    }

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const others = getOtherRects(block.id);

    const resolved = resolveNoOverlap({ x: data.x, y: data.y, w, h }, others);
    setPos(resolved);
    onUpdate(block.id, { position: resolved });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={pos}
      onStop={handleStop}
      handle=".block-drag-handle"
    >
      <div
        ref={(el) => {
          (nodeRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
          registerRef(block.id, el);
        }}
        className="block-card"
      >
        <button className="block-close" onClick={() => onRemove(block.id)} title="Remove">
          ✕
        </button>

        <div className="block-drag-handle block-drag-strip" />

        <div className="block-content">
          {block.type === 'chat'      && <ChatBlock      block={block} onUpdate={onUpdate} />}
          {block.type === 'document'  && <DocumentBlock  block={block} onUpdate={onUpdate} />}
          {block.type === 'note'      && <NoteBlock      block={block} onUpdate={onUpdate} />}
          {block.type === 'knowledge' && <KnowledgeBlock block={block} onUpdate={onUpdate} />}
        </div>
      </div>
    </Draggable>
  );
}
