import { create } from 'zustand';
import type { BlockInstance, Edge, Workspace } from '../types';
import { BLOCK_TYPES } from '../lib/blockTypes';
import { nanoid } from 'nanoid';

interface WorkspaceState {
  // Current workspace
  workspace: Workspace | null;
  
  // UI state
  selectedBlockIds: string[];
  showBlockLibrary: boolean;
  showInspector: boolean;
  
  // Actions
  createWorkspace: (name: string) => void;
  
  // Block actions
  addBlock: (type: string, position: { x: number; y: number }) => void;
  updateBlock: (id: string, updates: Partial<BlockInstance>) => void;
  deleteBlock: (id: string) => void;
  selectBlock: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  
  // Edge actions
  addEdge: (edge: Omit<Edge, 'id' | 'createdAt' | 'status'>) => void;
  deleteEdge: (id: string) => void;
  
  // UI actions
  toggleBlockLibrary: () => void;
  setShowInspector: (show: boolean) => void;
  
  // Viewport
  updateViewport: (viewport: { x: number; y: number; zoom: number }) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  workspace: null,
  selectedBlockIds: [],
  showBlockLibrary: true,
  showInspector: false,
  
  createWorkspace: (name: string) => {
    const workspace: Workspace = {
      id: nanoid(),
      name,
      description: '',
      blocks: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set({ workspace });
  },
  
  addBlock: (type: string, position: { x: number; y: number }) => {
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
  
  updateBlock: (id: string, updates: Partial<BlockInstance>) => {
    const { workspace } = get();
    if (!workspace) return;
    
    set({
      workspace: {
        ...workspace,
        blocks: workspace.blocks.map((block) =>
          block.id === id
            ? { ...block, ...updates, updatedAt: new Date().toISOString() }
            : block
        ),
        updatedAt: new Date().toISOString(),
      },
    });
  },
  
  deleteBlock: (id: string) => {
    const { workspace } = get();
    if (!workspace) return;
    
    set({
      workspace: {
        ...workspace,
        blocks: workspace.blocks.filter((block) => block.id !== id),
        edges: workspace.edges.filter(
          (edge) => edge.source.blockId !== id && edge.target.blockId !== id
        ),
        updatedAt: new Date().toISOString(),
      },
      selectedBlockIds: get().selectedBlockIds.filter((selectedId) => selectedId !== id),
    });
  },
  
  selectBlock: (id: string, multi = false) => {
    const { selectedBlockIds } = get();
    
    if (multi) {
      const newSelection = selectedBlockIds.includes(id)
        ? selectedBlockIds.filter((selectedId) => selectedId !== id)
        : [...selectedBlockIds, id];
      set({ selectedBlockIds: newSelection, showInspector: newSelection.length > 0 });
    } else {
      set({ selectedBlockIds: [id], showInspector: true });
    }
  },
  
  clearSelection: () => {
    set({ selectedBlockIds: [], showInspector: false });
  },
  
  addEdge: (edge: Omit<Edge, 'id' | 'createdAt' | 'status'>) => {
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
  
  deleteEdge: (id: string) => {
    const { workspace } = get();
    if (!workspace) return;
    
    set({
      workspace: {
        ...workspace,
        edges: workspace.edges.filter((edge) => edge.id !== id),
        updatedAt: new Date().toISOString(),
      },
    });
  },
  
  toggleBlockLibrary: () => {
    set((state) => ({ showBlockLibrary: !state.showBlockLibrary }));
  },
  
  setShowInspector: (show: boolean) => {
    set({ showInspector: show });
  },
  
  updateViewport: (viewport: { x: number; y: number; zoom: number }) => {
    const { workspace } = get();
    if (!workspace) return;
    
    set({
      workspace: {
        ...workspace,
        viewport,
      },
    });
  },
}));
