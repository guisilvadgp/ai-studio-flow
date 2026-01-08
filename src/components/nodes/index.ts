import { PromptNode } from './PromptNode';
import { LLMNode } from './LLMNode';
import { ImageGeneratorNode } from './ImageGeneratorNode';
import { ImageOutputNode } from './ImageOutputNode';
import { VideoDirectorNode } from './VideoDirectorNode';
import { DisplayNode } from './DisplayNode';

export const nodeTypes = {
  prompt: PromptNode,
  llm: LLMNode,
  imageGenerator: ImageGeneratorNode,
  imageOutput: ImageOutputNode,
  videoDirector: VideoDirectorNode,
  display: DisplayNode,
};
