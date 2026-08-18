import { create } from 'zustand';
import type { BlockInstance, Edge, Workspace } from '../models';
import { BLOCK_TYPES } from '../services/blockTypes';
import { nanoid } from 'nanoid';

interface WorkspaceState {
  workspace: Workspace | null;
  selectedBlockIds: string[];

  createWorkspace: (name: string) => void;
  addBlock: (type: string, position: { x: number; y: number }) => void;
  updateBlock: (id: string, updates: Partial<BlockInstance>) => void;
  deleteBlock: (id: string) => void;
  addEdge: (edge: Omit<Edge, 'id' | 'createdAt' | 'status'>) => void;
  deleteEdge: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspace: null,
  selectedBlockIds: [],

  createWorkspace: (name) => {
    set({
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
    const { workspace } = get();
    if (!workspace) return;
    const blockType = BLOCK_TYPES[type];
    if (!blockType) return;

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
      workspace: {
        ...workspace,
        blocks: [...workspace.blocks, newBlock],
        updatedAt: new Date().toISOString(),
      },
    });
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
    const { workspace } = get();
    if (!workspace) return;
    set({
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
    const { workspace } = get();
    if (!workspace) return;
    const newEdge: Edge = {
      ...edge,
      id: nanoid(),
      status: 'valid',
      createdAt: new Date().toISOString(),
    };
    set({
      workspace: {
        ...workspace,
        edges: [...workspace.edges, newEdge],
        updatedAt: new Date().toISOString(),
      },
    });
  },

  deleteEdge: (id) => {
    const { workspace } = get();
    if (!workspace) return;
    set({
      workspace: {
        ...workspace,
        edges: workspace.edges.filter((e) => e.id !== id),
        updatedAt: new Date().toISOString(),
      },
    });
  },
}));
