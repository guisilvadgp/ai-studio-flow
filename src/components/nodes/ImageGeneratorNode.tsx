import { Handle, Position, NodeProps } from '@xyflow/react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ImageIcon, Play, Plus, Minus } from 'lucide-react';
import { useFlowStore, ImageGeneratorNodeData } from '@/store/flowStore';
import { IMAGE_MODELS } from '@/config/models';
import { pollinationsClient } from '@/services/pollinationsClient';
import { BaseNodeWrapper } from './BaseNodeWrapper';
import { Badge } from '@/components/ui/badge';
import { nanoid } from 'nanoid';

export function ImageGeneratorNode({ id, data, selected }: NodeProps) {
  const nodeData = data as ImageGeneratorNodeData;
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const getConnectedInputs = useFlowStore((state) => state.getConnectedInputs);
  const deleteNode = useFlowStore((state) => state.deleteNode);
  const addNode = useFlowStore((state) => state.addNode);
  const nodes = useFlowStore((state) => state.nodes);
  const edges = useFlowStore((state) => state.edges);

  const imageCount = nodeData.imageCount || 1;

  const handleImageCountChange = (delta: number) => {
    const newCount = Math.max(1, Math.min(8, imageCount + delta));
    updateNodeData(id, { imageCount: newCount });
  };

  const handleGenerate = () => {
    updateNodeData(id, { isLoading: true, error: undefined });

    const inputs = getConnectedInputs(id);
    const connectedPrompt = inputs.find(i => i.type === 'prompt' || i.type === 'llm')?.value;
    const prompt = connectedPrompt || nodeData.prompt;

    if (!prompt) {
      updateNodeData(id, { error: 'No prompt provided', isLoading: false });
      return;
    }

    // Find current node position
    const currentNode = nodes.find(n => n.id === id);
    const baseX = (currentNode?.position.x || 0) + 350;
    const baseY = (currentNode?.position.y || 0);

    // Remove existing connected image output nodes
    const connectedImageOutputIds = edges
      .filter(e => e.source === id)
      .map(e => e.target)
      .filter(targetId => {
        const targetNode = nodes.find(n => n.id === targetId);
        return targetNode?.data.type === 'imageOutput';
      });

    connectedImageOutputIds.forEach(nodeId => {
      deleteNode(nodeId);
    });

    // Create image output nodes
    for (let i = 0; i < imageCount; i++) {
      const seed = nodeData.seed ? nodeData.seed + i : Math.floor(Math.random() * 1000000);
      
      const imageUrl = pollinationsClient.generateImageUrl({
        prompt,
        model: nodeData.model,
        width: nodeData.width,
        height: nodeData.height,
        seed,
      });

      const nodeId = nanoid();
      
      addNode({
        id: nodeId,
        type: 'imageOutput',
        position: { x: baseX, y: baseY + (i * 200) },
        data: {
          type: 'imageOutput',
          label: `Image ${i + 1}`,
          imageUrl,
          index: i,
          seed,
        },
      });

      // Add edge connecting this node to the image output
      useFlowStore.getState().onConnect({
        source: id,
        target: nodeId,
        sourceHandle: null,
        targetHandle: null,
      });
    }

    updateNodeData(id, { isLoading: false });
  };

  const selectedModel = IMAGE_MODELS.find(m => m.id === nodeData.model);

  return (
    <BaseNodeWrapper 
      title={nodeData.label} 
      icon={<ImageIcon className="h-4 w-4" />}
      variant="tertiary"
      selected={selected}
      isLoading={nodeData.isLoading}
      error={nodeData.error}
      onDelete={() => deleteNode(id)}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-node-tertiary !border-2 !border-background"
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
          placeholder="Base seed (optional)"
          value={nodeData.seed || ''}
          onChange={(e) => updateNodeData(id, { seed: e.target.value ? parseInt(e.target.value) : undefined })}
          className="bg-secondary/50 border-border/50 text-sm"
        />

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Images:</span>
          <div className="flex items-center gap-1 flex-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleImageCountChange(-1)}
              disabled={imageCount <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-sm font-medium w-8 text-center">{imageCount}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => handleImageCountChange(1)}
              disabled={imageCount >= 8}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-xs text-muted-foreground">(max 8)</span>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={nodeData.isLoading}
          className="w-full"
          size="sm"
        >
          <Play className="h-3 w-3 mr-1" />
          Generate {imageCount} Image{imageCount > 1 ? 's' : ''}
        </Button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-node-tertiary !border-2 !border-background"
      />
    </BaseNodeWrapper>
  );
}
