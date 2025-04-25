import { useCallback, useEffect, useState } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  Node as FlowNode, 
  useNodesState, 
  useEdgesState,
  NodeTypes,
  addEdge,
  Connection,
  NodeMouseHandler
} from 'reactflow';
import 'reactflow/dist/style.css';

import { fetchFormGraph } from '../../services/api';
import FormNode from './FormNode';
import { GraphData } from '../../types';
import FormPrefill from '../FormPrefill/FormPrefill';

const nodeTypes: NodeTypes = {
  form: FormNode
};

const JourneyBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchFormGraph();
        
        const formattedNodes = data.nodes.map(node => ({
          ...node,
          type: 'form',
          data: {
            ...node.data
          }
        }));
        
        setNodes(formattedNodes);
        setEdges(data.edges);
        setGraphData({ nodes: formattedNodes, edges: data.edges });
      } catch (err) {
        console.error('Failed loading graph:', err);
        setError('Could not load form data');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [setNodes, setEdges]);

  const handleNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  const handleConnect = useCallback((params: Connection) => {
    setEdges(eds => addEdge(params, eds));
  }, [setEdges]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ flex: selectedNode ? '70%' : '100%', height: '100%' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={handleConnect}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
      
      {selectedNode && (
        <div style={{ flex: '30%', borderLeft: '1px solid #ddd', padding: '20px', overflow: 'auto' }}>
          <FormPrefill
            selectedNode={selectedNode}
            graphData={graphData}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      )}
    </div>
  );
};

export default JourneyBuilder;