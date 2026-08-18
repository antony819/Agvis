import { useCallback, useRef, useState } from 'react';
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
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  getOtherRects: (excludeId: string) => { x: number; y: number; w: number; h: number }[];
  onAskFromDoc?: (block: BlockInstance) => void;
}

export default function Block({ block, onRemove, onUpdate, registerRef, getOtherRects, onAskFromDoc }: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(block.position);

  const setEl = useCallback(
    (el: HTMLDivElement | null) => {
      (nodeRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      registerRef(block.id, el);
    },
    [block.id, registerRef],
  );

  const handleStop = (_e: unknown, data: { x: number; y: number }) => {
    const el = nodeRef.current;
    const w = el ? el.offsetWidth  : 300;
    const h = el ? el.offsetHeight : 200;
    const resolved = resolveNoOverlap({ x: data.x, y: data.y, w, h }, getOtherRects(block.id));
    setPos(resolved);
    onUpdate(block.id, { position: resolved });
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      position={pos}
      onDrag={(_e, data) => setPos({ x: data.x, y: data.y })}
      onStop={handleStop}
      cancel="input, textarea, button, select, a, [contenteditable]"
    >
      <div ref={setEl} className="block-card">
        <button
          className="block-close"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => onRemove(block.id)}
          title="Remove"
        >
          ✕
        </button>

        <div className="block-content">
          {block.type === 'chat' && (
            <ChatBlock block={block} onUpdate={onUpdate} />
          )}
          {block.type === 'document' && (
            <DocumentBlock
              block={block}
              onUpdate={onUpdate}
              onAsk={onAskFromDoc ? () => onAskFromDoc(block) : undefined}
            />
          )}
          {block.type === 'note' && (
            <NoteBlock block={block} onUpdate={onUpdate} />
          )}
          {block.type === 'knowledge' && (
            <KnowledgeBlock block={block} onUpdate={onUpdate} />
          )}
        </div>
      </div>
    </Draggable>
  );
}
