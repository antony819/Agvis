import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge as ReactFlowEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkspaceStore } from '../store/workspaceStore';
import BlockNode from './BlockNode';
import Toolbar from './Toolbar';
import BlockLibrary from './BlockLibrary';
import Inspector from './Inspector';
import AIComposer from './AIComposer';
import './Canvas.css';

const nodeTypes = {
  block: BlockNode,
};

export default function Canvas() {
  const { workspace, createWorkspace, addEdge: addStoreEdge } = useWorkspaceStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<ReactFlowEdge>([]);

  // Initialize workspace on mount
  useEffect(() => {
    if (!workspace) {
      createWorkspace('My Workspace');
    }
  }, [workspace, createWorkspace]);

  // Sync workspace blocks to React Flow nodes
  useEffect(() => {
    if (!workspace) return;
    
    const flowNodes: Node[] = workspace.blocks.map((block) => ({
      id: block.id,
      type: 'block',
      position: block.position,
      data: { block },
    }));
    
    setNodes(flowNodes);
  }, [workspace?.blocks, setNodes]);

  // Sync workspace edges to React Flow edges
  useEffect(() => {
    if (!workspace) return;
    
    const flowEdges: ReactFlowEdge[] = workspace.edges.map((edge) => ({
      id: edge.id,
      source: edge.source.blockId,
      target: edge.target.blockId,
      sourceHandle: edge.source.portId,
      targetHandle: edge.target.portId,
    }));
    
    setEdges(flowEdges);
  }, [workspace?.edges, setEdges]);

  // Handle connection creation
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      
      addStoreEdge({
        source: {
          blockId: connection.source,
          portId: connection.sourceHandle || '',
          direction: 'output',
        },
        target: {
          blockId: connection.target,
          portId: connection.targetHandle || '',
          direction: 'input',
        },
      });
    },
    [addStoreEdge]
  );

  // Handle file drop
  const onDrop = useCallback(async (event: React.DragEvent) => {
    event.preventDefault();
    
    const files = Array.from(event.dataTransfer.files);
    if (files.length === 0) return;
    
    // Get drop position relative to the canvas
    const canvasRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;
    
    // Upload each file and create document block
    for (const file of files) {
      try {
        const { uploadDocument } = await import('../lib/api') as typeof import('../lib/api');
        const result = await uploadDocument(file);
        
        // Create document block with uploaded file
        const { addBlock, updateBlock } = useWorkspaceStore.getState();
        addBlock('document', { x, y });
        
        // Find the newly added block and update its config
        const { workspace } = useWorkspaceStore.getState();
        const newBlock = workspace?.blocks[workspace.blocks.length - 1];
        if (newBlock) {
          updateBlock(newBlock.id, {
            config: {
              fileId: result.documentId,
              filename: result.filename,
              parsingStatus: 'pending',
              indexingStatus: 'pending',
            },
          });
        }
      } catch (error) {
        console.error('Failed to upload file:', error);
      }
    }
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  return (
    <div className="canvas-container">
      <Toolbar />
      
      <div className="canvas-main">
        <BlockLibrary />
        
        <div 
          className="canvas-area"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
        
        <Inspector />
      </div>
      
      <AIComposer />
    </div>
  );
}
