import { Handle, Position, NodeProps } from '@xyflow/react';
import { Monitor } from 'lucide-react';
import { useFlowStore, DisplayNodeData } from '@/store/flowStore';
import { BaseNodeWrapper } from './BaseNodeWrapper';
import { useEffect } from 'react';

export function DisplayNode({ id, data, selected }: NodeProps) {
  const nodeData = data as DisplayNodeData;
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const getConnectedInputs = useFlowStore((state) => state.getConnectedInputs);
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);

  // Auto-update content when connected nodes change
  useEffect(() => {
    const inputs = getConnectedInputs(id);
    if (inputs.length > 0) {
      const latestInput = inputs[inputs.length - 1];
      updateNodeData(id, { content: latestInput.value });
    }
  }, [id, getConnectedInputs, updateNodeData, nodes, edges]);

  const isImageUrl = (str: string) => {
    return str.startsWith('http') && (str.includes('image') || str.includes('png') || str.includes('jpg') || str.includes('jpeg') || str.includes('gif'));
  };

  const isVideoUrl = (str: string) => {
    return str.startsWith('http') && (str.includes('video') || str.includes('mp4') || str.includes('webm'));
  };

  const renderContent = () => {
    if (!nodeData.content) {
      return (
        <div className="flex items-center justify-center h-24 text-muted-foreground text-sm">
          Connect a node to display output
        </div>
      );
    }

    const inputType = nodeData.inputType === 'auto' 
      ? (isVideoUrl(nodeData.content) ? 'video' : isImageUrl(nodeData.content) ? 'image' : 'text')
      : nodeData.inputType;

    switch (inputType) {
      case 'image':
        return (
          <div className="rounded overflow-hidden border border-border/30">
            <img 
              src={nodeData.content} 
              alt="Display" 
              className="w-full h-auto max-h-[200px] object-contain"
            />
          </div>
        );
      case 'video':
        return (
          <div className="rounded overflow-hidden border border-border/30">
            <video 
              src={nodeData.content} 
              controls 
              className="w-full h-auto max-h-[200px]"
            />
          </div>
        );
      default:
        return (
          <div className="text-sm bg-secondary/30 rounded p-3 max-h-[200px] overflow-y-auto border border-border/30 whitespace-pre-wrap">
            {nodeData.content}
          </div>
        );
    }
  };

  return (
    <BaseNodeWrapper 
      title={nodeData.label} 
      icon={<Monitor className="h-4 w-4" />}
      color="purple"
      selected={selected}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-neon-purple !border-2 !border-background"
      />

      <div className="min-h-[80px]">
        {renderContent()}
      </div>
    </BaseNodeWrapper>
  );
}
