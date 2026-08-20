import { create } from 'zustand';

interface SettingsState {
  apiKey: string;
  model: string;
  embeddingModel: string;
  chunkSize: number;
  chunkOverlap: number;
  setApiKey: (key: string) => void;
  setModel: (model: string) => void;
  setEmbeddingModel: (model: string) => void;
  setChunkSize: (size: number) => void;
  setChunkOverlap: (overlap: number) => void;
  loadFromStorage: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  apiKey: '',
  model: 'gpt-4o',
  embeddingModel: 'text-embedding-3-small',
  chunkSize: 512,
  chunkOverlap: 50,
  
  setApiKey: (key: string) => {
    localStorage.setItem('agvis_api_key', key);
    set({ apiKey: key });
  },
  
  setModel: (model: string) => {
    localStorage.setItem('agvis_model', model);
    set({ model });
  },
  
  setEmbeddingModel: (model: string) => {
    localStorage.setItem('agvis_embedding_model', model);
    set({ embeddingModel: model });
  },
  
  setChunkSize: (size: number) => {
    localStorage.setItem('agvis_chunk_size', size.toString());
    set({ chunkSize: size });
  },
  
  setChunkOverlap: (overlap: number) => {
    localStorage.setItem('agvis_chunk_overlap', overlap.toString());
    set({ chunkOverlap: overlap });
  },
  
  loadFromStorage: () => {
    const apiKey = localStorage.getItem('agvis_api_key') || '';
    const model = localStorage.getItem('agvis_model') || 'gpt-4o';
    const embeddingModel = localStorage.getItem('agvis_embedding_model') || 'text-embedding-3-small';
    const chunkSize = parseInt(localStorage.getItem('agvis_chunk_size') || '512');
    const chunkOverlap = parseInt(localStorage.getItem('agvis_chunk_overlap') || '50');
    
    set({ apiKey, model, embeddingModel, chunkSize, chunkOverlap });
  },
}));
