import { Handle, Position, NodeProps } from '@xyflow/react';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { useFlowStore, PromptNodeData } from '@/store/flowStore';
import { BaseNodeWrapper } from './BaseNodeWrapper';

export function PromptNode({ id, data, selected }: NodeProps) {
  const nodeData = data as PromptNodeData;
  const updateNodeData = useFlowStore((state) => state.updateNodeData);

  return (
    <BaseNodeWrapper 
      title={nodeData.label} 
      icon={<MessageSquare className="h-4 w-4" />}
      color="purple"
      selected={selected}
    >
      <Textarea
        placeholder="Enter your prompt..."
        value={nodeData.prompt}
        onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
        className="min-h-[80px] resize-none bg-secondary/50 border-border/50 text-sm"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-neon-purple !border-2 !border-background"
      />
    </BaseNodeWrapper>
  );
}
