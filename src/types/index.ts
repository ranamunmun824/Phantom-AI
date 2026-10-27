export type InferenceProvider = 'demo' | 'google-ai' | 'local';

export type InferenceLocation = 'simulated' | 'remote' | 'local';

export interface ModelInfo {
  requestedModel: string; // e.g. "Gemma 4"
  configuredModel: string; // e.g. "gemma-2-9b-it" or "gemma2:9b"
  activeProvider: InferenceProvider;
  location: InferenceLocation;
  isConnected: boolean;
  isDemo: boolean;
  statusMessage: string;
  latencyMs?: number;
  lastUsedModel?: string;
  hardwareRequirementsNote?: string;
  verificationNote: string;
}

export type PersonalityId =
  | 'phantom'
  | 'archivist'
  | 'coder'
  | 'watcher'
  | 'spirit'
  | 'oracle';

export interface Personality {
  id: PersonalityId;
  name: string;
  title: string;
  description: string;
  greeting: string;
  systemInstruction: string;
  samplePrompts: string[];
  accentColor: string; // Tailwind color class or hex
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  personalityId?: PersonalityId;
  isSimulated?: boolean;
  provider?: InferenceProvider;
  model?: string;
  latencyMs?: number;
}

export type HorrorSubgenre =
  | 'psychological'
  | 'supernatural'
  | 'gothic'
  | 'cosmic'
  | 'haunted_tech'
  | 'abandoned_internet'
  | 'old_computers'
  | 'folklore';

export type StoryLength = 'flash' | 'short' | 'extended';

export type FearIntensity = 'whispers' | 'creeping_dread' | 'eldritch' | 'digital_terror';

export type NarrativePerspective =
  | 'first_person'
  | 'second_person'
  | 'third_limited'
  | 'omniscient';

export type EndingType =
  | 'unexpected_twist'
  | 'open'
  | 'bittersweet'
  | 'dark'
  | 'hopeful';

export interface StoryParams {
  title: string;
  character: string;
  setting: string;
  subgenre: HorrorSubgenre;
  length: StoryLength;
  fearIntensity: FearIntensity;
  perspective: NarrativePerspective;
  ending: EndingType;
  keywords: string;
}

export interface StoryResult {
  id: string;
  title: string;
  content: string;
  params: StoryParams;
  createdAt: number;
  isSimulated: boolean;
  provider: InferenceProvider;
  model: string;
  latencyMs?: number;
  wordCount: number;
}

export interface TerminalEntry {
  id: string;
  command: string;
  output: string;
  timestamp: number;
  isError?: boolean;
  isAiGenerated?: boolean;
  modelUsed?: string;
}

export interface MemoryCard {
  id: string;
  displayName: string;
  relationship?: string;
  story: string;
  favoriteFood: string;
  favoriteSong: string;
  meaningfulQuote: string;
  personalMessage: string;
  dateOrOccasion: string;
  createdAt: number;
  updatedAt: number;
}

export interface AppConfig {
  provider: InferenceProvider;
  modelName: string;
  localEndpoint: string;
  temperature: number;
  maxTokens: number;
  saveChatHistory: boolean;
  audioEnabled: boolean;
}
