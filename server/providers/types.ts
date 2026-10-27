export interface ChatMessageInput {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GenerationOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

export interface ProviderResponse {
  text: string;
  latencyMs: number;
  model: string;
  provider: 'demo' | 'google-ai' | 'local';
  isSimulated: boolean;
}

export interface HealthCheckResult {
  isConnected: boolean;
  isDemo: boolean;
  provider: 'demo' | 'google-ai' | 'local';
  location: 'simulated' | 'remote' | 'local';
  requestedModel: string;
  configuredModel: string;
  connectedModel?: string;
  latencyMs?: number;
  statusMessage: string;
  verificationNote: string;
  details?: Record<string, unknown>;
}

export interface IAIProvider {
  id: 'demo' | 'google-ai' | 'local';
  name: string;
  checkHealth(configuredModel: string, endpoint?: string): Promise<HealthCheckResult>;
  generateChat(
    messages: ChatMessageInput[],
    personalityInstruction: string,
    personalityId: string,
    modelName: string,
    options?: GenerationOptions
  ): Promise<ProviderResponse>;
  generateStory(
    prompt: string,
    modelName: string,
    options?: GenerationOptions
  ): Promise<ProviderResponse>;
}
