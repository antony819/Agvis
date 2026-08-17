import { useWorkspaceStore } from '../store/workspaceStore';
import './Inspector.css';

export default function Inspector() {
  const { showInspector, selectedBlockIds, workspace } = useWorkspaceStore();

  if (!showInspector || selectedBlockIds.length === 0) return null;

  const selectedBlock = workspace?.blocks.find(b => b.id === selectedBlockIds[0]);
  
  if (!selectedBlock) return null;

  return (
    <div className="inspector">
      <div className="inspector-header">
        <h3>Inspector</h3>
      </div>
      
      <div className="inspector-content">
        <div className="inspector-section">
          <label>Name</label>
          <input type="text" value={selectedBlock.name} readOnly />
        </div>
        
        <div className="inspector-section">
          <label>Type</label>
          <input type="text" value={selectedBlock.type} readOnly />
        </div>
        
        <div className="inspector-section">
          <label>Mode</label>
          <select value={selectedBlock.automationMode ? 'automation' : 'widget'}>
            <option value="widget">Widget Mode</option>
            <option value="automation">Automation Mode</option>
          </select>
        </div>
        
        <div className="inspector-section">
          <label>Configuration</label>
          <pre>{JSON.stringify(selectedBlock.config, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
