const API_BASE = 'http://localhost:8000';

export async function testApiConnection(apiKey: string): Promise<void> {
  const response = await fetch(`${API_BASE}/api/test-connection`, {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to connect');
  }
}

export interface UploadDocumentResponse {
  documentId: string;
  filename: string;
  size: number;
  mimeType: string;
  status: string;
}

export interface DocumentStatusResponse {
  documentId: string;
  parsingStatus: 'pending' | 'parsing' | 'parsed' | 'failed';
  indexingStatus: 'pending' | 'indexing' | 'indexed' | 'failed';
  chunks?: number;
  error?: string;
}

export async function uploadDocument(file: File): Promise<UploadDocumentResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE}/api/documents/upload`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('Failed to upload document');
  }
  
  return response.json();
}

export async function getDocumentStatus(documentId: string): Promise<DocumentStatusResponse> {
  const response = await fetch(`${API_BASE}/api/documents/${documentId}/status`);
  
  if (!response.ok) {
    throw new Error('Failed to get document status');
  }
  
  return response.json();
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  messages: ChatMessage[];
  model: string;
  temperature?: number;
  contextBlockId?: string;
}

export async function* streamChatCompletion(
  request: ChatCompletionRequest,
  apiKey: string
): AsyncGenerator<{ type: string; content?: string; error?: string }> {
  const response = await fetch(`${API_BASE}/api/chat/completion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) {
    throw new Error('Failed to start chat completion');
  }
  
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }
  
  const decoder = new TextDecoder();
  let buffer = '';
  
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');
    buffer = lines.pop() || '';
    
    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        yield data;
      }
    }
  }
}

export interface Pack {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  installs: number;
  rating: number;
}

export async function listPacks(): Promise<{ packs: Pack[]; total: number }> {
  const response = await fetch(`${API_BASE}/api/packs`);
  
  if (!response.ok) {
    throw new Error('Failed to list packs');
  }
  
  return response.json();
}
