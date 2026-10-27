import { GoogleGenAI } from '@google/genai';
import { IAIProvider, HealthCheckResult, ProviderResponse, ChatMessageInput, GenerationOptions } from './types.js';

export class GoogleAIProvider implements IAIProvider {
  id = 'google-ai' as const;
  name = 'Google AI API (Gemma / Gemini)';

  private getClient(): GoogleGenAI | null {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  }

  async checkHealth(configuredModel: string): Promise<HealthCheckResult> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        isConnected: false,
        isDemo: false,
        provider: 'google-ai',
        location: 'remote',
        requestedModel: 'Gemma 4',
        configuredModel: configuredModel || 'gemma-2-9b-it',
        statusMessage:
          'GEMINI_API_KEY is not configured in the environment. Set GEMINI_API_KEY to enable Google AI hosted inference, or switch to Demo Mode.',
        verificationNote:
          'Gemma 4 was requested. Google\'s current Gemma models include Gemma 1 & Gemma 2 (e.g., gemma-2-9b-it, gemma-2-27b-it). Gemma 4 is not released.',
      };
    }

    const start = Date.now();
    try {
      const client = new GoogleGenAI({ apiKey });
      const targetModel = configuredModel || 'gemini-3.8-flash';

      // Fast timeout for health check
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Google AI ping timed out')), 3500)
      );

      // Test connection with a fast minimal ping
      const res = await Promise.race([
        client.models.generateContent({
          model: targetModel,
          contents: 'Ping. Reply with "PONG".',
        }),
        timeoutPromise,
      ]);

      const latencyMs = Date.now() - start;
      const text = res.text?.trim() || 'Connected';

      return {
        isConnected: true,
        isDemo: false,
        provider: 'google-ai',
        location: 'remote',
        requestedModel: 'Gemma 4',
        configuredModel: targetModel,
        connectedModel: targetModel,
        latencyMs,
        statusMessage: `Successfully connected to Google AI inference (${targetModel}) in ${latencyMs}ms. Response: ${text.slice(0, 30)}`,
        verificationNote:
          targetModel === 'Gemma 4'
            ? 'Warning: Gemma 4 is unreleased. The API returned an error if this was called.'
            : `Active model '${targetModel}' verified and functioning via Google AI API.`,
      };
    } catch (err: unknown) {
      const latencyMs = Date.now() - start;
      const errorMsg = err instanceof Error ? err.message : String(err);

      return {
        isConnected: false,
        isDemo: false,
        provider: 'google-ai',
        location: 'remote',
        requestedModel: 'Gemma 4',
        configuredModel: configuredModel || 'gemma-2-9b-it',
        latencyMs,
        statusMessage: `Google AI health check failed: ${errorMsg}`,
        verificationNote:
          'If model "Gemma 4" was requested, note that Google has only released Gemma 1 & 2. Please configure a supported model such as "gemma-2-9b-it" or "gemini-3.8-flash".',
      };
    }
  }

  async generateChat(
    messages: ChatMessageInput[],
    personalityInstruction: string,
    _personalityId: string,
    modelName: string,
    options?: GenerationOptions
  ): Promise<ProviderResponse> {
    const client = this.getClient();
    if (!client) {
      throw new Error(
        'Google AI provider is active, but GEMINI_API_KEY is missing from environment. Please configure an API key or use Demo Mode.'
      );
    }

    const targetModel = modelName || 'gemini-3.8-flash';
    const start = Date.now();

    const formattedContents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await client.models.generateContent({
      model: targetModel,
      contents: formattedContents,
      config: {
        systemInstruction: personalityInstruction,
        temperature: options?.temperature ?? 0.8,
        maxOutputTokens: options?.maxTokens ?? 1024,
      },
    });

    const latencyMs = Date.now() - start;
    const text = response.text || '[Empty response received from model]';

    return {
      text,
      latencyMs,
      model: targetModel,
      provider: 'google-ai',
      isSimulated: false,
    };
  }

  async generateStory(
    prompt: string,
    modelName: string,
    options?: GenerationOptions
  ): Promise<ProviderResponse> {
    const client = this.getClient();
    if (!client) {
      throw new Error(
        'Google AI provider is active, but GEMINI_API_KEY is missing from environment. Please configure an API key or switch to Demo Mode.'
      );
    }

    const targetModel = modelName || 'gemini-3.8-flash';
    const start = Date.now();

    const response = await client.models.generateContent({
      model: targetModel,
      contents: prompt,
      config: {
        systemInstruction:
          'You are an award-winning horror author and dark literary master. Craft evocative, terrifying, deeply atmospheric prose. Avoid cheap gore; focus on creeping dread, psychological resonance, and unsettling gothic and cosmic mystery.',
        temperature: options?.temperature ?? 0.85,
        maxOutputTokens: options?.maxTokens ?? 2048,
      },
    });

    const latencyMs = Date.now() - start;
    const text = response.text || '[Empty story received from model]';

    return {
      text,
      latencyMs,
      model: targetModel,
      provider: 'google-ai',
      isSimulated: false,
    };
  }
}
