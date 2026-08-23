import { create } from 'zustand';
import type { BlockInstance, Edge, Workspace } from '../models';
import { BLOCK_TYPES } from '../services/blockTypes';
import { nanoid } from 'nanoid';

export type AppPage = 'workspace' | 'community' | 'settings';

interface WorkspaceState {
  workspace: Workspace | null;
  selectedBlockIds: string[];
  currentPage: AppPage;

  // Undo / redo stacks (store full workspace snapshots)
  past: Workspace[];
  future: Workspace[];

  setPage: (page: AppPage) => void;
  createWorkspace: (name: string) => void;
  addBlock: (type: string, position: { x: number; y: number }) => BlockInstance | null;
  updateBlock: (id: string, updates: Partial<BlockInstance>) => void;
  deleteBlock: (id: string) => void;
  addEdge: (edge: Omit<Edge, 'id' | 'createdAt' | 'status'>) => void;
  deleteEdge: (id: string) => void;
  undo: () => void;
  redo: () => void;
}

function snapshot(ws: Workspace): Workspace {
  return JSON.parse(JSON.stringify(ws));
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspace: null,
  selectedBlockIds: [],
  currentPage: 'workspace',
  past: [],
  future: [],

  setPage: (page) => set({ currentPage: page }),

  createWorkspace: (name) => {
    set({
      past: [],
      future: [],
      workspace: {
        id: nanoid(),
        name,
        blocks: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  addBlock: (type, position) => {
    const { workspace, past } = get();
    if (!workspace) return null;
    const blockType = BLOCK_TYPES[type];
    if (!blockType) return null;

    const newBlock: BlockInstance = {
      id: nanoid(),
      type,
      version: blockType.version,
      position,
      name: `${blockType.name} ${workspace.blocks.length + 1}`,
      config: { ...blockType.defaultConfig },
      selected: false,
      automationMode: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set({
      past: [...past, snapshot(workspace)],
      future: [],
      workspace: {
        ...workspace,
        blocks: [...workspace.blocks, newBlock],
        updatedAt: new Date().toISOString(),
      },
    });
    return newBlock;
  },

  updateBlock: (id, updates) => {
    const { workspace } = get();
    if (!workspace) return;
    set({
      workspace: {
        ...workspace,
        blocks: workspace.blocks.map((b) =>
          b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
        ),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  deleteBlock: (id) => {
    const { workspace, past } = get();
    if (!workspace) return;
    set({
      past: [...past, snapshot(workspace)],
      future: [],
      workspace: {
        ...workspace,
        blocks: workspace.blocks.filter((b) => b.id !== id),
        edges: workspace.edges.filter(
          (e) => e.source.blockId !== id && e.target.blockId !== id
        ),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  addEdge: (edge) => {
    const { workspace, past } = get();
    if (!workspace) return;
    const newEdge: Edge = {
      ...edge, id: nanoid(), status: 'valid', createdAt: new Date().toISOString(),
    };
    set({
      past: [...past, snapshot(workspace)],
      future: [],
      workspace: { ...workspace, edges: [...workspace.edges, newEdge], updatedAt: new Date().toISOString() },
    });
  },

  deleteEdge: (id) => {
    const { workspace, past } = get();
    if (!workspace) return;
    set({
      past: [...past, snapshot(workspace)],
      future: [],
      workspace: {
        ...workspace,
        edges: workspace.edges.filter((e) => e.id !== id),
        updatedAt: new Date().toISOString(),
      },
    });
  },

  undo: () => {
    const { workspace, past, future } = get();
    if (!past.length || !workspace) return;
    const prev = past[past.length - 1];
    set({
      past: past.slice(0, -1),
      future: [snapshot(workspace), ...future],
      workspace: prev,
    });
  },

  redo: () => {
    const { workspace, past, future } = get();
    if (!future.length || !workspace) return;
    const next = future[0];
    set({
      past: [...past, snapshot(workspace)],
      future: future.slice(1),
      workspace: next,
    });
  },
}));
