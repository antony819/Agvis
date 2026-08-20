import { useState, useRef } from 'react';
import type { BlockInstance } from '../../models';

interface Props {
  block: BlockInstance;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function ComposerBlock({ block, onUpdate }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    
    const history = (block.config.history || []) as { role: string; content: string }[];
    const updated = [...history, { role: 'user', content: trimmed }];
    
    onUpdate(block.id, {
      config: { ...block.config, history: updated, lastMessage: trimmed },
    });
    
    setValue('');
  };

  const history = (block.config.history || []) as { role: string; content: string }[];

  return (
    <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '400px' }}>
      <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: 'var(--text-h)' }}>{block.name}</p>
      
      {history.length > 0 && (
        <div style={{ 
          maxHeight: '200px', 
          overflow: 'auto', 
          background: 'var(--bg-secondary)', 
          borderRadius: '8px', 
          padding: '0.75rem',
          fontSize: '13px',
          lineHeight: '1.5',
        }}>
          {history.map((msg, i) => (
            <div key={i} style={{ marginBottom: '0.5rem', color: msg.role === 'user' ? 'var(--accent)' : 'var(--text)' }}>
              <strong>{msg.role}:</strong> {msg.content}
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="💬 Ask anything or @mention a block…"
          style={{
            flex: 1,
            padding: '0.625rem 1rem',
            border: '1px solid var(--border)',
            borderRadius: '999px',
            fontSize: '14px',
            background: 'var(--bg-secondary)',
            color: 'var(--text)',
          }}
        />
        <button 
          type="submit" 
          disabled={!value.trim()}
          style={{
            padding: '0.625rem 1.25rem',
            background: value.trim() ? 'var(--accent)' : 'var(--bg-secondary)',
            color: 'white',
            border: 'none',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: value.trim() ? 'pointer' : 'default',
            opacity: value.trim() ? 1 : 0.4,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
