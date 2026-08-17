import { useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import { useWorkspaceStore } from '../store/workspaceStore';
import Block from './Block';
import AddBlockPanel from './AddBlockPanel';
import TopBar from './TopBar';
import type { BlockInstance } from '../types';
import { BLOCK_TYPES } from '../lib/blockTypes';
import { uploadDocument } from '../lib/api';
import './Workspace.css';

export default function Workspace() {
  const { workspace, createWorkspace, updateBlock, deleteBlock } = useWorkspaceStore();
  const workspaceRef = useRef<HTMLDivElement>(null);

  // Init workspace
  if (!workspace) {
    createWorkspace('My Workspace');
    return null;
  }

  const handleAddBlock = useCallback(
    (type: string) => {
      const blockType = BLOCK_TYPES[type];
      if (!blockType || !workspace) return;

      // Place new blocks slightly offset so they don't stack
      const offset = workspace.blocks.length * 30;
      const x = 120 + offset;
      const y = 100 + offset;

      const newBlock: BlockInstance = {
        id: nanoid(),
        type,
        version: blockType.version,
        position: { x, y },
        name: `${blockType.name} ${workspace.blocks.length + 1}`,
        config: { ...blockType.defaultConfig },
        selected: false,
        automationMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      useWorkspaceStore.setState((state) => ({
        workspace: state.workspace
          ? { ...state.workspace, blocks: [...state.workspace.blocks, newBlock] }
          : state.workspace,
      }));
    },
    [workspace]
  );

  const handleFileDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (!files.length || !workspace) return;

      const rect = workspaceRef.current?.getBoundingClientRect();
      const x = rect ? e.clientX - rect.left : 200;
      const y = rect ? e.clientY - rect.top : 200;

      for (const file of files) {
        const blockType = BLOCK_TYPES['document'];
        const newBlock: BlockInstance = {
          id: nanoid(),
          type: 'document',
          version: blockType.version,
          position: { x, y },
          name: file.name,
          config: { ...blockType.defaultConfig, filename: file.name },
          selected: false,
          automationMode: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        useWorkspaceStore.setState((state) => ({
          workspace: state.workspace
            ? { ...state.workspace, blocks: [...state.workspace.blocks, newBlock] }
            : state.workspace,
        }));

        try {
          const result = await uploadDocument(file);
          useWorkspaceStore.setState((state) => {
            if (!state.workspace) return state;
            return {
              workspace: {
                ...state.workspace,
                blocks: state.workspace.blocks.map((b) =>
                  b.id === newBlock.id
                    ? { ...b, config: { ...b.config, fileId: result.documentId } }
                    : b
                ),
              },
            };
          });
        } catch {
          // Backend offline — block stays with just filename
        }
      }
    },
    [workspace]
  );

  return (
    <div className="workspace-root">
      <TopBar />

      <div
        className="workspace-canvas"
        ref={workspaceRef}
        onDrop={handleFileDrop}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'copy';
        }}
      >
        {/* Empty state */}
        {workspace.blocks.length === 0 && (
          <div className="workspace-empty">
            <div className="empty-icon">✦</div>
            <p className="empty-title">Your workspace is empty</p>
            <p className="empty-hint">
              Add a block from the panel below, or drag a file here to get started
            </p>
          </div>
        )}

        {/* All blocks */}
        {workspace.blocks.map((block) => (
          <Block
            key={block.id}
            block={block}
            onRemove={deleteBlock}
            onUpdate={(id, updates) =>
              updateBlock(id, updates)
            }
          />
        ))}
      </div>

      <AddBlockPanel onAdd={handleAddBlock} />
    </div>
  );
}
