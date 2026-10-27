import { ChatMessage, ModelInfo, StoryParams, StoryResult } from '../types';
import { getDemoChatResponse, DEMO_STORIES } from '../utils/demoData';

export interface HealthResponse extends ModelInfo {
  connectedModel?: string;
}

export class ApiClient {
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!res.ok) {
      let errorMsg = `Server error ${res.status}`;
      try {
        const body = await res.json();
        if (body.error) errorMsg = body.error;
      } catch {
        // fallback to status text
      }
      throw new Error(errorMsg);
    }

    return res.json() as Promise<T>;
  }

  static async getHealth(): Promise<HealthResponse> {
    try {
      return await this.request<HealthResponse>('/health');
    } catch {
      // Graceful fallback to client-side demo mode if backend is booting
      return {
        requestedModel: 'Gemma 4',
        configuredModel: 'Simulated Ghost Engine (Offline Fallback)',
        activeProvider: 'demo',
        location: 'simulated',
        isConnected: true,
        isDemo: true,
        statusMessage: 'Offline client fallback active. Running in local simulated mode.',
        verificationNote: 'Gemma 4 is an unreleased model; Demo mode active.',
        latencyMs: 10,
      };
    }
  }

  static async getConfig() {
    return this.request<{
      provider: 'demo' | 'google-ai' | 'local';
      modelName: string;
      localEndpoint: string;
      requestedModel: string;
      lastUsedModel: string;
      lastLatencyMs: number;
    }>('/config');
  }

  static async updateConfig(params: {
    provider?: 'demo' | 'google-ai' | 'local';
    modelName?: string;
    localEndpoint?: string;
  }) {
    return this.request<{
      provider: 'demo' | 'google-ai' | 'local';
      modelName: string;
      localEndpoint: string;
      requestedModel: string;
      lastUsedModel: string;
      lastLatencyMs: number;
    }>('/config/update', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  static async testConnection(provider: string, modelName?: string, endpoint?: string) {
    return this.request<HealthResponse>('/config/test', {
      method: 'POST',
      body: JSON.stringify({ provider, modelName, endpoint }),
    });
  }

  static async sendChatMessage(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    personalityInstruction: string,
    personalityId: string,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<{
    text: string;
    latencyMs: number;
    model: string;
    provider: 'demo' | 'google-ai' | 'local';
    isSimulated: boolean;
  }> {
    try {
      return await this.request('/chat', {
        method: 'POST',
        body: JSON.stringify({
          messages,
          personalityInstruction,
          personalityId,
          ...options,
        }),
      });
    } catch (err) {
      console.warn('API chat failed, falling back to client demo response:', err);
      const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
      return {
        text: getDemoChatResponse(personalityId as any, lastUserMsg),
        latencyMs: 35,
        model: 'Simulated Ghost Engine (Fallback)',
        provider: 'demo',
        isSimulated: true,
      };
    }
  }

  static async generateStory(
    params: StoryParams,
    options?: { temperature?: number; maxTokens?: number }
  ): Promise<StoryResult> {
    try {
      const res = await this.request<{
        text: string;
        latencyMs: number;
        model: string;
        provider: 'demo' | 'google-ai' | 'local';
        isSimulated: boolean;
        wordCount: number;
        title: string;
      }>('/stories/generate', {
        method: 'POST',
        body: JSON.stringify({ ...params, ...options }),
      });

      return {
        id: `story_${Date.now()}`,
        title: res.title || params.title || 'Untitled Haunting',
        content: res.text,
        params,
        createdAt: Date.now(),
        isSimulated: res.isSimulated,
        provider: res.provider,
        model: res.model,
        latencyMs: res.latencyMs,
        wordCount: res.wordCount,
      };
    } catch (err) {
      console.warn('API story generation failed, using demo story fallback:', err);
      const demoText = DEMO_STORIES[params.length] || DEMO_STORIES.short;
      return {
        id: `story_${Date.now()}`,
        title: params.title || 'The Signal in the Silicon',
        content: demoText,
        params,
        createdAt: Date.now(),
        isSimulated: true,
        provider: 'demo',
        model: 'Simulated Ghost Engine (Fallback)',
        latencyMs: 40,
        wordCount: demoText.split(/\s+/).filter(Boolean).length,
      };
    }
  }

  static async continueStory(
    currentStory: string,
    action: 'continue' | 'change_ending' | 'scarier' | 'mysterious',
    instructions?: string
  ): Promise<{
    text: string;
    latencyMs: number;
    model: string;
    provider: 'demo' | 'google-ai' | 'local';
    isSimulated: boolean;
    wordCount: number;
  }> {
    return this.request('/stories/continue', {
      method: 'POST',
      body: JSON.stringify({ currentStory, action, instructions }),
    });
  }

  static async executeTerminalCommand(command: string): Promise<{
    output: string;
    isError?: boolean;
    isAiGenerated?: boolean;
    modelUsed?: string;
  }> {
    return this.request('/terminal/command', {
      method: 'POST',
      body: JSON.stringify({ command }),
    });
  }
}
