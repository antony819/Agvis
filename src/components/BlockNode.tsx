import { useEffect, useState } from 'react';
import type { BlockInstance } from '../types';
import { Handle, Position } from '@xyflow/react';
import { getBlockType } from '../lib/blockTypes';
import { getDocumentStatus } from '../lib/api';
import './BlockNode.css';

interface BlockNodeProps {
  data: {
    block: BlockInstance;
  };
}

export default function BlockNode({ data }: BlockNodeProps) {
  const { block } = data;
  const blockType = getBlockType(block.type);
  const [docStatus, setDocStatus] = useState<any>(null);
  
  // Poll document status if this is a document block
  useEffect(() => {
    if (block.type !== 'document' || !block.config.fileId) return;
    
    const pollStatus = async () => {
      try {
        const status = await getDocumentStatus(block.config.fileId);
        setDocStatus(status);
        
        // Stop polling when both parsing and indexing are done
        if (status.parsingStatus === 'parsed' && status.indexingStatus === 'indexed') {
          return;
        }
        
        // Continue polling
        setTimeout(pollStatus, 2000);
      } catch (error) {
        console.error('Failed to get document status:', error);
      }
    };
    
    pollStatus();
  }, [block.type, block.config.fileId]);
  
  if (!blockType) return null;

  return (
    <div className={`block-node ${block.selected ? 'selected' : ''}`}>
      <div className="block-header">
        <span className="block-icon">{blockType.icon}</span>
        <span className="block-name">{block.name}</span>
        <button className="block-menu">⋮</button>
      </div>
      
      <div className="block-content">
        {block.type === 'chat' && (
          <div className="chat-preview">
            <div className="chat-empty">Start a conversation...</div>
          </div>
        )}
        
        {block.type === 'document' && (
          <div className="document-preview">
            {block.config.filename && (
              <div className="document-filename">{block.config.filename}</div>
            )}
            
            {docStatus && (
              <div className="document-status">
                <div className={`status-item ${docStatus.parsingStatus}`}>
                  {docStatus.parsingStatus === 'parsed' ? '✓' : '⋯'} Parsing
                </div>
                <div className={`status-item ${docStatus.indexingStatus}`}>
                  {docStatus.indexingStatus === 'indexed' ? '✓' : '⋯'} Indexing
                </div>
                {docStatus.chunks && (
                  <div className="document-meta">{docStatus.chunks} chunks</div>
                )}
              </div>
            )}
            
            {!docStatus && (
              <div className="document-uploading">Uploading...</div>
            )}
          </div>
        )}
        
        {block.type === 'knowledge' && (
          <div className="knowledge-preview">
            <div className="knowledge-empty">No documents yet</div>
            <button className="knowledge-add">+ Add Document</button>
          </div>
        )}
        
        {block.type === 'note' && (
          <div className="note-preview">
            <textarea 
              placeholder="Write your notes here..."
              className="note-textarea"
              defaultValue={block.config.content || ''}
            />
          </div>
        )}
      </div>
      
      {block.automationMode && (
        <>
          {blockType.inputs.map((input) => (
            <Handle
              key={input.id}
              type="target"
              position={Position.Left}
              id={input.id}
              style={{ top: '50%' }}
            />
          ))}
          
          {blockType.outputs.map((output) => (
            <Handle
              key={output.id}
              type="source"
              position={Position.Right}
              id={output.id}
              style={{ top: '50%' }}
            />
          ))}
        </>
      )}
    </div>
  );
}
