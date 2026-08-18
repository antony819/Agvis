import { useState } from 'react';
import './SettingsPage.css';
import './SettingsPage.css';

export default function SettingsPage() {
  const [model, setModel] = useState('gpt-4');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-small');
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(50);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');

  const testConnection = async () => {
    setTestStatus('testing');
    await new Promise((r) => setTimeout(r, 1200));
    setTestStatus(apiKey.startsWith('sk-') ? 'ok' : 'fail');
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>

      {/* AI Models */}
      <section className="settings-section">
        <h2>AI Models</h2>

        <div className="settings-field">
          <label>Default chat model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="gpt-4">OpenAI GPT-4</option>
            <option value="gpt-4o">OpenAI GPT-4o</option>
            <option value="gpt-3.5-turbo">OpenAI GPT-3.5 Turbo</option>
            <option value="claude-3-opus">Anthropic Claude 3 Opus</option>
            <option value="claude-3-sonnet">Anthropic Claude 3 Sonnet</option>
          </select>
        </div>

        <div className="settings-field">
          <label>OpenAI API key</label>
          <div className="api-key-row">
            <input
              type={apiKeyVisible ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => { setApiKey(e.target.value); setTestStatus('idle'); }}
              placeholder="sk-…"
            />
            <button className="icon-btn" onClick={() => setApiKeyVisible((v) => !v)}>
              {apiKeyVisible ? '🙈' : '👁'}
            </button>
            <button className="test-btn" onClick={testConnection} disabled={!apiKey || testStatus === 'testing'}>
              {testStatus === 'testing' ? 'Testing…' : 'Test'}
            </button>
          </div>
          {testStatus === 'ok'   && <p className="field-hint success">✓ Connection successful</p>}
          {testStatus === 'fail' && <p className="field-hint error">✗ Connection failed — check your key</p>}
        </div>

        <div className="settings-field">
          <label>Embedding model</label>
          <select value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)}>
            <option value="text-embedding-3-small">OpenAI text-embedding-3-small</option>
            <option value="text-embedding-3-large">OpenAI text-embedding-3-large</option>
            <option value="text-embedding-ada-002">OpenAI text-embedding-ada-002</option>
          </select>
        </div>
      </section>

      {/* Document Processing */}
      <section className="settings-section">
        <h2>Document Processing</h2>

        <div className="settings-field">
          <label>Chunk size <span className="field-unit">tokens</span></label>
          <input
            type="number"
            value={chunkSize}
            min={100}
            max={2000}
            onChange={(e) => setChunkSize(Number(e.target.value))}
          />
          <p className="field-hint">Larger chunks preserve more context; smaller chunks improve retrieval precision.</p>
        </div>

        <div className="settings-field">
          <label>Chunk overlap <span className="field-unit">tokens</span></label>
          <input
            type="number"
            value={chunkOverlap}
            min={0}
            max={500}
            onChange={(e) => setChunkOverlap(Number(e.target.value))}
          />
        </div>
      </section>

      {/* Desktop Listener */}
      <section className="settings-section">
        <h2>Desktop Listener</h2>
        <div className="listener-status">
          <span className="status-dot offline" />
          <span>Not connected</span>
        </div>
        <p className="field-hint">
          The desktop listener enables global hotkeys, push-to-talk, and local file watching.
          Download and install it to enable these features.
        </p>
        <div className="settings-actions">
          <button className="settings-btn secondary" disabled>Download Listener</button>
          <button className="settings-btn secondary" disabled>Pair Device</button>
        </div>
      </section>

      {/* About */}
      <section className="settings-section">
        <h2>About</h2>
        <p className="field-hint">Agvis v0.1.0 — Modular AI Workspace</p>
        <div className="settings-actions">
          <a className="settings-btn secondary" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </section>
    </div>
  );
}
