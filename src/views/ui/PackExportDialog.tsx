import { useState } from 'react';
import type { BlockInstance } from '../../models';
import { getBlockType } from '../../services/blockTypes';
import './PackExportDialog.css';

interface Props {
  blocks: BlockInstance[];
  onClose: () => void;
}

export default function PackExportDialog({ blocks, onClose }: Props) {
  const [name, setName]         = useState('');
  const [description, setDesc]  = useState('');
  const [author, setAuthor]     = useState('');
  const [version, setVersion]   = useState('1.0.0');
  const [license, setLicense]   = useState('MIT');
  const [selected, setSelected] = useState<Set<string>>(
    new Set(blocks.map((b) => b.id))
  );
  const [exported, setExported] = useState(false);

  const toggleBlock = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isPrivate = (b: BlockInstance) =>
    b.type === 'document' && !!b.config.fileId;

  const handleExport = () => {
    const includedBlocks = blocks
      .filter((b) => selected.has(b.id))
      .map((b) => {
        if (isPrivate(b)) {
          return {
            ...b,
            config: { ...b.config, fileId: null, filename: null },
            name: `[Placeholder] ${b.name}`,
          };
        }
        return b;
      });

    const manifest = {
      id: crypto.randomUUID(),
      name: name || 'Untitled Pack',
      version,
      description,
      author,
      license,
      minAppVersion: '0.1.0',
      blocks: includedBlocks,
      edges: [],
      layout: { viewport: { x: 0, y: 0, zoom: 1 } },
      dependencies: { aiModels: ['gpt-4'] },
      permissions: {},
      configRequirements: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${(name || 'pack').toLowerCase().replace(/\s+/g, '-')}.agvis-pack.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="pack-export-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>Save as Pack</h2>
          <button className="dialog-close" onClick={onClose}>✕</button>
        </div>

        <div className="dialog-body">
          <div className="export-field">
            <label>Pack Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="My Research Setup" />
          </div>
          <div className="export-field">
            <label>Description</label>
            <textarea value={description} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="Describe what this pack does…" />
          </div>
          <div className="export-row">
            <div className="export-field">
              <label>Version</label>
              <input value={version} onChange={(e) => setVersion(e.target.value)} />
            </div>
            <div className="export-field">
              <label>Author</label>
              <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="@username" />
            </div>
            <div className="export-field">
              <label>License</label>
              <select value={license} onChange={(e) => setLicense(e.target.value)}>
                <option>MIT</option>
                <option>Apache-2.0</option>
                <option>CC BY 4.0</option>
                <option>Proprietary</option>
              </select>
            </div>
          </div>

          <div className="export-blocks-label">Included Blocks</div>
          <div className="export-blocks">
            {blocks.map((b) => {
              const bt = getBlockType(b.type);
              const priv = isPrivate(b);
              return (
                <label key={b.id} className="export-block-row">
                  <input
                    type="checkbox"
                    checked={selected.has(b.id)}
                    onChange={() => toggleBlock(b.id)}
                  />
                  <span className="export-block-icon">{bt?.icon}</span>
                  <span className="export-block-name">{b.name}</span>
                  {priv && (
                    <span className="export-block-warn" title="Private file will become a placeholder">
                      ⚠ placeholder
                    </span>
                  )}
                </label>
              );
            })}
          </div>

          {exported && (
            <div className="export-success">
              ✓ Pack exported as JSON — share the file or host it in a GitHub repo.
            </div>
          )}
        </div>

        <div className="dialog-footer">
          <button className="dialog-btn secondary" onClick={onClose}>Cancel</button>
          <button
            className="dialog-btn primary"
            onClick={handleExport}
            disabled={selected.size === 0}
          >
            Export Pack
          </button>
        </div>
      </div>
    </div>
  );
}
