import { useWorkspaceStore } from '../store/workspaceStore';
import { BLOCK_TYPES } from '../lib/blockTypes';
import './BlockLibrary.css';

export default function BlockLibrary() {
  const { showBlockLibrary, addBlock } = useWorkspaceStore();

  if (!showBlockLibrary) return null;

  const handleAddBlock = (type: string) => {
    // Add block at center of viewport
    addBlock(type, { x: 400, y: 300 });
  };

  return (
    <div className="block-library">
      <div className="block-library-header">
        <h3>Blocks</h3>
        <input type="text" placeholder="Search blocks..." className="block-search" />
      </div>
      
      <div className="block-list">
        {Object.values(BLOCK_TYPES).map((blockType) => (
          <button
            key={blockType.type}
            className="block-item"
            onClick={() => handleAddBlock(blockType.type)}
          >
            <span className="block-item-icon">{blockType.icon}</span>
            <div className="block-item-info">
              <div className="block-item-name">{blockType.name}</div>
              <div className="block-item-desc">{blockType.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
