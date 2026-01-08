import { Handle, Position, NodeProps } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Image, Play, RefreshCw } from 'lucide-react';
import { useFlowStore, ImageGeneratorNodeData } from '@/store/flowStore';
import { IMAGE_MODELS } from '@/config/models';
import { pollinationsClient } from '@/services/pollinationsClient';
import { BaseNodeWrapper } from './BaseNodeWrapper';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export function ImageGeneratorNode({ id, data, selected }: NodeProps) {
  const nodeData = data as ImageGeneratorNodeData;
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const getConnectedInputs = useFlowStore((state) => state.getConnectedInputs);
  const [imageLoading, setImageLoading] = useState(false);

  const handleGenerate = () => {
    updateNodeData(id, { isLoading: true, error: undefined });
    setImageLoading(true);

    const inputs = getConnectedInputs(id);
    const connectedPrompt = inputs.find(i => i.type === 'prompt' || i.type === 'llm')?.value;
    const prompt = connectedPrompt || nodeData.prompt;

    if (!prompt) {
      updateNodeData(id, { error: 'No prompt provided', isLoading: false });
      setImageLoading(false);
      return;
    }

    const imageUrl = pollinationsClient.generateImageUrl({
      prompt,
      model: nodeData.model,
      width: nodeData.width,
      height: nodeData.height,
      seed: nodeData.seed,
    });

    updateNodeData(id, { outputUrl: imageUrl, isLoading: false });
  };

  const selectedModel = IMAGE_MODELS.find(m => m.id === nodeData.model);

  return (
    <BaseNodeWrapper 
      title={nodeData.label} 
      icon={<Image className="h-4 w-4" />}
      color="pink"
      selected={selected}
      isLoading={nodeData.isLoading}
      error={nodeData.error}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-neon-pink !border-2 !border-background"
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
            {IMAGE_MODELS.map((model) => (
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
          placeholder="Image prompt..."
          value={nodeData.prompt}
          onChange={(e) => updateNodeData(id, { prompt: e.target.value })}
          className="bg-secondary/50 border-border/50 text-sm"
        />

        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Width"
            value={nodeData.width}
            onChange={(e) => updateNodeData(id, { width: parseInt(e.target.value) || 512 })}
            className="bg-secondary/50 border-border/50 text-sm"
          />
          <Input
            type="number"
            placeholder="Height"
            value={nodeData.height}
            onChange={(e) => updateNodeData(id, { height: parseInt(e.target.value) || 512 })}
            className="bg-secondary/50 border-border/50 text-sm"
          />
        </div>

        <Input
          type="number"
          placeholder="Seed (optional)"
          value={nodeData.seed || ''}
          onChange={(e) => updateNodeData(id, { seed: e.target.value ? parseInt(e.target.value) : undefined })}
          className="bg-secondary/50 border-border/50 text-sm"
        />

        <Button 
          onClick={handleGenerate} 
          disabled={nodeData.isLoading}
          className="w-full"
          size="sm"
        >
          {nodeData.outputUrl ? <RefreshCw className="h-3 w-3 mr-1" /> : <Play className="h-3 w-3 mr-1" />}
          {nodeData.outputUrl ? 'Regenerate' : 'Generate'}
        </Button>

        {nodeData.outputUrl && (
          <div className="relative rounded overflow-hidden border border-border/30">
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="h-6 w-6 border-2 border-neon-pink border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <img 
              src={nodeData.outputUrl} 
              alt="Generated" 
              className="w-full h-auto max-h-[150px] object-cover"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                updateNodeData(id, { error: 'Failed to load image' });
              }}
            />
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-neon-pink !border-2 !border-background"
      />
    </BaseNodeWrapper>
  );
}
