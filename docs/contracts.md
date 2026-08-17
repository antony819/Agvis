# Data Contracts

## Core Type System

### Port Types

```typescript
// Port data types that can flow between blocks
export enum PortDataType {
  TEXT = 'text',
  DOCUMENT = 'document',
  KNOWLEDGE_CONTEXT = 'knowledge_context',
  CONVERSATION = 'conversation',
  OBJECT = 'object',
  ARRAY = 'array',
}

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
```

### Block Schema (Versioned)

```typescript
// Block type definition
export interface BlockTypeDefinition {
  type: string; // e.g., 'chat', 'document', 'knowledge'
  version: string; // Semantic versioning
  name: string;
  icon: string;
  description: string;
  category: 'chat' | 'document' | 'knowledge' | 'note' | 'output' | 'group';
  
  // Port definitions
  inputs: PortDefinition[];
  outputs: PortDefinition[];
  
  // Configuration schema (JSON Schema)
  configSchema: Record<string, any>;
  
  // Default configuration
  defaultConfig: Record<string, any>;
  
  // Widget capabilities
  hasWidgetMode: boolean;
  hasAutomationMode: boolean;
}
```

### Block Instance

```typescript
export interface BlockInstance {
  id: string; // UUID
  type: string;
  version: string;
  
  // Position on canvas
  position: {
    x: number;
    y: number;
  };
  
  // Size (for resizable blocks)
  size?: {
    width: number;
    height: number;
  };
  
  // User-provided name
  name: string;
  
  // Block configuration (validated against configSchema)
  config: Record<string, any>;
  
  // UI state
  selected: boolean;
  automationMode: boolean;
  
  // Metadata
  createdAt: string; // ISO 8601
  updatedAt: string;
}
```

### Edge (Connection)

```typescript
export interface Edge {
  id: string; // UUID
  
  // Source block and port
  source: PortInstance;
  
  // Target block and port
  target: PortInstance;
  
  // Connection state
  status: 'valid' | 'type_mismatch' | 'circular_dependency';
  
  // Metadata
  createdAt: string;
}
```

### Workspace

```typescript
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  
  // All blocks in this workspace
  blocks: BlockInstance[];
  
  // All connections
  edges: Edge[];
  
  // Viewport state
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  lastOpenedAt?: string;
}
```

## Built-in Block Types

### Chat Block

```typescript
export const ChatBlockType: BlockTypeDefinition = {
  type: 'chat',
  version: '1.0.0',
  name: 'Chat',
  icon: '💬',
  description: 'AI conversation with optional context',
  category: 'chat',
  
  inputs: [
    {
      id: 'context',
      name: 'Context',
      type: PortDataType.KNOWLEDGE_CONTEXT,
      required: false,
      description: 'Knowledge base to query',
    },
  ],
  
  outputs: [
    {
      id: 'response',
      name: 'Response',
      type: PortDataType.TEXT,
      required: false,
      description: 'Last AI response',
    },
  ],
  
  configSchema: {
    type: 'object',
    properties: {
      model: {
        type: 'string',
        enum: ['gpt-4', 'gpt-3.5-turbo', 'claude-3-opus'],
        default: 'gpt-4',
      },
      systemPrompt: {
        type: 'string',
        default: '',
      },
      temperature: {
        type: 'number',
        minimum: 0,
        maximum: 2,
        default: 0.7,
      },
    },
  },
  
  defaultConfig: {
    model: 'gpt-4',
    systemPrompt: '',
    temperature: 0.7,
  },
  
  hasWidgetMode: true,
  hasAutomationMode: true,
};
```

### Document Block

```typescript
export const DocumentBlockType: BlockTypeDefinition = {
  type: 'document',
  version: '1.0.0',
  name: 'Document',
  icon: '📄',
  description: 'Upload and parse documents',
  category: 'document',
  
  inputs: [],
  
  outputs: [
    {
      id: 'content',
      name: 'Content',
      type: PortDataType.DOCUMENT,
      required: true,
      description: 'Parsed document content',
    },
    {
      id: 'metadata',
      name: 'Metadata',
      type: PortDataType.OBJECT,
      required: true,
      description: 'Document metadata',
    },
  ],
  
  configSchema: {
    type: 'object',
    properties: {
      fileId: {
        type: 'string',
        description: 'Reference to uploaded file',
      },
      parsingStatus: {
        type: 'string',
        enum: ['pending', 'parsing', 'parsed', 'failed'],
        default: 'pending',
      },
      indexingStatus: {
        type: 'string',
        enum: ['pending', 'indexing', 'indexed', 'failed'],
        default: 'pending',
      },
    },
    required: ['fileId'],
  },
  
  defaultConfig: {
    parsingStatus: 'pending',
    indexingStatus: 'pending',
  },
  
  hasWidgetMode: true,
  hasAutomationMode: true,
};
```

### Knowledge Block

```typescript
export const KnowledgeBlockType: BlockTypeDefinition = {
  type: 'knowledge',
  version: '1.0.0',
  name: 'Knowledge',
  icon: '📚',
  description: 'Multi-document collection with retrieval',
  category: 'knowledge',
  
  inputs: [
    {
      id: 'documents',
      name: 'Documents',
      type: PortDataType.ARRAY,
      required: false,
      description: 'Documents to add to collection',
    },
  ],
  
  outputs: [
    {
      id: 'context',
      name: 'Context',
      type: PortDataType.KNOWLEDGE_CONTEXT,
      required: true,
      description: 'Queryable knowledge context',
    },
  ],
  
  configSchema: {
    type: 'object',
    properties: {
      embeddingModel: {
        type: 'string',
        default: 'text-embedding-3-small',
      },
      chunkSize: {
        type: 'number',
        default: 512,
        minimum: 100,
        maximum: 2000,
      },
      chunkOverlap: {
        type: 'number',
        default: 50,
        minimum: 0,
        maximum: 500,
      },
      topK: {
        type: 'number',
        default: 5,
        minimum: 1,
        maximum: 20,
      },
    },
  },
  
  defaultConfig: {
    embeddingModel: 'text-embedding-3-small',
    chunkSize: 512,
    chunkOverlap: 50,
    topK: 5,
  },
  
  hasWidgetMode: true,
  hasAutomationMode: true,
};
```

### Note Block

```typescript
export const NoteBlockType: BlockTypeDefinition = {
  type: 'note',
  version: '1.0.0',
  name: 'Note',
  icon: '📝',
  description: 'Markdown note editor',
  category: 'note',
  
  inputs: [
    {
      id: 'input',
      name: 'Input',
      type: PortDataType.TEXT,
      required: false,
      description: 'Text to append',
    },
  ],
  
  outputs: [
    {
      id: 'content',
      name: 'Content',
      type: PortDataType.TEXT,
      required: true,
      description: 'Note content',
    },
  ],
  
  configSchema: {
    type: 'object',
    properties: {
      content: {
        type: 'string',
        default: '',
      },
    },
  },
  
  defaultConfig: {
    content: '',
  },
  
  hasWidgetMode: true,
  hasAutomationMode: true,
};
```

## Pack Manifest

```typescript
export interface PackManifest {
  // Identity
  id: string; // UUID
  name: string;
  version: string; // Semantic versioning
  description: string;
  author: string;
  license: string;
  
  // Requirements
  minAppVersion: string;
  
  // Preview
  previewImage?: string; // Base64 or URL
  
  // Contents
  blocks: BlockInstance[];
  edges: Edge[];
  
  // Layout information
  layout: {
    viewport: {
      x: number;
      y: number;
      zoom: number;
    };
  };
  
  // Dependencies (external services)
  dependencies: {
    aiModels?: string[]; // e.g., ['gpt-4', 'text-embedding-3-small']
    apis?: string[]; // e.g., ['openai', 'anthropic']
  };
  
  // Required permissions
  permissions: {
    readFiles?: boolean;
    writeFiles?: boolean;
    networkAccess?: boolean;
    executeCode?: boolean;
  };
  
  // Configuration requirements (user must provide)
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
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  installs?: number;
  rating?: number;
}
```

## API Contracts (Backend)

### Document Upload

```typescript
// POST /api/documents/upload
interface UploadDocumentRequest {
  file: File;
  workspaceId: string;
}

interface UploadDocumentResponse {
  documentId: string;
  filename: string;
  size: number;
  mimeType: string;
  status: 'uploaded' | 'parsing' | 'parsed' | 'failed';
}
```

### Document Processing Status

```typescript
// GET /api/documents/{documentId}/status
interface DocumentStatusResponse {
  documentId: string;
  parsingStatus: 'pending' | 'parsing' | 'parsed' | 'failed';
  indexingStatus: 'pending' | 'indexing' | 'indexed' | 'failed';
  chunks?: number;
  error?: string;
}
```

### Chat Completion (Streaming)

```typescript
// POST /api/chat/completion (SSE)
interface ChatCompletionRequest {
  messages: {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }[];
  model: string;
  temperature?: number;
  contextBlockId?: string; // Optional knowledge block
}

// SSE events
interface ChatCompletionChunk {
  type: 'token' | 'citation' | 'done' | 'error';
  content?: string;
  citation?: {
    documentId: string;
    chunkId: string;
    page?: number;
    text: string;
  };
  error?: string;
}
```

### Pack Catalog

```typescript
// GET /api/packs
interface PackListResponse {
  packs: {
    id: string;
    name: string;
    description: string;
    author: string;
    version: string;
    installs: number;
    rating: number;
    previewImage?: string;
  }[];
  total: number;
}

// GET /api/packs/{packId}
interface PackDetailResponse {
  manifest: PackManifest;
  reviews?: {
    rating: number;
    comment: string;
    author: string;
    createdAt: string;
  }[];
}
```

## Validation Rules

1. **Port Type Compatibility**
   - `DOCUMENT` → `ARRAY` (single document to array)
   - `KNOWLEDGE_CONTEXT` → `KNOWLEDGE_CONTEXT` (pass-through)
   - `TEXT` → `TEXT` (pass-through)
   - No implicit conversions between incompatible types

2. **Circular Dependency Detection**
   - Must detect and prevent circular connections
   - Show error when attempting to create cycle

3. **Version Compatibility**
   - Block instance must match available block type version
   - Pack must specify minimum app version
   - Show migration prompt if version mismatch

4. **Configuration Validation**
   - All block configs must validate against their JSON Schema
   - Required fields must be present
   - Type constraints must be enforced
