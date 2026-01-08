const API_BASE = 'https://gen.pollinations.ai';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } }>;
}

export interface TextGenerationOptions {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface ImageGenerationOptions {
  prompt: string;
  model?: string;
  width?: number;
  height?: number;
  seed?: number;
}

export interface VideoGenerationOptions {
  prompt: string;
  model?: string;
  imageUrl?: string;
}

class PollinationsClient {
  private getApiKey(): string | null {
    return localStorage.getItem('pollinations_api_key');
  }

  private getAuthHeaders(): HeadersInit {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('API key not configured. Please add your Pollinations API key in settings.');
    }
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  async generateText(options: TextGenerationOptions): Promise<string> {
    const response = await fetch(`${API_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        stream: false,
        temperature: options.temperature ?? 1,
        max_tokens: options.max_tokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }

  async *generateTextStream(options: TextGenerationOptions): AsyncGenerator<string> {
    const response = await fetch(`${API_BASE}/v1/chat/completions`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        stream: true,
        temperature: options.temperature ?? 1,
        max_tokens: options.max_tokens,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(error.error?.message || `API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) throw new Error('No response body');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // Skip malformed chunks
        }
      }
    }
  }

  generateImageUrl(options: ImageGenerationOptions): string {
    const apiKey = this.getApiKey();
    const params = new URLSearchParams();
    
    if (options.model) params.set('model', options.model);
    if (options.width) params.set('width', options.width.toString());
    if (options.height) params.set('height', options.height.toString());
    if (options.seed) params.set('seed', options.seed.toString());
    if (apiKey) params.set('key', apiKey);

    const encodedPrompt = encodeURIComponent(options.prompt);
    return `${API_BASE}/image/${encodedPrompt}?${params.toString()}`;
  }

  generateVideoUrl(options: VideoGenerationOptions): string {
    const apiKey = this.getApiKey();
    const params = new URLSearchParams();
    
    if (options.model) params.set('model', options.model);
    if (options.imageUrl) params.set('image', options.imageUrl);
    if (apiKey) params.set('key', apiKey);

    const encodedPrompt = encodeURIComponent(options.prompt);
    return `${API_BASE}/image/${encodedPrompt}?${params.toString()}`;
  }

  async validateApiKey(key: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/v1/models`, {
        headers: { 'Authorization': `Bearer ${key}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  isConfigured(): boolean {
    return !!this.getApiKey();
  }
}

export const pollinationsClient = new PollinationsClient();
