import { useState } from 'react';
import './AIComposer.css';

export default function AIComposer() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    console.log('Send message:', message);
    setMessage('');
  };

  return (
    <div className="ai-composer">
      <form onSubmit={handleSubmit} className="composer-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="💬 Ask anything or @mention blocks..."
          className="composer-input"
        />
        <button type="submit" className="composer-send">
          Send
        </button>
      </form>
    </div>
  );
}
