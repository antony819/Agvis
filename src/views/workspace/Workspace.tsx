import { useCallback, useRef } from 'react';
import { nanoid } from 'nanoid';
import { useWorkspaceStore } from '../../viewmodels/workspaceViewModel';
import Block from '../ui/Block';
import AddBlockPanel from '../ui/AddBlockPanel';
import TopBar from '../ui/TopBar';
import CommunityPage from '../community/CommunityPage';
import SettingsPage from '../settings/SettingsPage';
import type { BlockInstance } from '../../models';
import { BLOCK_TYPES } from '../../services/blockTypes';
import { uploadDocument } from '../../services/api';
import { resolveNoOverlap } from '../../services/collisionService';
import './Workspace.css';

const SPAWN_W = 320;
const SPAWN_H = 220;

export default function Workspace() {
  const { workspace, createWorkspace, updateBlock, deleteBlock, currentPage, addBlock } =
    useWorkspaceStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) blockRefs.current.set(id, el);
    else blockRefs.current.delete(id);
  }, []);

  const getOtherRects = useCallback((excludeId: string) => {
    const blocks = useWorkspaceStore.getState().workspace?.blocks ?? [];
    return blocks
      .filter((b) => b.id !== excludeId)
      .map((b) => {
        const el = blockRefs.current.get(b.id);
        return { x: b.position.x, y: b.position.y, w: el?.offsetWidth ?? SPAWN_W, h: el?.offsetHeight ?? SPAWN_H };
      });
  }, []);

  const safeSpawnPos = useCallback(
    (nearX?: number, nearY?: number) => {
      const allRects = (useWorkspaceStore.getState().workspace?.blocks ?? []).map((b) => {
        const el = blockRefs.current.get(b.id);
        return { x: b.position.x, y: b.position.y, w: el?.offsetWidth ?? SPAWN_W, h: el?.offsetHeight ?? SPAWN_H };
      });
      return resolveNoOverlap({ x: nearX ?? 80, y: nearY ?? 80, w: SPAWN_W, h: SPAWN_H }, allRects);
    },
    []
  );

  if (!workspace) {
    createWorkspace('My Workspace');
    return null;
  }

  const handleAddBlock = useCallback(
    (type: string, nearX?: number, nearY?: number) => {
      const pos = safeSpawnPos(nearX, nearY);
      addBlock(type, pos);
    },
    [addBlock, safeSpawnPos]
  );

  // Called by DocumentBlock's "Ask" button — spawns a Chat block next to the doc
  const handleAskFromDoc = useCallback(
    (docBlock: BlockInstance) => {
      const el = blockRefs.current.get(docBlock.id);
      const nearX = docBlock.position.x + (el?.offsetWidth ?? SPAWN_W) + 20;
      const nearY = docBlock.position.y;
      const pos = safeSpawnPos(nearX, nearY);
      addBlock('chat', pos);
    },
    [addBlock, safeSpawnPos]
  );

  const handleFileDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (!files.length) return;

      const rect = canvasRef.current?.getBoundingClientRect();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const rawX = rect ? e.clientX - rect.left + i * 20 : 120 + i * 20;
        const rawY = rect ? e.clientY - rect.top  + i * 20 : 120 + i * 20;
        const pos = safeSpawnPos(rawX, rawY);
        const bt = BLOCK_TYPES['document'];
        const id = nanoid();
        const newBlock: BlockInstance = {
          id,
          type: 'document',
          version: bt.version,
          position: pos,
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
        } catch {
          useWorkspaceStore.setState((s) => ({
            workspace: s.workspace
              ? {
                  ...s.workspace,
                  blocks: s.workspace.blocks.map((b) =>
                    b.id === id
                      ? { ...b, config: { ...b.config, uploadError: 'Backend offline — file not indexed' } }
                      : b
                  ),
                }
              : s.workspace,
          }));
        }
      }
    },
    [safeSpawnPos]
  );

  return (
    <div className="workspace-root">
      <TopBar />

      {currentPage === 'community' && <CommunityPage />}
      {currentPage === 'settings'  && <SettingsPage />}

      {currentPage === 'workspace' && (
        <>
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
                <p className="empty-hint">Click "Add Block" below, or drag a file here</p>
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
                onAskFromDoc={handleAskFromDoc}
              />
            ))}
          </div>
          <AddBlockPanel onAdd={handleAddBlock} />
        </>
      )}
    </div>
  );
}
