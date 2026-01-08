import { PromptNode } from './PromptNode';
import { LLMNode } from './LLMNode';
import { ImageGeneratorNode } from './ImageGeneratorNode';
import { VideoDirectorNode } from './VideoDirectorNode';
import { DisplayNode } from './DisplayNode';

export const nodeTypes = {
  prompt: PromptNode,
  llm: LLMNode,
  imageGenerator: ImageGeneratorNode,
  videoDirector: VideoDirectorNode,
  display: DisplayNode,
};
