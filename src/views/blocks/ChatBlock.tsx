import { useRef, useState } from 'react';
import type { BlockInstance } from '../../models';
import { streamChatCompletion } from '../../services/api';
import { useSettingsStore } from '../../services/settingsStore';

interface Citation {
  documentId: string;
  chunkId: string;
  page?: number;
  text: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  streaming?: boolean;
}

interface Props {
  block: BlockInstance;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
}

export default function ChatBlock({ block }: Props) {
  const { apiKey, model } = useSettingsStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    if (!apiKey) {
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: '⚠ No API key configured. Please set your OpenAI API key in Settings.' },
      ]);
      setInput('');
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Add empty assistant message to stream into
    const assistantIdx = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { role: 'assistant', content: '', streaming: true },
    ]);

    try {
      const apiMessages = [
        ...messages,
        userMessage,
      ].map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const stream = streamChatCompletion(
        {
          messages: apiMessages,
          model: model,
          temperature: block.config.temperature ?? 0.7,
          contextBlockId: block.config.contextBlockId,
        },
        apiKey
      );

      let accumulated = '';
      const citations: Citation[] = [];

      for await (const chunk of stream) {
        if (chunk.type === 'token' && chunk.content) {
          accumulated += chunk.content;
          setMessages((prev) =>
            prev.map((m, i) =>
              i === assistantIdx ? { ...m, content: accumulated, streaming: true } : m
            )
          );
          scrollToBottom();
        } else if (chunk.type === 'citation' && chunk.content) {
          try {
            const citation = JSON.parse(chunk.content) as Citation;
            citations.push(citation);
          } catch { /* ignore malformed citation */ }
        } else if (chunk.type === 'done') {
          setMessages((prev) =>
            prev.map((m, i) =>
              i === assistantIdx
                ? { ...m, content: accumulated, streaming: false, citations }
                : m
            )
          );
        } else if (chunk.type === 'error') {
          setMessages((prev) =>
            prev.map((m, i) =>
              i === assistantIdx
                ? { ...m, content: '⚠ Error: ' + (chunk.error ?? 'Unknown error'), streaming: false }
                : m
            )
          );
        }
      }
    } catch {
      // Backend offline — show simulated response
      const fallback =
        'Backend is offline. Start the FastAPI server at localhost:8000 to enable real AI responses.';
      setMessages((prev) =>
        prev.map((m, i) =>
          i === assistantIdx ? { ...m, content: fallback, streaming: false } : m
        )
      );
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <div className="chat-block">
      <p className="block-label">{block.name}</p>

      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">Start a conversation…</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <span className="chat-msg-avatar">{m.role === 'user' ? '👤' : '🤖'}</span>
            <div className="chat-msg-body">
              <span className={`chat-msg-text ${m.streaming ? 'streaming' : ''}`}>
                {m.content || (m.streaming ? <span className="typing-cursor" /> : null)}
              </span>
              {m.citations && m.citations.length > 0 && (
                <div className="chat-citations">
                  {m.citations.map((c, ci) => (
                    <span key={ci} className="chat-citation" title={c.text}>
                      {c.page != null ? `p. ${c.page}` : `ref ${ci + 1}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder={loading ? 'Thinking…' : 'Type a message…'}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()}>
          {loading ? '⋯' : 'Send'}
        </button>
      </div>
    </div>
  );
}
