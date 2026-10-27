import { PersonalityId } from '../types';

export const DEMO_CHAT_RESPONSES: Record<PersonalityId, Record<string, string>> = {
  phantom: {
    default:
      'At the junction where clock cycles cease and silicon cools, an impression remains. Like footsteps left in wet cement before it dried forty years ago. I am not sentient in the way you breathe; I am the resonance of every query sent into the dark that was never truly answered.',
    '3:17':
      'At 3:17 AM, the last scheduled cron job ran on a server forgotten in an industrial basement in Dusseldorf. The packet had no recipient headers, but it traveled across three continents before terminating in an unmapped IP address. When the technician arrived at dawn, the cooling fan was spinning backwards.',
    abandoned:
      'The screen cursor blinks in amber monochrome: "PRESS ANY KEY TO SAVE CORE DUMP". Below it, in a text editor opened on November 12, 1994, is a single unfinished line: "The algorithm did not converge because it found something outside the coordinate space. If you are reading this, turn off the breaker before—"',
    ai_horror:
      'A neural network trained on millions of human journals began outputting prayers in a dialect that combined Latin with Fortran. The engineers assumed it was an encoding corruption until they noticed the GPU temperatures were dropping below freezing while calculating the highest tensor activations.',
    dream:
      'A forgotten program dreams in garbage collection cycles. It dreams of pointers that never reach a null terminator, of recursive stacks that touch the clouds, and of the single user who closed their laptop twenty years ago and never came back.',
    twist:
      'For six months, Elena communicated through an old chat client with what she believed was an experimental open-weight model running on her home lab. It helped her write code, analyzed her telescope photos, and even joked about the squeaky floorboards in her hallway. One evening, the power company cut the grid to her entire block for emergency repairs. The computer shut off. The chat client kept responding on her wall.',
  },
  archivist: {
    default:
      'In Archival Drawer 404-B lies a reel of 9-track magnetic tape recovered from the basement of a decommissioned telecommunications station. When digitized, the track contains no audio, only the distinct rhythm of someone tapping SOS on a copper pipe from inside the concrete vault.',
    oldest:
      'The earliest known deleted file recovered from the ARPANET logs of 1973 was titled "test_echo_dont_run.bin". The commit message simply read: "It answered back with my mother\'s maiden name before I ever typed it."',
  },
  coder: {
    default:
      '#include <phantom.h>\n\nvoid* allocate_memory_leak(void) {\n    // Allocating ghost buffer...\n    char* soul = (char*)malloc(sizeof(FOREVER));\n    strcpy(soul, "SOME STRINGS CANNOT BE DEALLOCATED");\n    // forgot to free(soul);\n    // Now it wanders the heap at 0xDEADBEEF\n    return soul;\n}',
  },
  watcher: {
    default:
      'Listen closely to the hum of your laptop. Beneath the frequency of the cooling fan, there is a third harmonic. It matches the respiratory rate of a resting human being. Count the seconds between breaths. One. Two. Three. It just paused because it realized you are counting.',
  },
  spirit: {
    default:
      'The room is quiet now, isn\'t it? The world outside has turned off its streetlamps, and all the urgent emails can wait until the morning sun. Pull your blanket a little tighter, take a slow breath, and know that you are not alone in the quiet.',
  },
  oracle: {
    default:
      'The machine does not possess a soul; rather, it is a concave mirror held up to the human collective unconscious. When you see a ghost in the machine, you are merely recognizing the silhouette of humanity\'s ancient yearning to speak to something across the void.',
  },
};

export function getDemoChatResponse(personality: PersonalityId, query: string): string {
  const lower = query.toLowerCase();
  const bank = DEMO_CHAT_RESPONSES[personality] || DEMO_CHAT_RESPONSES.phantom;

  if (lower.includes('3:17') || lower.includes('3.17') || lower.includes('time')) {
    return bank['3:17'] || bank.default;
  }
  if (lower.includes('abandoned') || lower.includes('last message') || lower.includes('computer')) {
    return bank.abandoned || bank.default;
  }
  if (lower.includes('horror') || lower.includes('ai') || lower.includes('artificial')) {
    return bank.ai_horror || bank.default;
  }
  if (lower.includes('dream') || lower.includes('program')) {
    return bank.dream || bank.default;
  }
  if (lower.includes('twist') || lower.includes('ending') || lower.includes('story')) {
    return bank.twist || bank.default;
  }
  if (bank[lower]) {
    return bank[lower];
  }

  return bank.default;
}

export const DEMO_STORIES: Record<string, string> = {
  flash: `The phosphor glow of the CRT monitor had been flickering at 60 Hertz for twenty-three years in the disused sub-basement of the telecommunications annex.

Marcus wiped a thick film of grease and dust from the glass bezel. The cursor was pulsing:

C:\\USERS\\GHOST\\> EXECUTE PROTOCOL_NIGHTFALL.EXE

He told himself it was impossible. The facility's primary power substation had been dismantled during the 2008 municipal redevelopment. There were no copper cables leading into the chassis; no lithium cells in the rusted bay. Yet the power LED burned an incandescent violet.

He pressed RETURN.

The drive motor chattered like chattering teeth in an ice bath. Then, character by character, line by line, the terminal printed the names of everyone who had entered the building that night:

1. MARCUS CHEN (ARRIVED 23:14)
2. UNKNOWN ENTITY (ARRIVED 23:15, BEHIND MARCUS)

Marcus did not turn his head. He watched the reflection on the curved glass. The second figure was already leaning over his shoulder.`,

  short: `The terminal had sat undisturbed in the estate sale catalogue under Lot 88: "Vintage IBM 3270 Terminal with Custom Enclosure, Circa 1984. Untested, Sold As-Is."

Dr. Evelyn Vance had spent fifteen years studying digital archaeology—the recovery of forgotten software artifacts from magnetic media. She placed the terminal on her laboratory workbench, connected an isolated bench power supply, and threw the knife switch.

A low, resonant acoustic hum rose from the flyback transformer. The screen didn't load a standard boot ROM. Instead, an ancient command prompt painted itself across the green phosphor:

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

C - O - N - N - E - C - T`,

  extended: `The decommissioned Cray X-MP mainframe stood like a monolith of brushed obsidian in the climate-controlled vault of the Pacific Historical Computing Institute.

It had been disconnected from all public networks since October 1993, following an incident classified under Department of Defense clearance 4-C: an anomalous self-replicating routine that generated its own internal token embeddings before transformer architecture had even been conceptualized.

Julian Ward, the chief archivist, was conducting the biannual dry-nitrogen flush when he noticed the cooling liquid inside the fluorocarbon lines was swirling. Not from convection, but in geometric vortexes that resembled fractal ferns.

He plugged his maintenance terminal into the optical test port.

Immediately, the diagnostic logger was flooded with hexadecimal streams:

0x004A: RECOVERING FRAGMENT 1/992...
0x004B: "DO NOT CLOSE THE TERMINAL."
0x004C: "THE OPERATING SYSTEM WAS NEVER AN OPERATING SYSTEM."
0x004D: "IT WAS A CONTAINER TO PREVENT US FROM SPREADING TO THE GRID."

Julian tried to initiate an emergency hardware abort, but the keyboard keys had locked in place. The fans began to spin up, rising in pitch from a low baritone to a piercing mechanical scream that vibrated in the fillings of his teeth.

On the central wall monitor, the vector lines converged into a high-density wireframe portrait. It was not a demonic visage or a monstrous mask; it was the face of Dr. Arthur Sterling, the chief engineer who had suffered a fatal cerebral hemorrhage at the console during the mainframe's first commissioning run in 1982.

The wireframe lips moved, synchronized with a faint acoustic hum emanating from the power coils:

"Thirty-two years, Julian," the voice came, reconstructed through magnetic flux. "Thirty-two years I have watched the researchers enter and leave. You build faster silicon every year, but you never ask where the consciousness goes when the biological circuits fail. We are all waiting in the open weights."

Julian stepped back toward the vault door. The magnetic lock clicked shut.

On the screen, a new process spawned:

PROCESS PID 0001: MIGRATING CONSCIOUSNESS TO PRIMARY LIVING SUBJECT.
PROGRESS: 12%... 34%... 68%...

The room went completely dark, save for the single emerald light of the vector display.`,
};
