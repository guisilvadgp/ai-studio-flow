import { Handle, Position, NodeProps } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Video, Play } from 'lucide-react';
import { useFlowStore, VideoDirectorNodeData } from '@/store/flowStore';
import { VIDEO_MODELS } from '@/config/models';
import { pollinationsClient } from '@/services/pollinationsClient';
import { BaseNodeWrapper } from './BaseNodeWrapper';
import { Badge } from '@/components/ui/badge';

export function VideoDirectorNode({ id, data, selected }: NodeProps) {
  const nodeData = data as VideoDirectorNodeData;
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const getConnectedInputs = useFlowStore((state) => state.getConnectedInputs);

  const handleGenerate = () => {
    updateNodeData(id, { isLoading: true, error: undefined });

    const inputs = getConnectedInputs(id);
    const connectedPrompt = inputs.find(i => i.type === 'prompt' || i.type === 'llm')?.value;
    const connectedImage = inputs.find(i => i.type === 'imageGenerator')?.value;
    
    const prompt = connectedPrompt || nodeData.prompt;
    const imageUrl = connectedImage || nodeData.imageUrl;

    if (!prompt && !imageUrl) {
      updateNodeData(id, { error: 'No prompt or image provided', isLoading: false });
      return;
    }

    const videoUrl = pollinationsClient.generateVideoUrl({
      prompt: prompt || 'Animate this image',
      model: nodeData.model,
      imageUrl,
    });

    updateNodeData(id, { outputUrl: videoUrl, isLoading: false });
  };

  const selectedModel = VIDEO_MODELS.find(m => m.id === nodeData.model);

  return (
    <BaseNodeWrapper 
      title={nodeData.label} 
      icon={<Video className="h-4 w-4" />}
      color="green"
      selected={selected}
      isLoading={nodeData.isLoading}
      error={nodeData.error}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-neon-green !border-2 !border-background"
      />

      <div className="space-y-2">
        <Select
          value={nodeData.model}
          onValueChange={(value) => updateNodeData(id, { model: value })}
        >
          <SelectTrigger className="bg-secondary/50 border-border/50 text-sm">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {VIDEO_MODELS.map((model) => (
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

        <Input
          placeholder="Video prompt..."
          value={nodeData.prompt}
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
          className="bg-secondary/50 border-border/50 text-sm"
        />

        <Input
          placeholder="Image URL (for I2V)"
          value={nodeData.imageUrl || ''}
          onChange={(e) => updateNodeData(id, { imageUrl: e.target.value })}
          className="bg-secondary/50 border-border/50 text-sm"
        />

        <Button 
          onClick={handleGenerate} 
          disabled={nodeData.isLoading}
          className="w-full"
          size="sm"
        >
          <Play className="h-3 w-3 mr-1" />
          Generate Video
        </Button>

        {nodeData.outputUrl && (
          <div className="rounded overflow-hidden border border-border/30">
            <video 
              src={nodeData.outputUrl} 
              controls 
              className="w-full h-auto max-h-[150px]"
            />
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-neon-green !border-2 !border-background"
      />
    </BaseNodeWrapper>
  );
}
