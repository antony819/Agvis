import type { BlockInstance } from '../../models';
import { getBlockType } from '../../services/blockTypes';
import './Inspector.css';

interface Props {
  block: BlockInstance | null;
  onUpdate: (id: string, updates: Partial<BlockInstance>) => void;
  onClose: () => void;
}

export default function Inspector({ block, onUpdate, onClose }: Props) {
  if (!block) return null;
  const blockType = getBlockType(block.type);

  return (
    <aside className="inspector">
      <div className="inspector-header">
        <span className="inspector-icon">{blockType?.icon}</span>
        <span className="inspector-title">Inspector</span>
        <button className="inspector-close" onClick={onClose}>✕</button>
      </div>

      <div className="inspector-body">
        <div className="inspector-field">
          <label>Name</label>
          <input
            type="text"
            value={block.name}
            onChange={(e) =>
              onUpdate(block.id, { name: e.target.value })
            }
          />
        </div>

        <div className="inspector-field">
          <label>Type</label>
          <input type="text" value={block.type} readOnly />
        </div>

        <div className="inspector-field">
          <label>Version</label>
          <input type="text" value={block.version} readOnly />
        </div>

        <div className="inspector-field">
          <label>Position</label>
          <div className="inspector-row">
            <label>X</label>
            <input
              type="number"
              value={Math.round(block.position.x)}
              onChange={(e) =>
                onUpdate(block.id, { position: { ...block.position, x: Number(e.target.value) } })
              }
            />
            <label>Y</label>
            <input
              type="number"
              value={Math.round(block.position.y)}
              onChange={(e) =>
                onUpdate(block.id, { position: { ...block.position, y: Number(e.target.value) } })
              }
            />
          </div>
        </div>

        {/* Chat-specific config */}
        {block.type === 'chat' && (
          <>
            <div className="inspector-field">
              <label>Model</label>
              <select
                value={block.config.model || 'gpt-4'}
                onChange={(e) =>
                  onUpdate(block.id, { config: { ...block.config, model: e.target.value } })
                }
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4o">GPT-4o</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-3-opus">Claude 3 Opus</option>
                <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              </select>
            </div>
            <div className="inspector-field">
              <label>Temperature</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={block.config.temperature ?? 0.7}
                onChange={(e) =>
                  onUpdate(block.id, { config: { ...block.config, temperature: Number(e.target.value) } })
                }
              />
              <span className="inspector-hint">{(block.config.temperature ?? 0.7).toFixed(1)}</span>
            </div>
            <div className="inspector-field">
              <label>System Prompt</label>
              <textarea
                value={block.config.systemPrompt || ''}
                onChange={(e) =>
                  onUpdate(block.id, { config: { ...block.config, systemPrompt: e.target.value } })
                }
                placeholder="Optional system prompt…"
                rows={3}
              />
            </div>
          </>
        )}

        {/* Knowledge-specific config */}
        {block.type === 'knowledge' && (
          <>
            <div className="inspector-field">
              <label>Chunk Size</label>
              <input
                type="number"
                min={100}
                max={2000}
                value={block.config.chunkSize ?? 512}
                onChange={(e) =>
                  onUpdate(block.id, { config: { ...block.config, chunkSize: Number(e.target.value) } })
                }
              />
            </div>
            <div className="inspector-field">
              <label>Top K</label>
              <input
                type="number"
                min={1}
                max={20}
                value={block.config.topK ?? 5}
                onChange={(e) =>
                  onUpdate(block.id, { config: { ...block.config, topK: Number(e.target.value) } })
                }
              />
            </div>
          </>
        )}

        <div className="inspector-meta">
          <span>Created {new Date(block.createdAt).toLocaleDateString()}</span>
          <span>ID: {block.id.slice(0, 8)}…</span>
        </div>
      </div>
    </aside>
  );
}
