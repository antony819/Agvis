import { useCallback, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import type { BlockInstance } from '../../models';
import ChatBlock from '../blocks/ChatBlock';
import DocumentBlock from '../blocks/DocumentBlock';
import NoteBlock from '../blocks/NoteBlock';
import KnowledgeBlock from '../blocks/KnowledgeBlock';
import ComposerBlock from '../blocks/ComposerBlock';
import { resolveNoOverlap } from '../../services/collisionService';
import './Block.css';

interface Props {
  block: BlockInstance;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
  onDuplicate: (block: BlockInstance) => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  getOtherRects: (excludeId: string) => { x: number; y: number; w: number; h: number }[];
  onAskFromDoc?: (block: BlockInstance) => void;
}

export default function Block({
  block, onRemove, onUpdate, onDuplicate, registerRef, getOtherRects, onAskFromDoc,
}: Props) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(block.position);
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameInput, setNameInput] = useState(block.name);

  const setEl = useCallback(
    (el: HTMLDivElement | null) => {
      (nodeRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
      registerRef(block.id, el);
    },
    [block.id, registerRef],
  );

  const handleStop = (_e: unknown, data: { x: number; y: number }) => {
    const el = nodeRef.current;
    const w = el?.offsetWidth ?? 300;
    const h = el?.offsetHeight ?? 200;
    
    // Get canvas bounds
    const canvas = el?.closest('.workspace-canvas') as HTMLElement | null;
    const canvasWidth = canvas?.clientWidth ?? window.innerWidth;
    const canvasHeight = canvas?.clientHeight ?? window.innerHeight;
    
    // Constrain to canvas bounds (keep at least 50px visible)
    const minVisible = 50;
    let constrainedX = Math.max(-w + minVisible, Math.min(data.x, canvasWidth - minVisible));
    let constrainedY = Math.max(0, Math.min(data.y, canvasHeight - minVisible));
    
    // Then resolve collisions
    const resolved = resolveNoOverlap(
      { x: constrainedX, y: constrainedY, w, h }, 
      getOtherRects(block.id)
    );
    
    setPos(resolved);
    onUpdate(block.id, { position: resolved });
  };

  const commitRename = () => {
    const trimmed = nameInput.trim();
    if (trimmed) onUpdate(block.id, { name: trimmed });
    setRenaming(false);
    setMenuOpen(false);
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
        {/* ── Top-right controls ── */}
        <div className="block-controls">
          <div className="block-menu-wrap">
            <button
              className="block-menu-btn"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => { setMenuOpen((v) => !v); setRenaming(false); }}
              title="More"
            >
              ⋯
            </button>

            {menuOpen && (
              <>
                <div className="block-menu-backdrop" onClick={() => setMenuOpen(false)} />
                <div className="block-menu-dropdown">
                  {renaming ? (
                    <div className="block-menu-rename">
                      <input
                        autoFocus
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitRename();
                          if (e.key === 'Escape') { setRenaming(false); setNameInput(block.name); }
                        }}
                      />
                      <button onClick={commitRename}>✓</button>
                    </div>
                  ) : (
                    <>
                      <button className="block-menu-item" onClick={() => setRenaming(true)}>
                        ✏ Rename
                      </button>
                      <button
                        className="block-menu-item"
                        onClick={() => { onDuplicate(block); setMenuOpen(false); }}
                      >
                        ⧉ Duplicate
                      </button>
                      <div className="block-menu-divider" />
                      <button
                        className="block-menu-item danger"
                        onClick={() => onRemove(block.id)}
                      >
                        ✕ Remove
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            className="block-close"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => onRemove(block.id)}
            title="Remove"
          >
            ✕
          </button>
        </div>

        <div className="block-content">
          {block.type === 'chat' && <ChatBlock block={block} onUpdate={onUpdate} />}
          {block.type === 'document' && (
            <DocumentBlock
              block={block}
              onUpdate={onUpdate}
              onAsk={onAskFromDoc ? () => onAskFromDoc(block) : undefined}
            />
          )}
          {block.type === 'note' && <NoteBlock block={block} onUpdate={onUpdate} />}
          {block.type === 'knowledge' && <KnowledgeBlock block={block} onUpdate={onUpdate} />}
          {block.type === 'composer' && <ComposerBlock block={block} onUpdate={onUpdate} />}
        </div>
      </div>
    </Draggable>
  );
}
