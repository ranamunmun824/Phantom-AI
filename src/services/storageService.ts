import { MemoryCard, StoryResult, ChatMessage, AppConfig } from '../types';

const STORAGE_KEYS = {
  MEMORIES: 'phantom_ai_memories_v1',
  SAVED_STORIES: 'phantom_ai_stories_v1',
  CHAT_MESSAGES: 'phantom_ai_chat_v1',
  CONFIG: 'phantom_ai_config_v1',
};

const DEFAULT_MEMORIES: MemoryCard[] = [
  {
    id: 'sample_remembrance_1',
    displayName: 'Abuela Rosa',
    relationship: 'Grandmother',
    story:
      'She kept a ceramic jar of anise cookies in the highest pantry shelf and hummed boleros while sewing quilts. Whenever lightning flashed across the desert hills, she made hot cinnamon tea and taught us not to fear the storm.',
    favoriteFood: 'Fresh anise cookies & cinnamon tea',
    favoriteSong: 'Sabor a Mí',
    meaningfulQuote: '“Do not fear the dark outside, my child; carry a little lantern in your heart.”',
    personalMessage: 'Every autumn when the wind stirs the chimes on the porch, we remember your warmth.',
    dateOrOccasion: 'Remembered on Día de los Muertos, 2026',
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 'sample_remembrance_2',
    displayName: 'Kenji & Barnaby',
    relationship: 'Old friend & faithful retriever',
    story:
      'Kenji spent forty years repairing tube radios and mechanical clocks in a small shop on Pine Street. His golden retriever, Barnaby, lay by the potbelly stove, thumping his tail whenever a bell chime rang true.',
    favoriteFood: 'Grilled sea bass & green tea',
    favoriteSong: 'Take Five by Dave Brubeck',
    meaningfulQuote: '“Things made with honest patience keep ticking long after the maker rests.”',
    personalMessage: 'The workshop clocks still tick in cadence. Your craftsmanship lives on.',
    dateOrOccasion: 'Spring Equinox',
    createdAt: Date.now() - 86400000 * 12,
    updatedAt: Date.now() - 86400000 * 12,
  },
];

export class StorageService {
  // Memories (Digital Memory Vault)
  static getMemories(): MemoryCard[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(DEFAULT_MEMORIES));
        return DEFAULT_MEMORIES;
      }
      return JSON.parse(data);
    } catch (err) {
      console.warn('Could not read memories from localStorage:', err);
      return DEFAULT_MEMORIES;
    }
  }

  static saveMemory(card: Omit<MemoryCard, 'id' | 'createdAt' | 'updatedAt'>, existingId?: string): MemoryCard {
    const list = this.getMemories();
    const now = Date.now();

    if (existingId) {
      const idx = list.findIndex((m) => m.id === existingId);
      if (idx !== -1) {
        const updated: MemoryCard = {
          ...list[idx],
          ...card,
          updatedAt: now,
        };
        list[idx] = updated;
        localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(list));
        return updated;
      }
    }

    const newCard: MemoryCard = {
      ...card,
      id: `mem_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    list.unshift(newCard);
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(list));
    return newCard;
  }

  static deleteMemory(id: string): boolean {
    const list = this.getMemories().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(list));
    return true;
  }

  static exportMemoriesJson(): string {
    const list = this.getMemories();
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        application: 'PHANTOM AI - Digital Memory Vault',
        disclaimer:
          'This archive preserves personal remembrances locally. It does not recreate or contact deceased people.',
        memories: list,
      },
      null,
      2
    );
  }

  static exportMemoryCardText(card: MemoryCard): string {
    return `========================================================
DIGITAL REMEMBRANCE CARD — PHANTOM AI MEMORY VAULT
========================================================
In Loving Memory of: ${card.displayName}
${card.relationship ? `Relationship: ${card.relationship}\n` : ''}${card.dateOrOccasion ? `Occasion / Date: ${card.dateOrOccasion}\n` : ''}
--- STORY & MEMORY ---
${card.story}

${card.favoriteFood ? `Favorite Food: ${card.favoriteFood}\n` : ''}${card.favoriteSong ? `Favorite Song / Music: ${card.favoriteSong}\n` : ''}${card.meaningfulQuote ? `Meaningful Words: ${card.meaningfulQuote}\n` : ''}
--- PERSONAL MESSAGE ---
${card.personalMessage}

========================================================
Preserved on: ${new Date(card.createdAt).toLocaleDateString()}
"This space preserves the stories we choose to remember.
It does not recreate or contact the people we miss."
========================================================`;
  }

  // Saved Stories
  static getSavedStories(): StoryResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_STORIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveStory(story: StoryResult): void {
    const list = this.getSavedStories().filter((s) => s.id !== story.id);
    list.unshift(story);
    localStorage.setItem(STORAGE_KEYS.SAVED_STORIES, JSON.stringify(list));
  }

  static deleteStory(id: string): void {
    const list = this.getSavedStories().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAVED_STORIES, JSON.stringify(list));
  }

  // Chat History
  static getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveChatMessages(messages: ChatMessage[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    } catch (err) {
      console.warn('Failed to save chat to localStorage:', err);
    }
  }

  static clearChatMessages(): void {
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
  }

  // App Configuration
  static getConfig(): AppConfig {
    const defaultConf: AppConfig = {
      provider: 'demo',
      modelName: 'gemma-2-9b-it',
      localEndpoint: 'http://localhost:11434',
      temperature: 0.8,
      maxTokens: 1024,
      saveChatHistory: true,
      audioEnabled: false,
    };
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONFIG);
      return data ? { ...defaultConf, ...JSON.parse(data) } : defaultConf;
    } catch {
      return defaultConf;
    }
  }

  static saveConfig(conf: Partial<AppConfig>): AppConfig {
    const current = this.getConfig();
    const updated = { ...current, ...conf };
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated));
    return updated;
  }

  // Full Backup Export / Import
  static exportFullBackup(): string {
    return JSON.stringify(
      {
        backupDate: new Date().toISOString(),
        version: '1.0.0',
        memories: this.getMemories(),
        savedStories: this.getSavedStories(),
        config: this.getConfig(),
      },
      null,
      2
    );
  }

  static importBackup(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.memories)) {
        localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(parsed.memories));
      }
      if (Array.isArray(parsed.savedStories)) {
        localStorage.setItem(STORAGE_KEYS.SAVED_STORIES, JSON.stringify(parsed.savedStories));
      }
      if (parsed.config) {
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(parsed.config));
      }
      return { success: true, message: 'Archive backup imported successfully.' };
    } catch (err) {
      return {
        success: false,
        message: `Invalid archive file: ${err instanceof Error ? err.message : String(err)}`,
      };
    }
  }

  static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.MEMORIES);
    localStorage.removeItem(STORAGE_KEYS.SAVED_STORIES);
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.CONFIG);
  }
}
