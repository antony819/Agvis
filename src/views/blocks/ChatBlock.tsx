import { useState } from 'react';
import type { BlockInstance } from '../../models';

interface Props {
  block: BlockInstance;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function ChatBlock({ block }: Props) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Simulated response. Connect a real LLM to enable AI.' },
      ]);
    }, 500);
  };

  return (
    <div className="chat-block">
      <p className="block-label">{block.name}</p>
      <div className="chat-messages">
        {messages.length === 0 && <p className="chat-empty">Start a conversation…</p>}
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <span className="chat-msg-avatar">{m.role === 'user' ? '👤' : '🤖'}</span>
            <span className="chat-msg-text">{m.content}</span>
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message…"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
