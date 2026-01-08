import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useFlowStore, FlowNode } from '@/store/flowStore';
import { MessageSquare, Brain, Image, Video, Monitor, Plus } from 'lucide-react';
import { nanoid } from 'nanoid';

const nodeTemplates = [
  {
    type: 'prompt' as const,
    label: 'Prompt',
    icon: MessageSquare,
    color: 'text-neon-purple',
    defaultData: {
      type: 'prompt' as const,
      label: 'Prompt',
      prompt: '',
    },
  },
  {
    type: 'llm' as const,
    label: 'LLM',
    icon: Brain,
    color: 'text-neon-cyan',
    defaultData: {
      type: 'llm' as const,
      label: 'LLM',
      model: 'openai',
      systemPrompt: '',
      userMessage: '',
    },
  },
  {
    type: 'imageGenerator' as const,
    label: 'Image',
    icon: Image,
    color: 'text-neon-pink',
    defaultData: {
      type: 'imageGenerator' as const,
      label: 'Image Generator',
      model: 'flux',
      prompt: '',
      width: 512,
      height: 512,
    },
  },
  {
    type: 'videoDirector' as const,
    label: 'Video',
    icon: Video,
    color: 'text-neon-green',
    defaultData: {
      type: 'videoDirector' as const,
      label: 'Video Director',
      model: 'veo',
      prompt: '',
    },
  },
  {
    type: 'display' as const,
    label: 'Display',
    icon: Monitor,
    color: 'text-neon-purple',
    defaultData: {
      type: 'display' as const,
      label: 'Display',
      inputType: 'auto' as const,
    },
  },
];

export function NodePalette() {
  const addNode = useFlowStore((state) => state.addNode);
  const nodes = useFlowStore((state) => state.nodes);

  const handleAddNode = (template: typeof nodeTemplates[0]) => {
    const offset = nodes.length * 20;
    const newNode: FlowNode = {
      id: nanoid(),
      type: template.type,
      position: { x: 100 + offset, y: 100 + offset },
      data: { ...template.defaultData },
    };
    addNode(newNode);
  };

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 p-2 rounded-lg bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg">
      <div className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-muted-foreground border-b border-border/30 mb-1">
        <Plus className="h-3 w-3" />
        Add Node
      </div>
      {nodeTemplates.map((template) => (
        <Tooltip key={template.type}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-2 hover:bg-secondary/50"
              onClick={() => handleAddNode(template)}
            >
              <template.icon className={`h-4 w-4 ${template.color}`} />
              <span className="text-sm">{template.label}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add {template.label} Node</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
