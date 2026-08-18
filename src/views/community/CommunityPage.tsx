import { useState } from 'react';
import './CommunityPage.css';

interface PackMeta {
  id: string;
  name: string;
  author: string;
  description: string;
  version: string;
  installs: number;
  rating: number;
  tags: string[];
  permissions: string[];
  blocks: string[];
  requiresApiKey: boolean;
}

const DEMO_PACKS: PackMeta[] = [
  {
    id: 'research-assistant',
    name: 'Research Assistant',
    author: '@agvis-team',
    description: 'Upload academic papers, ask questions, and take structured notes. Pre-connected Document → Knowledge → Chat workflow.',
    version: '1.2.0',
    installs: 1247,
    rating: 4.8,
    tags: ['research', 'academia', 'rag'],
    permissions: ['Read local files'],
    blocks: ['Document', 'Knowledge', 'Chat', 'Note'],
    requiresApiKey: true,
  },
  {
    id: 'code-reviewer',
    name: 'Code Review Helper',
    author: '@devtools',
    description: 'Drop a code file and get inline review comments from an AI assistant. No external services needed.',
    version: '1.0.1',
    installs: 456,
    rating: 4.6,
    tags: ['development', 'code', 'review'],
    permissions: [],
    blocks: ['Document', 'Chat'],
    requiresApiKey: true,
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    author: '@productivity',
    description: 'Capture meeting notes in Markdown, then chat with the content to extract action items and summaries.',
    version: '2.0.0',
    installs: 892,
    rating: 4.7,
    tags: ['productivity', 'notes', 'meetings'],
    permissions: [],
    blocks: ['Note', 'Chat'],
    requiresApiKey: true,
  },
  {
    id: 'document-qa',
    name: 'Document Q&A',
    author: '@agvis-team',
    description: 'Simple one-document Q&A layout. Drop any PDF or text file and start asking questions immediately.',
    version: '1.0.0',
    installs: 2103,
    rating: 4.9,
    tags: ['documents', 'qa', 'beginner'],
    permissions: [],
    blocks: ['Document', 'Chat'],
    requiresApiKey: true,
  },
];

interface InstallDialogProps {
  pack: PackMeta;
  onClose: () => void;
  onConfirm: () => void;
}

function InstallDialog({ pack, onClose, onConfirm }: InstallDialogProps) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Install "{pack.name}"</h2>
          <button className="dialog-close" onClick={onClose}>✕</button>
        </div>

        <div className="dialog-body">
          <p className="dialog-desc">{pack.description}</p>

          <div className="dialog-section">
            <h4>What will be added</h4>
            <div className="dialog-tags">
              {pack.blocks.map((b) => (
                <span key={b} className="dialog-tag block-tag">{b} Block</span>
              ))}
            </div>
          </div>

          {pack.permissions.length > 0 && (
            <div className="dialog-section">
              <h4>Permissions required</h4>
              {pack.permissions.map((p) => (
                <div key={p} className="dialog-perm">⚠ {p}</div>
              ))}
            </div>
          )}

          {pack.requiresApiKey && (
            <div className="dialog-section">
              <h4>Requirements</h4>
              <div className="dialog-perm info">ℹ Requires an AI model API key (configured in Settings)</div>
            </div>
          )}

          <div className="dialog-section">
            <h4>Author & version</h4>
            <p className="dialog-meta">{pack.author} · v{pack.version} · {pack.installs.toLocaleString()} installs · ⭐ {pack.rating}</p>
          </div>
        </div>

        <div className="dialog-footer">
          <button className="dialog-btn secondary" onClick={onClose}>Cancel</button>
          <button className="dialog-btn primary" onClick={onConfirm}>Install Pack</button>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const [search, setSearch] = useState('');
  const [selectedPack, setSelectedPack] = useState<PackMeta | null>(null);
  const [installed, setInstalled] = useState<Set<string>>(new Set());

  const filtered = DEMO_PACKS.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.includes(search.toLowerCase()))
  );

  const handleInstall = (pack: PackMeta) => {
    setInstalled((prev) => new Set([...prev, pack.id]));
    setSelectedPack(null);
  };

  return (
    <div className="community-page">
      <div className="community-header">
        <div>
          <h1>Community Packs</h1>
          <p>Pre-built workspace configurations — install and start immediately.</p>
        </div>
      </div>

      <div className="community-toolbar">
        <input
          className="community-search"
          placeholder="🔍  Search packs…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="packs-grid">
        {filtered.map((pack) => (
          <div key={pack.id} className="pack-card">
            <div className="pack-card-top">
              <h3 className="pack-name">{pack.name}</h3>
              <span className="pack-rating">⭐ {pack.rating}</span>
            </div>
            <p className="pack-desc">{pack.description}</p>
            <div className="pack-tags">
              {pack.tags.map((t) => (
                <span key={t} className="pack-tag">{t}</span>
              ))}
            </div>
            <div className="pack-footer">
              <span className="pack-author">{pack.author} · v{pack.version} · ⬇ {pack.installs.toLocaleString()}</span>
              {installed.has(pack.id) ? (
                <span className="pack-installed">✓ Installed</span>
              ) : (
                <button className="pack-install-btn" onClick={() => setSelectedPack(pack)}>
                  Install
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="packs-empty">No packs match "{search}"</div>
        )}
      </div>

      {selectedPack && (
        <InstallDialog
          pack={selectedPack}
          onClose={() => setSelectedPack(null)}
          onConfirm={() => handleInstall(selectedPack)}
        />
      )}
    </div>
  );
}
