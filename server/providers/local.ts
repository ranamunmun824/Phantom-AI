import { IAIProvider, HealthCheckResult, ProviderResponse, ChatMessageInput, GenerationOptions } from './types.js';

export class LocalOllamaProvider implements IAIProvider {
  id = 'local' as const;
  name = 'Local Open-Weight Inference (Ollama / Local API)';

  private getEndpoint(customEndpoint?: string): string {
    return (
      customEndpoint ||
      process.env.LOCAL_INFERENCE_ENDPOINT ||
      process.env.OLLAMA_BASE_URL ||
      'http://localhost:11434'
    ).replace(/\/$/, '');
  }

  async checkHealth(configuredModel: string, customEndpoint?: string): Promise<HealthCheckResult> {
    const endpoint = this.getEndpoint(customEndpoint);
    const start = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      // Check Ollama tags endpoint
      const res = await fetch(`${endpoint}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const latencyMs = Date.now() - start;

      if (!res.ok) {
        return {
          isConnected: false,
          isDemo: false,
          provider: 'local',
          location: 'local',
          requestedModel: 'Gemma 4',
          configuredModel: configuredModel || 'gemma2:9b',
          latencyMs,
          statusMessage: `Local runtime responded with HTTP ${res.status}: ${res.statusText}`,
          verificationNote:
            'The local inference server was reached but returned an error status. Verify Ollama or local engine status.',
        };
      }

      const data = (await res.json()) as { models?: Array<{ name: string; size: number }> };
      const installedModels = data.models?.map((m) => m.name) || [];
      const targetModel = configuredModel || 'gemma2:9b';

      const isModelInstalled = installedModels.some(
        (m) => m === targetModel || m.startsWith(targetModel)
      );

      return {
        isConnected: true,
        isDemo: false,
        provider: 'local',
        location: 'local',
        requestedModel: 'Gemma 4',
        configuredModel: targetModel,
        connectedModel: targetModel,
        latencyMs,
        statusMessage: isModelInstalled
          ? `Connected to local runtime at ${endpoint}. Model '${targetModel}' is downloaded and ready for local inference.`
          : `Connected to local runtime at ${endpoint}, but model '${targetModel}' is not yet downloaded. Run 'ollama pull ${targetModel}'. Available: [${installedModels.join(', ') || 'none'}]`,
        verificationNote:
          targetModel.toLowerCase().includes('gemma 4') || targetModel.toLowerCase().includes('gemma4')
            ? 'Note: Gemma 4 has not been published or released. To run open-weight Gemma locally, use Gemma 2: "ollama run gemma2:9b" or "ollama run gemma2:2b".'
            : `Using local open-weight model: ${targetModel}. All inference executes entirely on your hardware with 0 external network requests.`,
        details: {
          endpoint,
          installedModels,
          isModelInstalled,
        },
      };
    } catch (err: unknown) {
      const latencyMs = Date.now() - start;
      const errorMsg = err instanceof Error ? err.message : String(err);

      return {
        isConnected: false,
        isDemo: false,
        provider: 'local',
        location: 'local',
        requestedModel: 'Gemma 4',
        configuredModel: configuredModel || 'gemma2:9b',
        latencyMs,
        statusMessage: `Cannot connect to local inference runtime at ${endpoint}. (Error: ${errorMsg}). To run locally: 1. Install Ollama from ollama.com. 2. Run 'ollama run gemma2:9b'. 3. Refresh connection.`,
        verificationNote:
          'Local inference cannot be claimed as active until Ollama or a local runtime is running and reachable. Use Demo Mode or Google AI hosted inference until your local runtime is online.',
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
    const endpoint = this.getEndpoint();
    const targetModel = modelName || 'gemma2:9b';
    const start = Date.now();

    const formattedMessages = [
      { role: 'system', content: personalityInstruction },
      ...messages,
    ];

    try {
      const res = await fetch(`${endpoint}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: targetModel,
          messages: formattedMessages,
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.8,
            num_predict: options?.maxTokens ?? 1024,
            top_p: options?.topP ?? 0.9,
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Local inference server error (${res.status}): ${errorText}`);
      }

      const data = (await res.json()) as { message?: { content: string } };
      const text = data.message?.content || '[Empty response from local model]';
      const latencyMs = Date.now() - start;

      return {
        text,
        latencyMs,
        model: targetModel,
        provider: 'local',
        isSimulated: false,
      };
    } catch (err) {
      throw new Error(
        `Failed to reach local inference server at ${endpoint}. Please ensure Ollama is running ('ollama serve') with model '${targetModel}'. Error: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  async generateStory(
    prompt: string,
    modelName: string,
    options?: GenerationOptions
  ): Promise<ProviderResponse> {
    const endpoint = this.getEndpoint();
    const targetModel = modelName || 'gemma2:9b';
    const start = Date.now();

    try {
      const res = await fetch(`${endpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: targetModel,
          system:
            'You are an award-winning horror author and dark literary master. Craft evocative, terrifying, deeply atmospheric prose. Avoid cheap gore; focus on creeping dread, psychological resonance, and unsettling gothic mystery.',
          prompt,
          stream: false,
          options: {
            temperature: options?.temperature ?? 0.85,
            num_predict: options?.maxTokens ?? 2048,
          },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Local inference server error (${res.status}): ${errorText}`);
      }

      const data = (await res.json()) as { response?: string };
      const text = data.response || '[Empty story generated by local model]';
      const latencyMs = Date.now() - start;

      return {
        text,
        latencyMs,
        model: targetModel,
        provider: 'local',
        isSimulated: false,
      };
    } catch (err) {
      throw new Error(
        `Failed to communicate with local model '${targetModel}' at ${endpoint}. Error: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }
}
