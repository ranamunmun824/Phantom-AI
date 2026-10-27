import React from 'react';
import {
  Compass,
  ShieldCheck,
  WifiOff,
  Sliders,
  DollarSign,
  Clock,
  Eye,
  AlertTriangle,
  ArrowRight,
  HardDrive,
  Server,
  Layers,
} from 'lucide-react';

export const OpenInnovation: React.FC = () => {
  const pillars = [
    {
      title: '1. Privacy Sovereignty',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      summary: 'Prompts stay on your silicon.',
      content:
        'When you use hosted closed APIs, every sentence, memory, or draft is transmitted across the internet to corporate data centers. With open weights running in local runtimes like Ollama, the mathematical matrix multiplication occurs entirely on your device. Zero telemetry, zero third-party logging, zero surveillance.',
    },
    {
      title: '2. Offline Independence',
      icon: WifiOff,
      color: 'text-cyan-400',
      summary: 'The machine thinks without internet.',
      content:
        'Once model weights are downloaded to your drive, your creative tools continue operating during internet outages, remote travel, or server blackouts. You are not beholden to cloud uptime SLAs or rate-limit quotas.',
    },
    {
      title: '3. Architectural Adaptability',
      icon: Sliders,
      color: 'text-purple-400',
      summary: 'Swap models, tune parameters, modify prompts.',
      content:
        'Closed systems dictate what system prompts can be used, throttle response lengths, and silently deprecate models. With open weights, developers can switch from Gemma 2B to 9B, adjust quantization (Q4 vs Q8), customize sampling temperatures, and adapt the system to domain-specific needs.',
    },
    {
      title: '4. Predictable Economics',
      icon: DollarSign,
      color: 'text-amber-400',
      summary: 'Compute cost vs. per-token metering.',
      content:
        'Hosted APIs charge fractions of a cent per token, which can spiral unpredictably in recursive creative loops or high-volume generation. Local open-weight inference incurs upfront hardware and electricity costs, but zero marginal per-token charges.',
    },
    {
      title: '5. Cultural & Software Longevity',
      icon: Clock,
      color: 'text-indigo-400',
      summary: 'Preserving creative software over decades.',
      content:
        'When an API provider shuts down an endpoint, all dependent software instantly breaks. Open weights are permanent digital artifacts: an application written today around Gemma weights can still be booted thirty years from now on vintage hardware emulator environments.',
    },
    {
      title: '6. Inspectability & Transparency',
      icon: Eye,
      color: 'text-rose-400',
      summary: 'No mysterious middleware wrappers.',
      content:
        'In closed services, you never know what hidden system prompts, classifiers, or guardrails are silently altering your text. With open-weight models, you can inspect the raw tokenizer, model configuration, and inference pipeline.',
    },
    {
      title: '7. Honest Trade-offs & Limitations',
      icon: AlertTriangle,
      color: 'text-amber-500',
      summary: 'Open weights are not magical or cost-free.',
      content:
        'Local inference demands capable hardware (GPUs with 6GB–16GB VRAM for decent throughput). Furthermore, open weights do not automatically mean open source training data or unrestricted commercial licenses. Real transparency requires recognizing both benefits and constraints.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-4 pb-20">
      {/* Header */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-950/30 via-[#0a0916] to-[#07070b] border border-purple-950/50 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 uppercase tracking-wider font-semibold">
          <Compass className="w-4 h-4" />
          <span>Open-Weight AI Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-mono font-bold text-white tracking-wide">
          WHY THE GHOST BELONGS TO EVERYONE
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
          How open-weight AI decouples imagination from proprietary cloud infrastructure, transforming artificial intelligence into a permanent, locally sovereign creative medium.
        </p>
      </div>

      {/* Seven Core Pillars */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-mono font-bold text-white tracking-wide">
            THE SEVEN PILLARS OF OPEN-WEIGHT SOVEREIGNTY
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analyzing the technical and philosophical reasons PHANTOM AI was built around open-weight foundations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-xl bg-[#0a0914] border border-purple-950/40 space-y-2 hover:border-purple-600/30 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-5 h-5 ${p.color}`} />
                  <h3 className="font-mono text-sm font-bold text-white">{p.title}</h3>
                </div>
                <p className="text-xs font-mono text-purple-300">{p.summary}</p>
                <p className="text-xs text-slate-400 leading-relaxed pt-1">{p.content}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-mono font-bold text-white tracking-wide">
            TECHNICAL COMPARISON MATRIX
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hosted proprietary cloud APIs versus local open-weight inference runtimes.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-purple-950/40 bg-[#090812]">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-purple-950/60 bg-black/40 text-slate-400">
                <th className="p-4 uppercase tracking-wider">Dimension</th>
                <th className="p-4 uppercase tracking-wider text-purple-300">Hosted AI (Cloud APIs)</th>
                <th className="p-4 uppercase tracking-wider text-cyan-300">Local Open-Weight AI (Gemma/Ollama)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-950/30 text-slate-300">
              <tr>
                <td className="p-4 font-semibold text-slate-200">Data Path</td>
                <td className="p-4 text-slate-400">Prompts sent over public internet to remote servers.</td>
                <td className="p-4 text-cyan-200">Packets remain on internal bus. Zero WAN egress.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Internet Requirement</td>
                <td className="p-4 text-slate-400">Mandatory. Latency fluctuates with Wi-Fi/WAN state.</td>
                <td className="p-4 text-cyan-200">Zero internet required after model weights downloaded.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Economics</td>
                <td className="p-4 text-slate-400">Metered per-token pricing; monthly subscription overhead.</td>
                <td className="p-4 text-cyan-200">Upfront hardware & electricity; $0 per-token marginal cost.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Customization</td>
                <td className="p-4 text-slate-400">Restricted to endpoints and models exposed by provider.</td>
                <td className="p-4 text-cyan-200">Full control over quantization, sampling, context, & weights.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Longevity & Deprecation</td>
                <td className="p-4 text-slate-400">Provider can sunset, alter, or restrict models at any time.</td>
                <td className="p-4 text-cyan-200">Downloaded weights are permanent; can be archived offline forever.</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-200">Hardware Demands</td>
                <td className="p-4 text-slate-400">Minimal client requirements (runs on smartphones).</td>
                <td className="p-4 text-cyan-200">Requires sufficient RAM/VRAM (2GB for 2B, 6GB–16GB for 9B/27B).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Conceptual System Architecture Diagram */}
      <section className="p-6 rounded-xl bg-[#0a0914] border border-purple-950/40 space-y-4">
        <h2 className="text-lg font-mono font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>PHANTOM AI Architectural Diagram</span>
        </h2>
        <p className="text-xs text-slate-400">
          The diagram below illustrates how PHANTOM AI cleanly isolates user interface logic from both hosted and local model runtimes:
        </p>

        <div className="p-5 rounded-lg bg-black/80 border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed">
          <pre>{`User Interface (React + Tailwind + Web Audio)
       │
       ▼
Application API Layer (Express /server/routes/api.ts)
       │
       ▼
AI Provider Interface (IAIProvider Abstraction)
       │
   ┌───┴───────────────────────────┐
   │                               │
   ▼                               ▼
Hosted Gemma / Google AI       Local Model Runtime (Ollama / vLLM)
   │                               │
   ▼                               ▼
Remote Cloud Inference          On-Device 100% Private Inference
(Requires API Key)              (Zero External Network Transmission)`}</pre>
        </div>
        <p className="text-[11px] text-slate-500 italic">
          *Note: This diagram illustrates alternative execution pathways. When local inference is active, all communication with external inference services is completely bypassed.
        </p>
      </section>

      {/* Clarification on Open-Source vs Open-Weights */}
      <section className="p-6 rounded-xl bg-[#090812] border border-purple-950/40 space-y-3 text-xs leading-relaxed text-slate-300">
        <h3 className="font-mono text-sm font-bold text-purple-200">
          Important Legal & Technical Distinction: Open-Source vs Open-Weight
        </h3>
        <p>
          It is essential to be precise about terminology. <strong>Gemma</strong> is an <em>open-weight</em> model released by Google, meaning its neural network weights and architecture are publicly downloadable and runable anywhere. However:
        </p>
        <ul className="list-disc list-inside space-y-1 text-slate-400 pl-1">
          <li>
            Gemma weights are governed by Google&apos;s <strong>Gemma Terms of Use</strong>, which include responsible use terms, rather than a classic OSI-approved license like MIT or Apache-2.0.
          </li>
          <li>
            The PHANTOM AI software repository itself is licensed under <strong>Apache-2.0</strong>, allowing anyone to modify, audit, and distribute the application code freely.
          </li>
          <li>
            Open weights democratize model access and privacy, while developers remain responsible for validating model behavior and complying with respective terms of use.
          </li>
        </ul>
      </section>
    </div>
  );
};
