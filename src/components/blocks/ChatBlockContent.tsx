import { useState } from 'react';
import type { BlockInstance } from '../../types';

interface Props {
  block: BlockInstance;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function ChatBlockContent({ }: Props) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'This is a simulated response. Connect a real LLM to enable AI chat.',
        },
      ]);
    }, 500);
  };

  return (
    <div className="chat-block-content">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            Start a conversation...
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            <div className="chat-message-role">
              {msg.role === 'user' ? '👤' : '🤖'}
            </div>
            <div className="chat-message-content">{msg.content}</div>
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>

      <style>{`
        .chat-block-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          min-height: 300px;
        }

        .chat-messages {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .chat-empty {
          text-align: center;
          color: var(--text);
          opacity: 0.5;
          padding: 2rem;
          font-style: italic;
        }

        .chat-message {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .chat-message-role {
          font-size: 20px;
          flex-shrink: 0;
        }

        .chat-message-content {
          flex: 1;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.5;
        }

        .chat-message.user .chat-message-content {
          background: var(--accent-bg);
          color: var(--text-h);
        }

        .chat-message.assistant .chat-message-content {
          background: var(--bg-secondary);
          color: var(--text);
        }

        .chat-input {
          display: flex;
          gap: 0.5rem;
        }

        .chat-input input {
          flex: 1;
          padding: 0.625rem 0.875rem;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
        }

        .chat-input button {
          padding: 0.625rem 1.25rem;
          background: var(--accent);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
        }

        .chat-input button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  );
}
