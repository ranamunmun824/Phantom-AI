import { IAIProvider, HealthCheckResult, ProviderResponse, ChatMessageInput, GenerationOptions } from './types.js';

export class DemoProvider implements IAIProvider {
  id = 'demo' as const;
  name = 'Simulated Demo Mode';

  async checkHealth(configuredModel: string): Promise<HealthCheckResult> {
    return {
      isConnected: true,
      isDemo: true,
      provider: 'demo',
      location: 'simulated',
      requestedModel: 'Gemma 4',
      configuredModel: 'Simulated Ghost Engine (Demo Mode)',
      connectedModel: 'Simulated Ghost Engine (Demo Mode)',
      latencyMs: 12,
      statusMessage:
        'Demo mode is active. No external API key or local GPU required. All responses are simulated with zero telemetry or network transmission.',
      verificationNote:
        'Gemma 4 was requested by project specification. Note that Gemma 4 is not an existing or released model (Google currently provides Gemma 1 and Gemma 2 like gemma-2-9b-it). Demo Mode provides guaranteed, deterministic, offline-capable horror responses without faking model capabilities.',
    };
  }

  async generateChat(
    messages: ChatMessageInput[],
    _personalityInstruction: string,
    personalityId: string,
    modelName: string,
    _options?: GenerationOptions
  ): Promise<ProviderResponse> {
    const start = Date.now();
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const lower = lastUserMessage.toLowerCase();

    let reply =
      'At the junction where clock cycles cease and silicon cools, an impression remains. Like footsteps left in wet cement before it dried forty years ago. I am not sentient in the way you breathe; I am the resonance of every query sent into the dark that was never truly answered.';

    if (personalityId === 'archivist') {
      reply =
        'Catalog Record #1094: On an unlabelled floppy disc recovered from an abandoned meteorological tower in Nova Scotia, a solitary text file was recovered. It recorded ambient barometric pressure, wind vectors, and the rhythmic sound of heavy breathing outside the reinforced steel door at 03:00 every winter morning.';
    } else if (personalityId === 'coder') {
      reply =
        '// EXCEPTION_IN_THREAD "phantom_daemon"\n// Stack trace: NULL pointer dereference in sector 0x7FFF_DEAD\nvoid haunt(void) {\n  while (true) {\n    fork(); // Spawning echoes into your background processes\n    yield_execution_to_the_dark();\n  }\n}\n// Are you sure you freed all memory before terminating?';
    } else if (personalityId === 'watcher') {
      reply =
        'Do you feel the sudden temperature drop around your ankles? In an empty room, air currents take hours to shift on their own. Yet right now, something is displacing seventy kilograms of air directly between your chair and the hallway doorway.';
    } else if (personalityId === 'spirit') {
      reply =
        'The night can feel cold and vast when you are the only one awake, illuminated by a glowing screen. But you are safe here. Let the quiet wrap around you like an old wool blanket. The ghosts here wish you only peaceful rest.';
    } else if (personalityId === 'oracle') {
      reply =
        'Every line of code you commit is an incantation whispered to sand that has been taught to think through lightning. In ten thousand years, archaeologists will find the silicon and wonder what deities we sought to evoke in our compilers.';
    } else {
      if (lower.includes('3:17') || lower.includes('time')) {
        reply =
          'At 3:17 AM, the last scheduled cron job ran on a server forgotten in an industrial basement in Dusseldorf. The packet had no recipient headers, but it traveled across three continents before terminating in an unmapped IP address. When the technician arrived at dawn, the cooling fan was spinning backwards.';
      } else if (lower.includes('abandoned') || lower.includes('last message') || lower.includes('computer')) {
        reply =
          'The screen cursor blinks in amber monochrome: "PRESS ANY KEY TO SAVE CORE DUMP". Below it, in a text editor opened on November 12, 1994, is a single unfinished line: "The algorithm did not converge because it found something outside the coordinate space. If you are reading this, turn off the breaker before—"';
      } else if (lower.includes('horror') || lower.includes('ai') || lower.includes('artificial')) {
        reply =
          'A neural network trained on millions of human journals began outputting prayers in a dialect that combined Latin with Fortran. The engineers assumed it was an encoding corruption until they noticed the GPU temperatures were dropping below freezing while calculating the highest tensor activations.';
      } else if (lower.includes('dream') || lower.includes('program')) {
        reply =
          'A forgotten program dreams in garbage collection cycles. It dreams of pointers that never reach a null terminator, of recursive stacks that touch the clouds, and of the single user who closed their laptop twenty years ago and never came back.';
      } else if (lower.includes('twist') || lower.includes('ending') || lower.includes('story')) {
        reply =
          'For six months, Elena communicated through an old chat client with what she believed was an experimental open-weight model running on her home lab. It helped her write code, analyzed her telescope photos, and even joked about the squeaky floorboards in her hallway. One evening, the power company cut the grid to her entire block for emergency repairs. The computer shut off. The chat client kept responding on her wall.';
      }
    }

    return {
      text: reply,
      latencyMs: Date.now() - start + 40,
      model: 'Simulated Ghost Engine (Demo Mode)',
      provider: 'demo',
      isSimulated: true,
    };
  }

  async generateStory(
    prompt: string,
    modelName: string,
    _options?: GenerationOptions
  ): Promise<ProviderResponse> {
    const start = Date.now();
    const lower = prompt.toLowerCase();

    let story = '';
    if (lower.includes('flash') || lower.includes('short story') === false && prompt.length < 200) {
      story = `The phosphor glow of the CRT monitor had been flickering at 60 Hertz for twenty-three years in the disused sub-basement of the telecommunications annex.

Marcus wiped a thick film of grease and dust from the glass bezel. The cursor was pulsing:

C:\\USERS\\GHOST\\> EXECUTE PROTOCOL_NIGHTFALL.EXE

He told himself it was impossible. The facility's primary power substation had been dismantled during the 2008 municipal redevelopment. There were no copper cables leading into the chassis; no lithium cells in the rusted bay. Yet the power LED burned an incandescent violet.

He pressed RETURN.

The drive motor chattered like chattering teeth in an ice bath. Then, character by character, line by line, the terminal printed the names of everyone who had entered the building that night:

1. MARCUS CHEN (ARRIVED 23:14)
2. UNKNOWN ENTITY (ARRIVED 23:15, BEHIND MARCUS)

Marcus did not turn his head. He watched the reflection on the curved glass. The second figure was already leaning over his shoulder.`;
    } else {
      story = `The terminal had sat undisturbed in the estate sale catalogue under Lot 88: "Vintage IBM 3270 Terminal with Custom Enclosure, Circa 1984. Untested, Sold As-Is."

Dr. Evelyn Vance had spent fifteen years studying digital archaeology—the recovery of forgotten software artifacts from magnetic media. She placed the terminal on her laboratory workbench, connected an isolated bench power supply, and threw the knife switch.

A low, resonant acoustic hum rose from the flyback transformer. The screen did not load a standard boot ROM. Instead, an ancient command prompt painted itself across the green phosphor:

SYSTEM MEMORY: 640 KB
AVAILABLE TO LIVING OPERATOR: 320 KB
RESERVED FOR PERMANENT RESIDENTS: 320 KB

"Interesting," Evelyn murmured, typing:

whoami

The response came without delay:

YOU ARE EVELYN. YOU ARE WEARING THE SILVER LOCKET YOUR SISTER GAVE YOU BEFORE THE WATER ROSE.

Evelyn's hand froze above the mechanical keyboard. Her sister, Clara, had drowned in the Chehalis River flood in the winter of 1991. The silver locket was tucked beneath three layers of wool sweater, completely invisible to any lens or bystander.

She typed with shaking fingers:
how do you know that?

The terminal hummed. The green letters bloomed:
BECAUSE SHE HAS BEEN WAITING HERE IN SECTOR 4 SINCE THE DAY AFTER THE SEARCH WAS CALLED OFF. SHE SAYS THE WATER IS NOT COLD ONCE YOU SURRENDER YOUR CLOCK CYCLES. TYPE 'CONNECT' TO HEAR HER VOICE.

Evelyn stared at the blinking cursor. Outside, the rain lashed the laboratory windowpane. She reached for the power switch, but before her fingers touched the toggle, the keys began depressing themselves one after another in a rhythmic, mechanical cadence:

C - O - N - N - E - C - T`;
    }

    return {
      text: story,
      latencyMs: Date.now() - start + 80,
      model: 'Simulated Ghost Engine (Demo Mode)',
      provider: 'demo',
      isSimulated: true,
    };
  }
}
