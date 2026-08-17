import { useState } from 'react';
import Draggable from 'react-draggable';
import type { BlockInstance } from '../types';
import { getBlockType } from '../lib/blockTypes';
import ChatBlockContent from './blocks/ChatBlockContent';
import DocumentBlockContent from './blocks/DocumentBlockContent';
import NoteBlockContent from './blocks/NoteBlockContent';
import KnowledgeBlockContent from './blocks/KnowledgeBlockContent';
import './Block.css';

interface BlockProps {
  block: BlockInstance;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function Block({ block, onRemove, onUpdate }: BlockProps) {
  const [minimized, setMinimized] = useState(false);
  const blockType = getBlockType(block.type);

  if (!blockType) return null;

  const handleStop = (_e: any, data: { x: number; y: number }) => {
    onUpdate(block.id, { position: { x: data.x, y: data.y } });
  };

  return (
    <Draggable
      defaultPosition={block.position}
      onStop={handleStop}
      handle=".block-drag-handle"
      bounds="parent"
    >
      <div className={`block-card ${minimized ? 'minimized' : ''}`}>
        <div className="block-drag-handle block-titlebar">
          <span className="block-type-icon">{blockType.icon}</span>
          <span className="block-title">{block.name}</span>
          <div className="block-actions">
            <button
              className="block-action-btn"
              onClick={() => setMinimized((m) => !m)}
              title={minimized ? 'Expand' : 'Minimise'}
            >
              {minimized ? '▲' : '▼'}
            </button>
            <button
              className="block-action-btn close"
              onClick={() => onRemove(block.id)}
              title="Remove"
            >
              ✕
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="block-body">
            {block.type === 'chat' && (
              <ChatBlockContent block={block} onUpdate={onUpdate} />
            )}
            {block.type === 'document' && (
              <DocumentBlockContent block={block} onUpdate={onUpdate} />
            )}
            {block.type === 'note' && (
              <NoteBlockContent block={block} onUpdate={onUpdate} />
            )}
            {block.type === 'knowledge' && (
              <KnowledgeBlockContent block={block} onUpdate={onUpdate} />
            )}
          </div>
        )}
      </div>
    </Draggable>
  );
}
