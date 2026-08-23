import { useCallback, useRef, useState } from 'react';
import { nanoid } from 'nanoid';
import { useWorkspaceStore } from '../../viewmodels/workspaceViewModel';
import Block from '../ui/Block';
import AddBlockPanel from '../ui/AddBlockPanel';
import TopBar from '../ui/TopBar';
import Inspector from '../ui/Inspector';
import PackExportDialog from '../ui/PackExportDialog';
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
  const { workspace, createWorkspace, updateBlock, deleteBlock, addBlock, currentPage } =
    useWorkspaceStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const [selectedId, setSelectedId]       = useState<string | null>(null);
  const [showExport, setShowExport]       = useState(false);

  const selectedBlock = workspace?.blocks.find((b) => b.id === selectedId) ?? null;

  // ── Ref registry ────────────────────────────────────────
  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) blockRefs.current.set(id, el);
    else    blockRefs.current.delete(id);
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

  const safeSpawnPos = useCallback((nearX = 80, nearY = 80) => {
    const allRects = (useWorkspaceStore.getState().workspace?.blocks ?? []).map((b) => {
      const el = blockRefs.current.get(b.id);
      return { x: b.position.x, y: b.position.y, w: el?.offsetWidth ?? SPAWN_W, h: el?.offsetHeight ?? SPAWN_H };
    });
    return resolveNoOverlap({ x: nearX, y: nearY, w: SPAWN_W, h: SPAWN_H }, allRects);
  }, []);

  // ── Block actions ────────────────────────────────────────
  const handleAddBlock = useCallback(
    (type: string, nearX?: number, nearY?: number) => {
      const pos = safeSpawnPos(nearX, nearY);
      addBlock(type, pos);
    },
    [addBlock, safeSpawnPos]
  );

  const handleDuplicate = useCallback(
    (block: BlockInstance) => {
      const el = blockRefs.current.get(block.id);
      const pos = safeSpawnPos(
        block.position.x + (el?.offsetWidth ?? SPAWN_W) + 20,
        block.position.y,
      );
      const copy: BlockInstance = {
        ...block,
        id: nanoid(),
        name: `${block.name} (copy)`,
        position: pos,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      useWorkspaceStore.setState((s) => ({
        workspace: s.workspace
          ? { ...s.workspace, blocks: [...s.workspace.blocks, copy] }
          : s.workspace,
      }));
    },
    [safeSpawnPos]
  );

  const handleAskFromDoc = useCallback(
    (docBlock: BlockInstance) => {
      const el = blockRefs.current.get(docBlock.id);
      handleAddBlock('chat', docBlock.position.x + (el?.offsetWidth ?? SPAWN_W) + 20, docBlock.position.y);
    },
    [handleAddBlock]
  );

  // ── File drop ────────────────────────────────────────────
  const handleFileDrop = useCallback(
    async (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (!files.length) return;
      const rect = canvasRef.current?.getBoundingClientRect();

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const rawX = (rect ? e.clientX - rect.left : 120) + i * 20;
        const rawY = (rect ? e.clientY - rect.top  : 120) + i * 20;
        const pos  = safeSpawnPos(rawX, rawY);
        const bt   = BLOCK_TYPES['document'];
        const id   = nanoid();

        const newBlock: BlockInstance = {
          id, type: 'document', version: bt.version, position: pos,
          name: file.name,
          config: { ...bt.defaultConfig, filename: file.name },
          selected: false, automationMode: false,
          createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
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
              ? { ...s.workspace, blocks: s.workspace.blocks.map((b) =>
                  b.id === id ? { ...b, config: { ...b.config, fileId: result.documentId } } : b) }
              : s.workspace,
          }));
        } catch {
          useWorkspaceStore.setState((s) => ({
            workspace: s.workspace
              ? { ...s.workspace, blocks: s.workspace.blocks.map((b) =>
                  b.id === id
                    ? { ...b, config: { ...b.config, uploadError: 'Backend offline — file not indexed' } }
                    : b) }
              : s.workspace,
          }));
        }
      }
    },
    [safeSpawnPos]
  );

  // ── Init ─────────────────────────────────────────────────
  if (!workspace) {
    createWorkspace('My Workspace');
    return null;
  }

  return (
    <div className="workspace-root">
      <TopBar onExport={() => setShowExport(true)} />

      {currentPage === 'community' && <CommunityPage />}
      {currentPage === 'settings'  && <SettingsPage />}

      {currentPage === 'workspace' && (
        <>
          <div className="workspace-body">
            <div
              className="workspace-canvas"
              ref={canvasRef}
              onDrop={handleFileDrop}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}
              onClick={(e) => {
                if (e.target === canvasRef.current) setSelectedId(null);
              }}
            >
              {workspace.blocks.length === 0 && (
                <div className="workspace-empty">
                  <div className="empty-icon">✦</div>
                  <p className="empty-title">Your workspace is empty</p>
                  <p className="empty-hint">Click "Add Block" below, or drag a file here</p>
                </div>
              )}
              {workspace.blocks.map((block) => (
                <div key={block.id} onClick={() => setSelectedId(block.id)}>
                  <Block
                    block={block}
                    onRemove={(id) => { deleteBlock(id); if (selectedId === id) setSelectedId(null); }}
                    onUpdate={updateBlock}
                    onDuplicate={handleDuplicate}
                    registerRef={registerRef}
                    getOtherRects={getOtherRects}
                    onAskFromDoc={handleAskFromDoc}
                  />
                </div>
              ))}
            </div>

            {selectedBlock && (
              <Inspector
                block={selectedBlock}
                onUpdate={updateBlock}
                onClose={() => setSelectedId(null)}
              />
            )}
          </div>

          <AddBlockPanel onAdd={handleAddBlock} />
        </>
      )}

      {showExport && workspace.blocks.length > 0 && (
        <PackExportDialog
          blocks={workspace.blocks}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  );
}
