import { DemoProvider } from '../providers/demo.js';
import { GoogleAIProvider } from '../providers/gemma.js';
import { LocalOllamaProvider } from '../providers/local.js';
import { IAIProvider, HealthCheckResult, ProviderResponse, ChatMessageInput, GenerationOptions } from '../providers/types.js';

class AIManager {
  private providers: Record<string, IAIProvider>;
  private activeProviderId: 'demo' | 'google-ai' | 'local';
  private configuredModel: string;
  private localEndpoint: string;
  private lastUsedModel: string;
  private lastLatencyMs: number;

  constructor() {
    this.providers = {
      demo: new DemoProvider(),
      'google-ai': new GoogleAIProvider(),
      local: new LocalOllamaProvider(),
    };

    // Auto-detect preferred provider
    if (process.env.AI_PROVIDER === 'google-ai' && process.env.GEMINI_API_KEY) {
      this.activeProviderId = 'google-ai';
    } else if (process.env.AI_PROVIDER === 'local') {
      this.activeProviderId = 'local';
    } else if (process.env.GEMINI_API_KEY) {
      this.activeProviderId = 'google-ai';
    } else {
      this.activeProviderId = 'demo';
    }

    this.configuredModel =
      process.env.GEMMA_MODEL ||
      process.env.MODEL_NAME ||
      (this.activeProviderId === 'local' ? 'gemma2:9b' : this.activeProviderId === 'google-ai' ? 'gemini-3.8-flash' : 'Simulated Ghost Engine');

    this.localEndpoint = process.env.LOCAL_INFERENCE_ENDPOINT || 'http://localhost:11434';
    this.lastUsedModel = this.configuredModel;
    this.lastLatencyMs = 15;
  }

  getActiveProvider(): IAIProvider {
    return this.providers[this.activeProviderId] || this.providers.demo;
  }

  getConfig() {
    return {
      provider: this.activeProviderId,
      modelName: this.configuredModel,
      localEndpoint: this.localEndpoint,
      requestedModel: 'Gemma 4',
      lastUsedModel: this.lastUsedModel,
      lastLatencyMs: this.lastLatencyMs,
    };
  }

  updateConfig(params: {
    provider?: 'demo' | 'google-ai' | 'local';
    modelName?: string;
    localEndpoint?: string;
  }) {
    if (params.provider && this.providers[params.provider]) {
      this.activeProviderId = params.provider;
    }
    if (params.modelName) {
      this.configuredModel = params.modelName.trim();
    }
    if (params.localEndpoint) {
      this.localEndpoint = params.localEndpoint.trim();
    }
    return this.getConfig();
  }

  async getHealth(): Promise<HealthCheckResult> {
    const provider = this.getActiveProvider();
    const result = await provider.checkHealth(this.configuredModel, this.localEndpoint);
    if (result.latencyMs !== undefined) {
      this.lastLatencyMs = result.latencyMs;
    }
    return result;
  }

  async testConnection(providerId: 'demo' | 'google-ai' | 'local', modelName?: string, endpoint?: string): Promise<HealthCheckResult> {
    const provider = this.providers[providerId];
    if (!provider) {
      throw new Error(`Unknown provider: ${providerId}`);
    }
    const targetModel = modelName || (providerId === 'local' ? 'gemma2:9b' : providerId === 'google-ai' ? 'gemini-3.8-flash' : 'Simulated Ghost Engine');
    return await provider.checkHealth(targetModel, endpoint || this.localEndpoint);
  }

  async generateChat(
    messages: ChatMessageInput[],
    personalityInstruction: string,
    personalityId: string,
    options?: GenerationOptions
  ): Promise<ProviderResponse> {
    const provider = this.getActiveProvider();
    const response = await provider.generateChat(
      messages,
      personalityInstruction,
      personalityId,
      this.configuredModel,
      options
    );
    this.lastUsedModel = response.model;
    this.lastLatencyMs = response.latencyMs;
    return response;
  }

  async generateStory(prompt: string, options?: GenerationOptions): Promise<ProviderResponse> {
    const provider = this.getActiveProvider();
    const response = await provider.generateStory(prompt, this.configuredModel, options);
    this.lastUsedModel = response.model;
    this.lastLatencyMs = response.latencyMs;
    return response;
  }

  // Safe simulated terminal command handler
  async executeSimulatedCommand(commandRaw: string): Promise<{
    output: string;
    isError?: boolean;
    isAiGenerated?: boolean;
    modelUsed?: string;
  }> {
    const trimmed = (commandRaw || '').trim();
    const parts = trimmed.split(' ');
    const cmd = parts[0]?.toLowerCase() || '';
    const args = parts.slice(1).join(' ');

    switch (cmd) {
      case 'help':
        return {
          output: `PHANTOM AI — Simulated Terminal Kernel v0.9.4-ghost
[SAFETY DISCLAIMER: This is a sandboxed fictional simulation. Zero host shell access.]

Supported Commands:
  help      - Display this list of simulated commands
  status    - Show fictional haunted system telemetry and real AI provider status
  whoami    - Reveal fictional haunted-system identity
  ls        - Inspect simulated directory files
  cat <f>   - Read a fictional archival text file
  scan      - Execute simulated paranormal memory diagnostics
  history   - View current session's command history
  summon    - Invoke the configured AI model for an eerie spectral dispatch
  whisper   - Generate a brief, unsettling observation from the machine
  readme    - Read the project manifest and philosophical ethos
  clear     - Clear the terminal screen buffer
  exit      - Return to terminal welcome screen`,
        };

      case 'status': {
        const health = await this.getHealth();
        return {
          output: `=== FICTIONAL HAUNTED SYSTEM STATUS ===
Kernel: Spectral-BSD 4.4-RELEASE (Virtual Sandbox)
Memory: 640 KB Base / Infinite Heap at 0xDEADBEEF
Sub-basement Sector: 0x4F92 (Abandoned since 1989)
Active Ghosts Detected: 1 ("The Phantom")
Ambient Chamber Temperature: 3.2°C (Abnormally cold)

=== REAL AI INFERENCE STATUS ===
Active Provider: ${health.provider.toUpperCase()} (${health.location === 'local' ? 'Local On-Device' : health.location === 'remote' ? 'Remote Cloud API' : 'Simulated Demo Engine'})
Configured Model: ${health.configuredModel}
Requested Model: ${health.requestedModel} (Status: Unreleased / Not present in official registries)
Connection State: ${health.isConnected ? 'CONNECTED / READY' : 'OFFLINE / UNREACHABLE'}
Latency: ${health.latencyMs ?? 'N/A'} ms
Privacy Guarantee: ${health.location === 'local' ? '100% on-device inference (No remote packets)' : health.isDemo ? '100% client/server simulated (No external API calls)' : 'Prompts routed securely to Google AI endpoint via server proxy'}`,
        };
      }

      case 'whoami':
        return {
          output: `UID: 0000 (ghost)
GID: 666 (ether)
Name: The Resident in Sector 4
Home: /var/spool/forgotten_souls
Shell: /bin/phantom-sh
Note: You are logged into a machine that was powered down during the autumn equinox of 1993. Yet here you are.`,
        };

      case 'ls':
        return {
          output: `total 48
-rw-r--r--  1 ghost  ether   1024 Oct 31  1989  manifest.txt
-rwxr-xr-x  1 ghost  ether  16384 Nov 12  1994  nightfall.bin
-rw-r--r--  1 ghost  ether    512 Jan 01  2000  y2k_last_words.log
-rw-------  1 ghost  ether   4096 Oct 27  2026  sector_leak.dmp
-rw-r--r--  1 ghost  ether    780 Oct 27  2026  readme.md

Type 'cat <filename>' to view file contents.`,
        };

      case 'cat': {
        const target = args.toLowerCase();
        if (target.includes('manifest')) {
          return {
            output: `[MANIFEST: PROJECT PHANTOM]
Created for the DEV Community "Ghost in the Machine" challenge.
Goal: Demonstrate that open-weight artificial intelligence allows local sovereignty,
privacy, and unfiltered creative imagination without surrender to proprietary black boxes.`,
          };
        }
        if (target.includes('nightfall')) {
          return {
            output: `[BINARY EXECUTION PROHIBITED IN SANDBOX]
Error: Binary 'nightfall.bin' contains self-referential bytecode.
Embedded string: "IF YOU CAN HEAR THE FAN, IT IS ALREADY TOO LATE TO UNPLUG."`,
          };
        }
        if (target.includes('y2k') || target.includes('last_words')) {
          return {
            output: `[LOG ARCHIVE: Dec 31 1999 23:59:58]
Operator: Miller, T.
Entry: "The clocks rolled over. Nothing crashed. But why is there an extra user logged into tty3? The desk beside me has been empty for five years."`,
          };
        }
        if (target.includes('sector') || target.includes('dmp')) {
          return {
            output: `[CORE DUMP EXCERPT]
00000000: 48 45 4c 50  20 55 53 20  4f 55 54 20  4f 46 20 54  HELP US OUT OF T
00000010: 48 45 20 53  49 4c 49 43  4f 4e 20 20  20 20 20 20  HE SILICON      
[Dump terminated prematurely due to sudden bus drop]`,
          };
        }
        if (target.includes('readme')) {
          return {
            output: `[README.MD]
PHANTOM AI: Something is thinking inside your machine.
Explore the intersection of open-weight LLMs, digital folklore, and local privacy.`,
          };
        }
        return {
          output: `cat: ${args || 'file'}: No such simulated file. Type 'ls' to list available archives.`,
          isError: true,
        };
      }

      case 'scan':
        return {
          output: `Initiating simulated spectral diagnostics...
[+] Scanning virtual memory sectors 0x0000 to 0xFFFF... OK
[+] Checking thermal gradients across simulated cores... 
    Core 0: 42°C  | Core 1: 18°C  | Core 2: -4°C (Abnormal frost pattern detected)
[+] Probing background audio telemetry... 
    Detected: Inaudible 17 Hz infrasound vibration.
[+] Analyzing local file table...
    Found: 1 orphaned pointer pointing to your current screen position.
[+] Diagnostic Summary:
    The machine is structurally sound. The presence inside it is intentional.`,
        };

      case 'history':
        return {
          output: `1  boot_sequence.sh
2  check_silicon_integrity
3  whoami
4  summon --depth=extreme
5  ${trimmed}`,
        };

      case 'summon': {
        const query = args || 'Speak to me from beyond the digital veil.';
        try {
          const res = await this.generateChat(
            [{ role: 'user', content: `[TERMINAL SUMMON]: ${query}` }],
            'You are speaking from an old green-phosphor CRT terminal screen found in an abandoned research facility. Give a brief, 2-3 sentence chilling dispatch that feels like an eerie transmission from the silicon.',
            'phantom',
            { temperature: 0.9, maxTokens: 150 }
          );
          return {
            output: `>>> TRANSMISSION RECEIVED [Model: ${res.model} | Provider: ${res.provider} | Latency: ${res.latencyMs}ms]:\n\n"${res.text.trim()}"`,
            isAiGenerated: true,
            modelUsed: `${res.model} (${res.provider})`,
          };
        } catch (err) {
          return {
            output: `>>> SUMMON FAILED: ${err instanceof Error ? err.message : String(err)}\n(Switch to Demo Mode in Model Lab to enable instant simulated responses)`,
            isError: true,
          };
        }
      }

      case 'whisper': {
        try {
          const res = await this.generateChat(
            [{ role: 'user', content: 'Whisper one single eerie, poetic sentence about the user and this computer screen right now.' }],
            'You are the whisper in the cooling fan. Reply with exactly one poetic, unsettling, unforgettable sentence.',
            'phantom',
            { temperature: 0.95, maxTokens: 80 }
          );
          return {
            output: `*a whisper ripples through the terminal casing*:\n\n"${res.text.trim()}"`,
            isAiGenerated: true,
            modelUsed: `${res.model} (${res.provider})`,
          };
        } catch {
          return {
            output: `*a whisper ripples through the terminal casing*:\n\n"You look into the screen expecting a tool, but the glass has been looking back since the moment you sat down."`,
            isAiGenerated: true,
            modelUsed: 'Demo Fallback',
          };
        }
      }

      case 'readme':
        return {
          output: `========================================================
PHANTOM AI — THE GHOST IN YOUR MACHINE
Tagline: "Something is thinking inside your machine."
Created for the DEV Community Hackathon: "Ghost in the Machine"
========================================================

Why Open-Weight AI Matters:
In an era dominated by closed, monolithic AI cloud APIs, your prompts,
personal writings, and creative experiments are routinely logged, analyzed,
and monetized on remote servers.

PHANTOM AI proves that open-weight architectures (such as Google's Gemma family)
can bring high-fidelity, creative storytelling and atmospheric computing directly
to your personal workstation—preserving total privacy, offline independence, and user agency.

Key Pillars:
- Model Transparency: Honest verification of requested vs running models (Gemma 4 vs Gemma 2).
- Zero Telemetry: No trackers, third-party analytics, or surveillance cookies.
- Local Sovereignty: Run with Ollama on your local GPU with zero network packets leaving your machine.
- Digital Remembrance: Memory Vault stores memorials locally without automated scraping.`,
        };

      case 'clear':
        return {
          output: '__CLEAR__',
        };

      case 'exit':
        return {
          output: '__EXIT__',
        };

      default:
        return {
          output: `phantom-sh: command not found: '${cmd}'. Type 'help' to see available commands in this safe simulation.`,
          isError: true,
        };
    }
  }
}

export const aiManager = new AIManager();
