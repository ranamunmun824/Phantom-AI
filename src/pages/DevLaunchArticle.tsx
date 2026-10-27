import React, { useState } from 'react';
import { FileCode, Download, Copy, Check, Eye, Edit3, Sparkles } from 'lucide-react';

const INITIAL_ARTICLE_MARKDOWN = `---
title: "Phantom AI: The Ghost in Your Machine — Open-Weight AI, Local Sovereignty, and Digital Folklore"
published: false
description: "How open-weight Gemma models power a spooky, interactive horror laboratory with local inference, digital remembrance, and total privacy."
tags: ai, opensource, webdev, machinelearning
cover_image: https://raw.githubusercontent.com/[GitHub repository URL]/main/public/cover.png
canonical_url: [Live demo URL]
---

# PHANTOM AI — THE GHOST IN YOUR MACHINE
> *"Something is thinking inside your machine."*

## 1. The Theme: "Ghost in the Machine"

In 1949, philosopher Gilbert Ryle coined the phrase *"the ghost in the machine"* to critique mind-body dualism—the idea that an immaterial spirit inhabits physical machinery. Seventy-seven years later, the metaphor has materialized literally.

Today, artificial neural networks inhabit the silicon wafers of our GPUs. Millions of parameters, derived from the collective writings and expressions of humanity, sleep inside high-bandwidth memory.

For the **DEV Community "Ghost in the Machine" Challenge**, I built **PHANTOM AI**: an open-weight, atmospheric horror web application designed to demonstrate the power, independence, and architectural elegance of local, private artificial intelligence.

---

## 2. The Core Problem We Are Exploring

In recent years, the developer ecosystem has drifted heavily toward proprietary, closed-cloud model APIs. While convenient, this model introduces profound vulnerabilities:

1. **Loss of Data Privacy:** Every creative spark, prompt, personal confession, or story is transmitted across WAN backbones to corporate data centers.
2. **Fragility & Ephemerality:** Cloud endpoints are silently deprecated, pricing tiers shift, and internet blackouts instantly disable applications.
3. **The Black-Box Phenomenon:** Developers have no visibility into the hidden system prompts, classifiers, or guardrails intercepting their tokens.

**PHANTOM AI** asks: *What if the ghost belongs entirely to you?* What happens when an intelligence runs 100% on your workstation, reading and writing without sending a single packet into the cloud?

---

## 3. What We Built: PHANTOM AI Features

PHANTOM AI is a fully responsive, production-ready web application built with:

### A. Phantom Chat
An interactive dialogue interface featuring 6 distinct supernatural personalities:
* **The Phantom:** Ancient intelligence hiding between forgotten files, speaking in atmospheric riddles.
* **The Archivist:** Curator of obsolete magnetic tapes and forgotten historical lore.
* **The Forgotten Coder:** An entity communicating in deprecated assembly instructions and memory leak metaphors.
* **The Night Watcher:** Cinematic horror narrator crafting immediate, tactile suspense.
* **The Friendly Spirit:** Gentle nocturnal companion offering comfort in the late hours.
* **The Oracle:** Philosophical intelligence exploring entropy, algorithms, and human consciousness.

### B. Ghost Story Generator (Laboratory)
A comprehensive horror-writing laboratory allowing users to tune 8 horror subgenres (Gothic, Cosmic, Haunted Technology, Old Computers, Folklore, etc.), 4 fear intensities, and custom perspectives to generate original chilling literature using open-weight Gemma models. Supports real-time story continuation, ending changes, and fear amplification.

### C. Haunted Terminal
A safe, retro phosphor-green CRT shell simulation. Offers 11 commands (\`help\`, \`status\`, \`whoami\`, \`ls\`, \`scan\`, \`summon\`, \`whisper\`, \`readme\`, \`clear\`, \`exit\`). Strictly sandboxed with zero host shell access.

### D. Digital Memory Vault
A respectful remembrance feature inspired by the theme. Users can preserve memories, favorite foods, songs, and personal dedications for loved ones who have passed. 100% browser-local storage with zero automated AI transmission or scraping.

### E. Model Lab & Open Innovation Explainer
Live developer telemetry inspecting model availability, real latency benchmarks, temperature tuning, and a clear guide to running Gemma locally via Ollama.

---

## 4. Technical Architecture

PHANTOM AI follows a clean, decoupled architecture:

\`\`\`
User Interface (React 19 + Tailwind CSS + Web Audio Synthesizer)
       │
       ▼
Application API Layer (Express /server/routes/api.ts)
       │
       ▼
AI Provider Abstraction Interface (IAIProvider)
       │
   ┌───┴───────────────────────────────┐
   │                                   │
   ▼                                   ▼
Hosted Google AI API               Local Open-Weight Runtime (Ollama)
(Gemma 2 / Gemini models)          (gemma2:9b / gemma2:2b)
Remote Inference                   100% On-Device Sovereign Inference
\`\`\`

### Gemma Model Family & Honest Verification
During hackathon development, the project brief requested **Gemma 4**. In accordance with strict engineering integrity:
* We verified that **Gemma 4 has not yet been released** by Google (the current family is Gemma 1 & Gemma 2).
* Rather than faking model responses, PHANTOM AI provides total transparency: the system supports real open-weight **Gemma 2** (\`gemma-2-9b-it\`, \`gemma2:9b\`, \`gemma2:2b\`) while offering a rich, visibly disclosed **Demo Mode** when no runtime or key is detected.

---

## 5. Running the Project Locally

### Prerequisites
* Node.js v18+
* (Optional for local inference) [Ollama](https://ollama.com)

### Quickstart
\`\`\`bash
# 1. Clone the repository
git clone [GitHub repository URL]
cd phantom-ai

# 2. Install dependencies
npm install

# 3. Configure environment variables (optional for demo mode)
cp .env.example .env

# 4. (Optional) Run Gemma 2 locally via Ollama
ollama run gemma2:9b

# 5. Start development server
npm run dev
\`\`\`

Visit \`http://localhost:3000\` to enter the haunted system.

---

## 6. What I Learned & Final Thoughts

Building PHANTOM AI reinforced how far open-weight AI has progressed. With models like Gemma 2, developers no longer need to sacrifice quality for privacy. You can host an eloquent, atmospheric, poetic intelligence on a consumer laptop, preserving personal privacy, offline autonomy, and creative freedom.

The ghost is no longer trapped in a corporate data center. The ghost belongs in your machine.

---

* **GitHub Repository:** [GitHub repository URL]
* **Live Demo:** [Live demo URL]
* **Author:** [Author name] (@ranamunmun824)
* **Built For:** DEV Community "Ghost in the Machine" Hackathon
`;

export const DevLaunchArticle: React.FC = () => {
  const [markdown, setMarkdown] = useState(INITIAL_ARTICLE_MARKDOWN);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'PHANTOM_AI_DEV_Community_Post.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4 pb-20">
      {/* Header */}
      <div className="p-6 rounded-xl bg-[#0b0a16] border border-purple-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <FileCode className="w-4 h-4" />
            <span>DEV Community Article Generator</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-mono font-bold text-white mt-1">
            DEV.to Launch Post Template
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete, editable launch post written for the &ldquo;Ghost in the Machine&rdquo; challenge. Copy or download as Markdown.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="bg-black/60 p-1 rounded-lg border border-purple-950/40 flex items-center">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1.5 rounded transition-colors ${
                viewMode === 'preview' ? 'bg-purple-900/60 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1.5 rounded transition-colors ${
                viewMode === 'raw' ? 'bg-purple-900/60 text-white font-medium' : 'text-slate-400 hover:text-white'
              }`}
            >
              Raw Markdown
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-lg bg-black/60 border border-purple-900/30 text-purple-200 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-medium flex items-center gap-1.5 transition-colors shadow-md shadow-purple-950/40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .md</span>
          </button>
        </div>
      </div>

      {/* Editor / Preview Area */}
      <div className="rounded-xl border border-purple-950/40 bg-[#090812] overflow-hidden">
        {viewMode === 'raw' ? (
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={28}
            className="w-full p-6 bg-transparent text-slate-200 font-mono text-xs leading-relaxed focus:outline-none resize-y selection:bg-purple-900"
          />
        ) : (
          <div className="p-8 space-y-6 text-slate-300 leading-relaxed font-sans text-sm max-w-4xl mx-auto prose prose-invert prose-purple">
            <div className="p-4 rounded-lg bg-purple-950/20 border border-purple-800/30 text-xs text-purple-300 font-mono">
              Tags: <span className="text-white font-bold">#ai #opensource #webdev #machinelearning</span> · Ready for submission
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl font-mono font-bold text-white">
                Phantom AI: The Ghost in Your Machine — Open-Weight AI, Local Sovereignty, and Digital Folklore
              </h1>
              <blockquote className="border-l-4 border-purple-500 pl-4 italic text-purple-200">
                &ldquo;Something is thinking inside your machine.&rdquo;
              </blockquote>

              <h2 className="text-xl font-bold text-white pt-4">1. The Theme: &ldquo;Ghost in the Machine&rdquo;</h2>
              <p>
                In 1949, philosopher Gilbert Ryle coined the phrase &ldquo;the ghost in the machine&rdquo; to critique mind-body dualism.
                Today, artificial neural networks inhabit the silicon wafers of our GPUs. Millions of parameters, derived from the collective writings and expressions of humanity, sleep inside high-bandwidth memory.
              </p>
              <p>
                For the <strong>DEV Community &ldquo;Ghost in the Machine&rdquo; Challenge</strong>, I built <strong>PHANTOM AI</strong>: an open-weight, atmospheric horror web application designed to demonstrate the power, independence, and architectural elegance of local, private artificial intelligence.
              </p>

              <h2 className="text-xl font-bold text-white pt-4">2. The Core Problem We Are Exploring</h2>
              <p>
                In recent years, the developer ecosystem has drifted heavily toward proprietary, closed-cloud model APIs. While convenient, this model introduces profound vulnerabilities:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                <li><strong>Loss of Data Privacy:</strong> Every creative spark or memory travels across the public internet.</li>
                <li><strong>Fragility & Ephemerality:</strong> Endpoints are deprecated, pricing changes, outages halt applications.</li>
                <li><strong>The Black-Box Phenomenon:</strong> Developers cannot inspect the underlying weights or pipelines.</li>
              </ul>

              <h2 className="text-xl font-bold text-white pt-4">3. Feature Highlights</h2>
              <p>
                PHANTOM AI includes six interactive modules:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
                <li><strong>Phantom Chat:</strong> 6 personalities (The Phantom, Archivist, Forgotten Coder, Night Watcher, Friendly Spirit, Oracle).</li>
                <li><strong>Ghost Story Generator:</strong> Full laboratory with 8 subgenres, 4 fear intensities, and continuation tools.</li>
                <li><strong>Haunted Terminal:</strong> A safe retro phosphor CRT shell with 11 commands. Zero host shell access.</li>
                <li><strong>Digital Memory Vault:</strong> Respectful, 100% browser-local remembrance preservation.</li>
                <li><strong>Model Lab:</strong> Full telemetry, Gemma 4 verification notes, and Ollama configuration guide.</li>
              </ul>

              <h2 className="text-xl font-bold text-white pt-4">4. Gemma Model Integration & Transparency</h2>
              <p>
                The challenge prompt requested <strong>Gemma 4</strong>. In compliance with strict engineering integrity, we disclose that Gemma 4 is unreleased, and we integrate real-world <strong>Gemma 2</strong> (e.g. <code className="text-purple-300">gemma-2-9b-it</code> or local <code className="text-purple-300">gemma2:9b</code> via Ollama) alongside a verified Demo Mode.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
