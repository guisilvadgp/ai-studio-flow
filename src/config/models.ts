export type ModelTag = 'Vision' | 'Reasoning' | 'Search' | 'Code' | 'Audio In' | 'Audio Out';

export interface ModelInfo {
  id: string;
  name: string;
  pricing: string;
  tags: ModelTag[];
  description?: string;
}

export interface ModelCategory {
  type: 'image' | 'video' | 'text';
  label: string;
  icon: string;
  models: ModelInfo[];
}

export const IMAGE_MODELS: ModelInfo[] = [
  { id: 'flux', name: 'Flux Schnell', pricing: '0.0002/img', tags: [], description: 'Fast and efficient image generation' },
  { id: 'zimage', name: 'Z-Image Turbo', pricing: '0.0002/img', tags: [], description: 'Turbo speed image generation' },
  { id: 'turbo', name: 'SDXL Turbo', pricing: '0.0003/img', tags: [], description: 'Stable Diffusion XL Turbo' },
  { id: 'gptimage', name: 'GPT Image 1 Mini', pricing: '2.5/M img', tags: ['Vision'], description: 'GPT-powered image generation' },
  { id: 'gptimage-large', name: 'GPT Image 1.5', pricing: '8.0/M img', tags: ['Vision'], description: 'High quality GPT image generation' },
  { id: 'seedream', name: 'Seedream 4.0', pricing: '0.03/img', tags: ['Vision'], description: 'Advanced image synthesis' },
  { id: 'kontext', name: 'FLUX.1 Kontext', pricing: '0.04/img', tags: ['Vision'], description: 'Contextual image generation' },
  { id: 'nanobanana', name: 'NanoBanana', pricing: '0.3/M img', tags: ['Vision'], description: 'Compact vision model' },
  { id: 'seedream-pro', name: 'Seedream 4.5 Pro', pricing: '0.04/img', tags: ['Vision'], description: 'Professional Seedream model' },
  { id: 'nanobanana-pro', name: 'NanoBanana Pro', pricing: '1.25/M img', tags: ['Vision'], description: 'Pro vision model' },
];

export const VIDEO_MODELS: ModelInfo[] = [
  { id: 'seedance-pro', name: 'Seedance Pro-Fast', pricing: '1.0/M', tags: ['Vision'], description: 'Fast video generation with image input' },
  { id: 'seedance', name: 'Seedance Lite', pricing: '1.8/M', tags: ['Vision'], description: 'Lightweight video generation' },
  { id: 'veo', name: 'Veo 3.1 Fast', pricing: '0.150/sec', tags: ['Vision'], description: 'Text-to-video generation' },
];

export const TEXT_MODELS: ModelInfo[] = [
  { id: 'nova-micro', name: 'Amazon Nova Micro', pricing: 'Low', tags: [], description: 'Fast lightweight model' },
  { id: 'qwen-coder', name: 'Qwen3 Coder 30B', pricing: 'Medium', tags: ['Code'], description: 'Code-focused model' },
  { id: 'mistral', name: 'Mistral Small 3.2 24B', pricing: 'Medium', tags: [], description: 'Balanced performance' },
  { id: 'gemini-fast', name: 'Google Gemini 2.5 Flash Lite', pricing: 'Low', tags: ['Vision', 'Search', 'Code', 'Audio In'], description: 'Fast multimodal model' },
  { id: 'openai-fast', name: 'OpenAI GPT-5 Nano', pricing: 'Low', tags: ['Vision', 'Code'], description: 'Fast GPT model' },
  { id: 'grok', name: 'xAI Grok 4 Fast', pricing: 'Medium', tags: ['Code'], description: 'xAI flagship fast' },
  { id: 'openai', name: 'OpenAI GPT-5 Mini', pricing: 'Medium', tags: ['Vision', 'Code'], description: 'Balanced GPT model' },
  { id: 'perplexity-fast', name: 'Perplexity Sonar', pricing: 'Medium', tags: ['Search'], description: 'Search-enabled model' },
  { id: 'gemini', name: 'Google Gemini 3 Flash', pricing: 'Medium', tags: ['Vision', 'Audio In', 'Search', 'Code'], description: 'Powerful multimodal' },
  { id: 'gemini-search', name: 'Google Gemini 3 Flash Search', pricing: 'Medium', tags: ['Search'], description: 'Search-optimized Gemini' },
  { id: 'chickytutor', name: 'ChickyTutor', pricing: 'Low', tags: [], description: 'Educational assistant' },
  { id: 'minimax', name: 'MiniMax M2.1', pricing: 'Medium', tags: ['Reasoning'], description: 'Reasoning-focused model' },
  { id: 'claude-fast', name: 'Anthropic Claude Haiku 4.5', pricing: 'Medium', tags: ['Vision'], description: 'Fast Claude model' },
  { id: 'deepseek', name: 'DeepSeek V3.2', pricing: 'Medium', tags: ['Reasoning'], description: 'Deep reasoning model' },
  { id: 'glm', name: 'Z.ai GLM-4.7', pricing: 'Medium', tags: ['Reasoning', 'Code'], description: 'GLM reasoning model' },
  { id: 'kimi-k2-thinking', name: 'Moonshot Kimi K2 Thinking', pricing: 'High', tags: ['Reasoning'], description: 'Advanced reasoning' },
  { id: 'midijourney', name: 'MIDIjourney', pricing: 'Medium', tags: [], description: 'Audio/Music generation' },
  { id: 'claude', name: 'Anthropic Claude Sonnet 4.5', pricing: 'High', tags: ['Vision'], description: 'Powerful Claude model' },
  { id: 'claude-large', name: 'Anthropic Claude Opus 4.5', pricing: 'High', tags: ['Vision'], description: 'Most capable Claude' },
  { id: 'perplexity-reasoning', name: 'Perplexity Sonar Reasoning', pricing: 'High', tags: ['Reasoning', 'Search'], description: 'Reasoning with search' },
  { id: 'gemini-large', name: 'Google Gemini 3 Pro', pricing: 'High', tags: ['Vision', 'Audio In', 'Reasoning', 'Search'], description: 'Pro Gemini model' },
  { id: 'openai-large', name: 'OpenAI GPT-5.2', pricing: 'High', tags: ['Vision', 'Reasoning'], description: 'Top-tier GPT model' },
  { id: 'openai-audio', name: 'OpenAI GPT-4o Mini Audio', pricing: 'Medium', tags: ['Vision', 'Audio In', 'Audio Out'], description: 'Audio-capable GPT' },
];

export const MODEL_CATEGORIES: ModelCategory[] = [
  { type: 'text', label: 'Text / LLM', icon: 'MessageSquare', models: TEXT_MODELS },
  { type: 'image', label: 'Image', icon: 'Image', models: IMAGE_MODELS },
  { type: 'video', label: 'Video', icon: 'Video', models: VIDEO_MODELS },
];

export const getModelById = (id: string): ModelInfo | undefined => {
  return [...TEXT_MODELS, ...IMAGE_MODELS, ...VIDEO_MODELS].find(m => m.id === id);
};

export const getModelsByType = (type: 'image' | 'video' | 'text'): ModelInfo[] => {
  switch (type) {
    case 'image': return IMAGE_MODELS;
    case 'video': return VIDEO_MODELS;
    case 'text': return TEXT_MODELS;
  }
};
