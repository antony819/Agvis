import { useState, useRef } from 'react';
import './AIComposer.css';

interface Props {
  onSend: (message: string) => void;
}

export default function AIComposer({ onSend }: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
  };

  return (
    <div className="ai-composer">
      <form onSubmit={handleSubmit} className="composer-form">
        <input
          ref={inputRef}
          className="composer-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="💬 Ask anything about your workspace, or @mention a block…"
        />
        <button type="submit" className="composer-send" disabled={!value.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
