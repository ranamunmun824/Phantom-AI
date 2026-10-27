import { Router, Request, Response } from 'express';
import { aiManager } from '../services/aiManager.js';

export const apiRouter = Router();

// Basic IP-based in-memory rate limiter for server routes
const requestTracker = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string, limit = 60, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = requestTracker.get(ip);
  if (!entry || now > entry.resetAt) {
    requestTracker.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) {
    return false;
  }
  entry.count++;
  return true;
}

// Middleware to enforce rate limits
apiRouter.use((req: Request, res: Response, next) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  if (!checkRateLimit(ip, 120, 60000)) {
    return res.status(429).json({
      error: 'Too many requests. Please wait a moment before sending more queries to the phantom.',
    });
  }
  next();
});

// GET /api/health - live system health check
apiRouter.get('/health', async (_req: Request, res: Response) => {
  try {
    const health = await aiManager.getHealth();
    res.json(health);
  } catch (err) {
    res.status(500).json({
      isConnected: false,
      isDemo: false,
      provider: 'demo',
      location: 'simulated',
      requestedModel: 'Gemma 4',
      configuredModel: 'Unknown',
      statusMessage: `Health check failure: ${err instanceof Error ? err.message : String(err)}`,
      verificationNote: 'Error executing health check.',
    });
  }
});

// GET /api/config - current server-side configuration
apiRouter.get('/config', (_req: Request, res: Response) => {
  res.json(aiManager.getConfig());
});

// POST /api/config/update - change active provider or model
apiRouter.post('/config/update', (req: Request, res: Response) => {
  const { provider, modelName, localEndpoint } = req.body || {};
  const updated = aiManager.updateConfig({ provider, modelName, localEndpoint });
  res.json(updated);
});

// POST /api/config/test - test connection to a target provider
apiRouter.post('/config/test', async (req: Request, res: Response) => {
  const { provider, modelName, endpoint } = req.body || {};
  if (!provider) {
    return res.status(400).json({ error: 'Provider is required for connection testing.' });
  }
  try {
    const result = await aiManager.testConnection(provider, modelName, endpoint);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      isConnected: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
});

// POST /api/chat - generate conversational response
apiRouter.post('/chat', async (req: Request, res: Response) => {
  const { messages, personalityInstruction, personalityId, temperature, maxTokens } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Valid messages array is required.' });
  }

  // Input validation: ensure no message exceeds 4000 characters
  for (const msg of messages) {
    if (typeof msg.content !== 'string' || msg.content.length > 4000) {
      return res.status(400).json({ error: 'Individual message content cannot exceed 4000 characters.' });
    }
  }

  try {
    const result = await aiManager.generateChat(
      messages,
      personalityInstruction || 'You are The Phantom, an ancient intelligence inside the machine.',
      personalityId || 'phantom',
      { temperature: Number(temperature) || 0.8, maxTokens: Number(maxTokens) || 1024 }
    );
    res.json(result);
  } catch (err) {
    console.error('Chat generation error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Internal server error while summoning response.',
      canFallbackToDemo: true,
    });
  }
});

// POST /api/stories/generate - create new horror story
apiRouter.post('/stories/generate', async (req: Request, res: Response) => {
  const {
    title,
    character,
    setting,
    subgenre,
    length,
    fearIntensity,
    perspective,
    ending,
    keywords,
    temperature,
    maxTokens,
  } = req.body || {};

  if (!character || !setting) {
    return res.status(400).json({ error: 'Character and Setting are required to generate a story.' });
  }

  const lengthDescriptions: Record<string, string> = {
    flash: 'Flash fiction (around 200-300 words, rapid visceral suspense, singular terrifying moment)',
    short: 'Short story (around 500-800 words, paced dread, character depth, atmospheric reveal)',
    extended: 'Extended story (around 1000-1400 words, multi-scene escalation, deep psychological terror)',
  };

  const fearDescriptions: Record<string, string> = {
    whispers: 'Mild / Subtle whispers in the dark, gentle chills, melancholy mystery',
    creeping_dread: 'Medium creeping dread, persistent unease, sensory tension',
    eldritch: 'High eldritch nightmare, reality unraveling, incomprehensible scale',
    digital_terror: 'Extreme digital terror, relentless algorithmic haunting, claustrophobic fear',
  };

  const perspectiveMap: Record<string, string> = {
    first_person: 'First-person perspective ("I")',
    second_person: 'Second-person perspective ("You")',
    third_limited: 'Third-person limited ("He/She")',
    omniscient: 'Third-person omniscient narrator',
  };

  const endingMap: Record<string, string> = {
    unexpected_twist: 'An unexpected, hair-raising twist in the final lines',
    open: 'An open, lingering ambiguous ending that haunts the reader\'s thoughts',
    bittersweet: 'A bittersweet ending tinged with loss and poignant beauty',
    dark: 'A grim, unrelenting dark descent',
    hopeful: 'A narrow, hard-won survival with lingering scars',
  };

  const prompt = `Write an original, highly atmospheric horror story with the following specifications:
- Title: ${title || 'Untitled Haunting'}
- Main Character: ${character}
- Setting: ${setting}
- Subgenre: ${subgenre || 'haunted_technology'}
- Story Length Target: ${lengthDescriptions[length] || lengthDescriptions.short}
- Fear Intensity: ${fearDescriptions[fearIntensity] || fearDescriptions.creeping_dread}
- Narrative Perspective: ${perspectiveMap[perspective] || 'Third-person limited'}
- Desired Ending Style: ${endingMap[ending] || 'An unexpected twist'}
${keywords ? `- Key Motifs / Elements to include: ${keywords}` : ''}

CRITICAL WRITING INSTRUCTIONS:
- Deliver complete, immersive, high-quality literary prose.
- Open immediately in media res or with an indelible sensory hook.
- Ground the horror in realistic tactile details, acoustic sensations, and psychological realism.
- Avoid clichés like "little did they know" or "it was all a dream".
- Conclude with power and resonant dread.`;

  try {
    const result = await aiManager.generateStory(prompt, {
      temperature: Number(temperature) || 0.85,
      maxTokens: Number(maxTokens) || (length === 'extended' ? 2500 : length === 'flash' ? 800 : 1600),
    });

    const wordCount = result.text.split(/\s+/).filter(Boolean).length;

    res.json({
      ...result,
      wordCount,
      title: title || 'Untitled Haunting',
    });
  } catch (err) {
    console.error('Story generation error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to generate story.',
      canFallbackToDemo: true,
    });
  }
});

// POST /api/stories/continue - modify or continue existing story
apiRouter.post('/stories/continue', async (req: Request, res: Response) => {
  const { currentStory, action, instructions } = req.body || {};

  if (!currentStory) {
    return res.status(400).json({ error: 'Existing story text is required to continue or modify.' });
  }

  let prompt = '';
  switch (action) {
    case 'continue':
      prompt = `Here is the current horror story:\n"""\n${currentStory}\n"""\n\nPlease write the next chapter or continuation of this story. Seamlessly continue the tension, deepen the mystery, and progress the narrative toward a climactic encounter.`;
      break;
    case 'change_ending':
      prompt = `Here is the current horror story:\n"""\n${currentStory}\n"""\n\nPlease rewrite the ending of this story. Provide an entirely different, unexpected climax and resolution that recontextualizes earlier clues.`;
      break;
    case 'scarier':
      prompt = `Here is the current horror story:\n"""\n${currentStory}\n"""\n\nPlease revise and intensify this horror story to make it significantly scarier, more claustrophobic, and steeped in chilling sensory details. Amplify the dread and psychological stakes.`;
      break;
    case 'mysterious':
      prompt = `Here is the current horror story:\n"""\n${currentStory}\n"""\n\nPlease revise this story to inject more surreal, cryptic, and enigmatic elements. Weave in ancient folklore, anomalous physics, or eerie digital riddles that make the haunting feel profound and cosmic.`;
      break;
    default:
      prompt = `Here is the current horror story:\n"""\n${currentStory}\n"""\n\nUser modification request: ${instructions || 'Continue the story.'}`;
  }

  try {
    const result = await aiManager.generateStory(prompt, {
      temperature: 0.85,
      maxTokens: 2000,
    });
    const wordCount = result.text.split(/\s+/).filter(Boolean).length;
    res.json({
      ...result,
      wordCount,
    });
  } catch (err) {
    console.error('Story modification error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Failed to modify story.',
    });
  }
});

// POST /api/terminal/command - safe simulated command executor
apiRouter.post('/terminal/command', async (req: Request, res: Response) => {
  const { command } = req.body || {};
  if (typeof command !== 'string') {
    return res.status(400).json({ error: 'Command must be a string.' });
  }

  try {
    const result = await aiManager.executeSimulatedCommand(command);
    res.json(result);
  } catch (err) {
    res.status(500).json({
      output: `Internal simulation error: ${err instanceof Error ? err.message : String(err)}`,
      isError: true,
    });
  }
});
