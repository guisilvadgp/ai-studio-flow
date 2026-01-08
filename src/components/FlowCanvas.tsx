import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useFlowStore } from '@/store/flowStore';
import { nodeTypes } from '@/components/nodes';
import { NodePalette } from '@/components/NodePalette';

export function FlowCanvas() {
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);
  const onNodesChange = useFlowStore((state) => state.onNodesChange);
  const onEdgesChange = useFlowStore((state) => state.onEdgesChange);
  const onConnect = useFlowStore((state) => state.onConnect);

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-background"
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: 'hsl(var(--foreground) / 0.4)', strokeWidth: 2 },
        }}
        deleteKeyCode={['Backspace', 'Delete']}
        onEdgeClick={(_, edge) => {
          useFlowStore.getState().deleteEdge(edge.id);
        }}
      >
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1}
          color="hsl(var(--muted-foreground) / 0.3)"
        />
        <Controls 
          className="!bg-card !border-border/50 !shadow-lg [&>button]:!bg-card [&>button]:!border-border/50 [&>button]:!text-foreground [&>button:hover]:!bg-secondary"
        />
        <MiniMap 
          className="!bg-card !border-border/50"
          nodeColor="hsl(var(--primary))"
          maskColor="hsl(var(--background) / 0.8)"
        />
      </ReactFlow>
      <NodePalette />
    </div>
  );
}
