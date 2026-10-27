import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { DemoProvider } from '../../server/providers/demo';
import { aiManager } from '../../server/services/aiManager';
import { StorageService } from '../services/storageService';
import { getDemoChatResponse } from '../utils/demoData';

// Polyfill localStorage for node test runner
class LocalStorageMock {
  private store: Record<string, string> = {};
  clear() {
    this.store = {};
  }
  getItem(key: string) {
    return this.store[key] || null;
  }
  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }
  removeItem(key: string) {
    delete this.store[key];
  }
}

describe('PHANTOM AI - Test Suite', () => {
  beforeAll(() => {
    if (typeof globalThis.localStorage === 'undefined') {
      (globalThis as unknown as { localStorage: LocalStorageMock }).localStorage = new LocalStorageMock();
    }
  });

  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  describe('1. Provider Selection & Verification', () => {
    it('initializes with a valid registered provider', () => {
      const provider = aiManager.getActiveProvider();
      expect(provider).toBeDefined();
      expect(['demo', 'google-ai', 'local']).toContain(provider.id);
    });

    it('returns honest Gemma 4 verification notes without claiming false availability', async () => {
      const demo = new DemoProvider();
      const health = await demo.checkHealth('Simulated Ghost Engine');
      expect(health.requestedModel).toBe('Gemma 4');
      expect(health.verificationNote).toContain('Gemma 4');
      expect(health.verificationNote).toContain('Gemma 1');
    });

    it('allows updating provider configuration cleanly', () => {
      const updated = aiManager.updateConfig({
        provider: 'demo',
        modelName: 'gemma-2-9b-it',
      });
      expect(updated.provider).toBe('demo');
      expect(updated.modelName).toBe('gemma-2-9b-it');
    });
  });

  describe('2. Demo-Mode Behavior', () => {
    it('returns simulated chat responses with isSimulated flag true', async () => {
      const demo = new DemoProvider();
      const res = await demo.generateChat(
        [{ role: 'user', content: 'Tell me what happened at 3:17 AM.' }],
        'You are the phantom.',
        'phantom',
        'Simulated Ghost Engine'
      );
      expect(res.isSimulated).toBe(true);
      expect(res.text).toContain('3:17 AM');
      expect(res.provider).toBe('demo');
    });

    it('matches persona-specific fallback responses in client demo dictionary', () => {
      const phantomRes = getDemoChatResponse('phantom', '3:17 AM');
      expect(phantomRes).toContain('3:17 AM');

      const coderRes = getDemoChatResponse('coder', 'write memory leak');
      expect(coderRes).toContain('#include <phantom.h>');
    });

    it('generates rich horror stories in demo mode', async () => {
      const demo = new DemoProvider();
      const story = await demo.generateStory('Flash fiction about old computers', 'Simulated Ghost Engine');
      expect(story.isSimulated).toBe(true);
      expect(story.text.length).toBeGreaterThan(100);
      expect(story.provider).toBe('demo');
    });
  });

  describe('3. Simulated Terminal Command Handling & Security', () => {
    it('handles "help" command safely without shell execution', async () => {
      const res = await aiManager.executeSimulatedCommand('help');
      expect(res.output).toContain('PHANTOM AI — Simulated Terminal Kernel');
      expect(res.output.toLowerCase()).toContain('zero host shell access');
      expect(res.output).toContain('summon');
    });

    it('handles "whoami" command returning fictional haunted identity', async () => {
      const res = await aiManager.executeSimulatedCommand('whoami');
      expect(res.output).toContain('UID: 0000 (ghost)');
      expect(res.output).toContain('The Resident in Sector 4');
    });

    it('handles "ls" and "cat" for simulated files', async () => {
      const ls = await aiManager.executeSimulatedCommand('ls');
      expect(ls.output).toContain('manifest.txt');

      const cat = await aiManager.executeSimulatedCommand('cat manifest.txt');
      expect(cat.output).toContain('PROJECT PHANTOM');
    });

    it('returns safe error for nonexistent command without crashing or running arbitrary bash', async () => {
      const res = await aiManager.executeSimulatedCommand('rm -rf /');
      expect(res.isError).toBe(true);
      expect(res.output).toContain('command not found');
    });
  });

  describe('4. Local Storage Operations (Digital Memory Vault & Stories)', () => {
    it('saves, reads, and deletes memory cards in local storage', () => {
      const card = StorageService.saveMemory({
        displayName: 'Professor Vance',
        relationship: 'Archaeology Mentor',
        story: 'Collected mechanical cipher machines.',
        favoriteFood: 'Earl Grey tea',
        favoriteSong: 'Gymnopédie No. 1',
        meaningfulQuote: 'Keep the past alive.',
        personalMessage: 'Rest in peace.',
        dateOrOccasion: 'Winter Solstice',
      });

      expect(card.id).toBeDefined();
      expect(card.displayName).toBe('Professor Vance');

      const memories = StorageService.getMemories();
      expect(memories.some((m) => m.displayName === 'Professor Vance')).toBe(true);

      StorageService.deleteMemory(card.id);
      const afterDelete = StorageService.getMemories();
      expect(afterDelete.some((m) => m.id === card.id)).toBe(false);
    });

    it('formats a respectful remembrance card text export', () => {
      const card = {
        id: 'test_1',
        displayName: 'Arthur',
        relationship: 'Brother',
        story: 'Loved stargazing on summer nights.',
        favoriteFood: 'Fresh cherries',
        favoriteSong: 'Clair de Lune',
        meaningfulQuote: 'Look up.',
        personalMessage: 'You are missed.',
        dateOrOccasion: 'Perseids Meteor Shower',
        createdAt: 1700000000000,
        updatedAt: 1700000000000,
      };

      const text = StorageService.exportMemoryCardText(card);
      expect(text).toContain('Arthur');
      expect(text).toContain('Clair de Lune');
      expect(text).toContain('This space preserves the stories we choose to remember.');
    });
  });

  describe('5. Error Handling for Unavailable Providers', () => {
    it('handles connection test failures gracefully without throwing unhandled exceptions', async () => {
      // Test local provider with an unreachable port
      const result = await aiManager.testConnection('local', 'gemma2:9b', 'http://127.0.0.1:59999');
      expect(result.isConnected).toBe(false);
      expect(result.statusMessage).toContain('Cannot connect');
    });
  });
});
