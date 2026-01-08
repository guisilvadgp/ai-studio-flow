import { Handle, Position, NodeProps } from '@xyflow/react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Brain, Play } from 'lucide-react';
import { useFlowStore, LLMNodeData } from '@/store/flowStore';
import { TEXT_MODELS } from '@/config/models';
import { pollinationsClient } from '@/services/pollinationsClient';
import { BaseNodeWrapper } from './BaseNodeWrapper';
import { Badge } from '@/components/ui/badge';

export function LLMNode({ id, data, selected }: NodeProps) {
  const nodeData = data as LLMNodeData;
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const getConnectedInputs = useFlowStore((state) => state.getConnectedInputs);
  const deleteNode = useFlowStore((state) => state.deleteNode);

  const handleRun = async () => {
    updateNodeData(id, { isLoading: true, error: undefined, output: undefined });

    try {
      const inputs = getConnectedInputs(id);
      const connectedPrompt = inputs.find(i => i.type === 'prompt' || i.type === 'llm')?.value;
      const connectedImage = inputs.find(i => i.type === 'imageGenerator')?.value;

      const userMessage = connectedPrompt || nodeData.userMessage;
      
      const messages: Array<{ role: 'system' | 'user'; content: string | Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }> }> = [];
      
      if (nodeData.systemPrompt) {
        messages.push({ role: 'system', content: nodeData.systemPrompt });
      }

      if (connectedImage || nodeData.imageUrl) {
        const imageUrl = connectedImage || nodeData.imageUrl;
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: userMessage },
            { type: 'image_url', image_url: { url: imageUrl! } },
          ],
        });
      } else {
        messages.push({ role: 'user', content: userMessage });
      }

      const output = await pollinationsClient.generateText({
        model: nodeData.model,
        messages,
      });

      updateNodeData(id, { output, isLoading: false });
    } catch (error) {
      updateNodeData(id, { 
        error: error instanceof Error ? error.message : 'Unknown error', 
        isLoading: false 
      });
    }
  };

  const selectedModel = TEXT_MODELS.find(m => m.id === nodeData.model);

  return (
    <BaseNodeWrapper 
      title={nodeData.label} 
      icon={<Brain className="h-4 w-4" />}
      variant="secondary"
      selected={selected}
      isLoading={nodeData.isLoading}
      error={nodeData.error}
      onDelete={() => deleteNode(id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-node-secondary !border-2 !border-background"
      />

      <div className="space-y-2">
        <Select
          value={nodeData.model}
          onValueChange={(value) => updateNodeData(id, { model: value })}
        >
          <SelectTrigger className="bg-secondary/50 border-border/50 text-sm">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {TEXT_MODELS.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                <div className="flex items-center gap-2">
                  <span>{model.name}</span>
                  <span className="text-muted-foreground text-xs">({model.pricing})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedModel?.tags && selectedModel.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {selectedModel.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <Textarea
          placeholder="System prompt (optional)"
          value={nodeData.systemPrompt}
          onChange={(e) => updateNodeData(id, { systemPrompt: e.target.value })}
          className="min-h-[50px] resize-none bg-secondary/50 border-border/50 text-xs"
        />

        <Textarea
          placeholder="User message..."
          value={nodeData.userMessage}
          onChange={(e) => updateNodeData(id, { userMessage: e.target.value })}
          className="min-h-[60px] resize-none bg-secondary/50 border-border/50 text-sm"
        />

        <Button 
          onClick={handleRun} 
          disabled={nodeData.isLoading}
          className="w-full"
          size="sm"
        >
          <Play className="h-3 w-3 mr-1" />
          Run
        </Button>

        {nodeData.output && (
          <div className="text-xs bg-secondary/30 rounded p-2 max-h-[100px] overflow-y-auto border border-border/30">
            {nodeData.output}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-node-secondary !border-2 !border-background"
      />
    </BaseNodeWrapper>
  );
}
