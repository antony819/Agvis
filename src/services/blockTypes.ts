import type { BlockTypeDefinition } from '../models';
import { PortDataType } from '../models';

// Chat Block Definition
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

// Document Block Definition
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
      filename: {
        type: 'string',
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

// Knowledge Block Definition
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

// Note Block Definition
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

// Composer Block Definition
export const ComposerBlockType: BlockTypeDefinition = {
  type: 'composer',
  version: '1.0.0',
  name: 'Composer',
  icon: '✍️',
  description: 'Workspace command input',
  category: 'chat',
  inputs: [],
  outputs: [
    {
      id: 'message',
      name: 'Message',
      type: PortDataType.TEXT,
      required: true,
      description: 'Last message sent',
    },
  ],
  configSchema: {
    type: 'object',
    properties: {
      history: {
        type: 'array',
        default: [],
      },
      lastMessage: {
        type: 'string',
        default: '',
      },
    },
  },
  defaultConfig: {
    history: [],
    lastMessage: '',
  },
  hasWidgetMode: true,
  hasAutomationMode: false,
};

// Registry of all block types
export const BLOCK_TYPES: Record<string, BlockTypeDefinition> = {
  chat: ChatBlockType,
  document: DocumentBlockType,
  knowledge: KnowledgeBlockType,
  note: NoteBlockType,
  composer: ComposerBlockType,
};

export function getBlockType(type: string): BlockTypeDefinition | undefined {
  return BLOCK_TYPES[type];
}
