import { useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import { useWorkspaceStore } from '../../viewmodels/workspaceViewModel';
import Block from '../ui/Block';
import AddBlockPanel from '../ui/AddBlockPanel';
import TopBar from '../ui/TopBar';
import type { BlockInstance } from '../../models';
import { BLOCK_TYPES } from '../../services/blockTypes';
import { uploadDocument } from '../../services/api';
import { resolveNoOverlap } from '../../services/collisionService';
import './Workspace.css';

export default function Workspace() {
  const { workspace, createWorkspace, updateBlock, deleteBlock } = useWorkspaceStore();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Map of blockId → DOM element for collision size queries
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) blockRefs.current.set(id, el);
    else    blockRefs.current.delete(id);
  }, []);

  const getOtherRects = useCallback((excludeId: string) => {
    const state = useWorkspaceStore.getState();
    const rects: { x: number; y: number; w: number; h: number }[] = [];
    state.workspace?.blocks.forEach((b) => {
      if (b.id === excludeId) return;
      const el = blockRefs.current.get(b.id);
      rects.push({
        x: b.position.x,
        y: b.position.y,
        w: el ? el.offsetWidth  : 300,
        h: el ? el.offsetHeight : 200,
      });
    });
    return rects;
  }, []);

  if (!workspace) {
    createWorkspace('My Workspace');
    return null;
  }

  const handleAddBlock = useCallback(
    (type: string) => {
      const blockType = BLOCK_TYPES[type];
      if (!blockType) return;

      const existingBlocks = useWorkspaceStore.getState().workspace?.blocks ?? [];

      // Default spawn point
      const SPAWN_W = 320;
      const SPAWN_H = 220;
      const otherRects = existingBlocks.map((b) => {
        const el = blockRefs.current.get(b.id);
        return {
          x: b.position.x,
          y: b.position.y,
          w: el ? el.offsetWidth  : SPAWN_W,
          h: el ? el.offsetHeight : SPAWN_H,
        };
      });

      const safePos = resolveNoOverlap(
        { x: 80, y: 80, w: SPAWN_W, h: SPAWN_H },
        otherRects,
      );

      const newBlock: BlockInstance = {
        id: nanoid(),
        type,
        version: blockType.version,
        position: safePos,
        name: `${blockType.name} ${existingBlocks.length + 1}`,
        config: { ...blockType.defaultConfig },
        selected: false,
        automationMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      useWorkspaceStore.setState((s) => ({
        workspace: s.workspace
          ? { ...s.workspace, blocks: [...s.workspace.blocks, newBlock] }
          : s.workspace,
      }));
    },
    []
  );

  const handleFileDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    const x = rect ? e.clientX - rect.left : 120;
    const y = rect ? e.clientY - rect.top : 120;

    for (const file of files) {
      const bt = BLOCK_TYPES['document'];
      const id = nanoid();
      const newBlock: BlockInstance = {
        id,
        type: 'document',
        version: bt.version,
        position: { x, y },
        name: file.name,
        config: { ...bt.defaultConfig, filename: file.name },
        selected: false,
        automationMode: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      useWorkspaceStore.setState((s) => ({
        workspace: s.workspace
          ? { ...s.workspace, blocks: [...s.workspace.blocks, newBlock] }
          : s.workspace,
      }));
      try {
        const result = await uploadDocument(file);
        useWorkspaceStore.setState((s) => ({
          workspace: s.workspace
            ? {
                ...s.workspace,
                blocks: s.workspace.blocks.map((b) =>
                  b.id === id ? { ...b, config: { ...b.config, fileId: result.documentId } } : b
                ),
              }
            : s.workspace,
        }));
      } catch { /* backend offline */ }
    }
  }, []);

  return (
    <div className="workspace-root">
      <TopBar />
      <div
        className="workspace-canvas"
        ref={canvasRef}
        onDrop={handleFileDrop}
        onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
      >
        {workspace.blocks.length === 0 && (
          <div className="workspace-empty">
            <div className="empty-icon">✦</div>
            <p className="empty-title">Your workspace is empty</p>
            <p className="empty-hint">Click "Add Block" below or drag a file here</p>
          </div>
        )}
        {workspace.blocks.map((block) => (
          <Block
            key={block.id}
            block={block}
            onRemove={deleteBlock}
            onUpdate={updateBlock}
            registerRef={registerRef}
            getOtherRects={getOtherRects}
          />
        ))}
      </div>
      <AddBlockPanel onAdd={handleAddBlock} />
    </div>
  );
}
