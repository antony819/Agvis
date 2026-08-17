// Core type definitions for Agvis

// Port data types that can flow between blocks
export const PortDataType = {
  TEXT: 'text',
  DOCUMENT: 'document',
  KNOWLEDGE_CONTEXT: 'knowledge_context',
  CONVERSATION: 'conversation',
  OBJECT: 'object',
  ARRAY: 'array',
} as const;

export type PortDataType = (typeof PortDataType)[keyof typeof PortDataType];

// Port definition
export interface PortDefinition {
  id: string;
  name: string;
  type: PortDataType;
  required: boolean;
  description?: string;
}

// Port instance with connection state
export interface PortInstance {
  blockId: string;
  portId: string;
  direction: 'input' | 'output';
}

// Block type definition
export interface BlockTypeDefinition {
  type: string;
  version: string;
  name: string;
  icon: string;
  description: string;
  category: 'chat' | 'document' | 'knowledge' | 'note' | 'output' | 'group';
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  configSchema: Record<string, any>;
  defaultConfig: Record<string, any>;
  hasWidgetMode: boolean;
  hasAutomationMode: boolean;
}

// Block instance
export interface BlockInstance {
  id: string;
  type: string;
  version: string;
  position: {
    x: number;
    y: number;
  };
  size?: {
    width: number;
    height: number;
  };
  name: string;
  config: Record<string, any>;
  selected: boolean;
  automationMode: boolean;
  createdAt: string;
  updatedAt: string;
}

// Edge (Connection)
export interface Edge {
  id: string;
  source: PortInstance;
  target: PortInstance;
  status: 'valid' | 'type_mismatch' | 'circular_dependency';
  createdAt: string;
}

// Workspace
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  blocks: BlockInstance[];
  edges: Edge[];
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
}

// Pack Manifest
export interface PackManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  license: string;
  minAppVersion: string;
  previewImage?: string;
  blocks: BlockInstance[];
  edges: Edge[];
  layout: {
    viewport: {
      x: number;
      y: number;
      zoom: number;
    };
  };
  dependencies: {
    aiModels?: string[];
    apis?: string[];
  };
  permissions: {
    readFiles?: boolean;
    writeFiles?: boolean;
    networkAccess?: boolean;
    executeCode?: boolean;
  };
  configRequirements: {
    apiKeys?: {
      provider: string;
      description: string;
    }[];
    placeholders?: {
      blockId: string;
      type: string;
      description: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
  installs?: number;
  rating?: number;
}
