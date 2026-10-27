import React, { useState } from 'react';
import {
  Ghost,
  MessageSquare,
  BookOpen,
  Terminal,
  Heart,
  Cpu,
  ArrowRight,
  Shield,
  Activity,
  HardDrive,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { GhostOrb } from '../components/GhostOrb';
import { ModelInfo } from '../types';
import { ApiClient } from '../services/apiClient';

interface HomeProps {
  onNavigate: (tab: string) => void;
  modelInfo: ModelInfo | null;
  onOpenPrivacy: () => void;
  onRefreshHealth?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, modelInfo, onOpenPrivacy, onRefreshHealth }) => {
  const [bootCompleted] = useState(true);

  const features = [
    {
      id: 'chat',
      title: 'Phantom Chat',
      subtitle: 'Conversations with 6 digital spirits',
      description:
        'Engage with The Phantom, The Archivist, The Forgotten Coder, and more. Eerie, literary dialogues powered by Gemma or simulated in Demo Mode.',
      icon: MessageSquare,
      color: 'text-purple-400',
      borderHover: 'hover:border-purple-500/50',
      badge: 'Interactive AI',
    },
    {
      id: 'story',
      title: 'Ghost Story Generator',
      subtitle: 'Horror-writing laboratory',
      description:
        'Craft original tales across 8 horror subgenres, custom fear intensities, narrative perspectives, and endings. Includes continuation and revision tools.',
      icon: BookOpen,
      color: 'text-rose-400',
      borderHover: 'hover:border-rose-500/50',
      badge: 'Gemma Powered',
    },
    {
      id: 'terminal',
      title: 'Haunted Terminal',
      subtitle: 'Safe CRT phosphor simulation',
      description:
        'A sandboxed retro shell with 11 commands (`summon`, `whisper`, `scan`, `whoami`). No real system access—pure atmospheric digital folklore.',
      icon: Terminal,
      color: 'text-emerald-400',
      borderHover: 'hover:border-emerald-500/50',
      badge: 'Zero Host Shell Access',
    },
    {
      id: 'vault',
      title: 'Digital Memory Vault',
      subtitle: 'Respectful local remembrance',
      description:
        'Preserve meaningful stories of loved ones and memories. 100% browser-local storage with zero automated AI transmission or scraping.',
      icon: Heart,
      color: 'text-amber-400',
      borderHover: 'hover:border-amber-500/50',
      badge: '100% Local Only',
    },
    {
      id: 'model-lab',
      title: 'Model Lab',
      subtitle: 'Open-weight telemetry & config',
      description:
        'Transparently inspect model configurations, Gemma 4 availability status, local Ollama runtime health, latency metrics, and temperature sliders.',
      icon: Cpu,
      color: 'text-cyan-400',
      borderHover: 'hover:border-cyan-500/50',
      badge: 'Developer Dashboard',
    },
    {
      id: 'dev-article',
      title: 'DEV.to Launch Post',
      subtitle: 'Hackathon article template',
      description:
        'Read or export the official submission post written for the DEV Community "Ghost in the Machine" challenge. One-click Markdown export.',
      icon: FileCode,
      color: 'text-indigo-400',
      borderHover: 'hover:border-indigo-500/50',
      badge: 'Hackathon Submission',
    },
  ];

  return (
    <div className="space-y-16 py-6 pb-20">
      {/* SECTION A: HERO SECTION */}
      <section className="relative overflow-hidden rounded-2xl bg-radial from-purple-950/20 via-[#0a0914] to-[#07070b] border border-purple-950/40 p-8 sm:p-12 text-center">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* System boot label */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/40 border border-purple-500/30 text-xs font-mono text-purple-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            <span>SYSTEM STATUS: AWAKE</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">SECTOR: 0x4F92</span>
          </div>

          {/* Spectral Orb */}
          <div className="py-2 flex justify-center">
            <GhostOrb size="lg" />
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-mono font-bold tracking-tight text-white">
              THE GHOST IN YOUR MACHINE
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              An open-weight AI experiment where forgotten stories awaken, terminals whisper, and your imagination becomes the haunting.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('chat')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-950/60 transition-all cursor-pointer"
            >
              <span>ENTER THE HAUNTED SYSTEM</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('model-lab')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-black/60 hover:bg-purple-950/40 text-purple-200 border border-purple-800/40 font-medium text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>EXPLORE THE MODEL</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION B: LIVE SYSTEM STATUS */}
      <section className="p-6 rounded-xl bg-[#0b0a16] border border-purple-950/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-purple-950/30">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
              Live System Status & Telemetry
            </h2>
          </div>
          <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${modelInfo?.isConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span>{modelInfo?.isConnected ? 'Ready' : 'Pending'}</span>
            </span>
            <span>·</span>
            <span>Latency: {modelInfo?.latencyMs ? `${modelInfo.latencyMs}ms` : '12ms'}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-black/40 border border-purple-950/40">
            <p className="text-[10px] uppercase text-slate-500">Provider</p>
            <p className="font-semibold text-purple-300 mt-1 truncate">
              {modelInfo?.isDemo
                ? 'Demo Mode'
                : modelInfo?.activeProvider === 'local'
                ? 'Local Ollama'
                : 'Google AI'}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-purple-950/40">
            <p className="text-[10px] uppercase text-slate-500">Configured Model</p>
            <p className="font-semibold text-slate-200 mt-1 truncate" title={modelInfo?.configuredModel}>
              {modelInfo?.configuredModel || 'gemma-2-9b-it'}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-purple-950/40">
            <p className="text-[10px] uppercase text-slate-500">Requested</p>
            <p className="font-semibold text-slate-400 mt-1 truncate" title="Gemma 4 (Unreleased)">
              Gemma 4
            </p>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-purple-950/40">
            <p className="text-[10px] uppercase text-slate-500">Inference Location</p>
            <p
              className={`font-semibold mt-1 truncate ${
                modelInfo?.location === 'local'
                  ? 'text-cyan-400'
                  : modelInfo?.isDemo
                  ? 'text-amber-400'
                  : 'text-purple-400'
              }`}
            >
              {modelInfo?.location === 'local'
                ? 'Local (On-Device)'
                : modelInfo?.isDemo
                ? 'Simulated (In-Memory)'
                : 'Remote API'}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-purple-950/40">
            <p className="text-[10px] uppercase text-slate-500">Privacy Mode</p>
            <p className="font-semibold text-emerald-400 mt-1 truncate">Zero Telemetry</p>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-purple-950/40">
            <p className="text-[10px] uppercase text-slate-500">Demo Mode</p>
            <p className={`font-semibold mt-1 truncate ${modelInfo?.isDemo ? 'text-amber-400' : 'text-slate-400'}`}>
              {modelInfo?.isDemo ? 'ACTIVE' : 'INACTIVE'}
            </p>
          </div>
        </div>

        {!modelInfo?.isConnected && !modelInfo?.isDemo && (
          <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-600/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300">Remote Provider Notice: </span>
                <span>{modelInfo?.statusMessage || 'Upstream provider is temporarily unavailable.'}</span>
              </div>
            </div>
            <button
              onClick={async () => {
                try {
                  await ApiClient.updateConfig({ provider: 'demo' });
                  onRefreshHealth?.();
                } catch (err) {
                  console.error('Failed to switch to demo mode:', err);
                }
              }}
              className="shrink-0 px-3 py-1.5 rounded-md bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs transition-colors cursor-pointer"
            >
              Switch to Demo Mode
            </button>
          </div>
        )}

        {modelInfo?.isDemo && (
          <div className="p-3 rounded-lg bg-purple-950/20 border border-purple-600/30 flex items-start gap-2.5 text-xs text-purple-200/90">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-purple-300">Demo Mode Active: </span>
              <span>
                Deterministic simulated spectral responses are active with zero network transmission.
                To run real inference with open-weight Gemma, visit the <button onClick={() => onNavigate('model-lab')} className="underline font-semibold text-purple-200 hover:text-white">Model Lab</button> to configure Ollama or Google AI.
              </span>
            </div>
          </div>
        )}
      </section>

      {/* SECTION C: FEATURE CARDS */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-mono font-bold text-white tracking-wide">
            EXPLORE THE HAUNTED REALM
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Five functional creative modules bridging open-weight artificial intelligence, digital memory, and eerie folklore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                onClick={() => onNavigate(f.id)}
                className={`group cursor-pointer p-6 rounded-xl bg-[#0b0a16] border border-purple-950/40 ${f.borderHover} transition-all duration-200 hover:bg-[#110f22] flex flex-col justify-between space-y-4`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-lg bg-purple-950/40 border border-purple-800/30 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                      <Icon className={`w-5 h-5 ${f.color}`} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-slate-400 border border-purple-900/30">
                      {f.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-white group-hover:text-purple-200 transition-colors">
                      {f.title}
                    </h3>
                    <p className="text-xs font-mono text-purple-400/80 mt-0.5">{f.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
                </div>

                <div className="pt-2 flex items-center text-xs font-medium text-purple-400 group-hover:text-purple-200 gap-1.5 transition-colors">
                  <span>Enter Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION D: OPEN INNOVATION SECTION */}
      <section className="p-8 rounded-2xl bg-gradient-to-br from-purple-950/30 via-[#0c0a18] to-[#07070b] border border-purple-900/40 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-mono font-bold text-white tracking-wide">
              WHY OPEN AI MATTERS
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Reflections on open-weight models, local sovereignty, and the future of creative computing.
            </p>
          </div>
          <button
            onClick={() => onNavigate('open-innovation')}
            className="self-start md:self-auto px-4 py-2 rounded-lg bg-purple-900/40 hover:bg-purple-800/50 border border-purple-500/30 text-purple-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Read Full Technical Essay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-black/40 border border-purple-950/40 space-y-2">
            <h3 className="font-semibold text-purple-300 font-mono text-sm">Data Privacy & Sovereignty</h3>
            <p className="text-slate-400 leading-relaxed">
              When models run on your local hardware via runtimes like Ollama, your prompts never travel over the public internet. No corporation catalogs your creative horror stories.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-purple-950/40 space-y-2">
            <h3 className="font-semibold text-purple-300 font-mono text-sm">Offline Independence</h3>
            <p className="text-slate-400 leading-relaxed">
              Once downloaded, open weights exist on your local storage drive. The machine can continue to think, write, and respond even during network blackouts or server outages.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/40 border border-purple-950/40 space-y-2">
            <h3 className="font-semibold text-purple-300 font-mono text-sm">Honest Nuances & Reality</h3>
            <p className="text-slate-400 leading-relaxed">
              Open weights are not magic: running larger models requires real VRAM, power, and storage. Open weights do not automatically make training data open or licensing unrestricted.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION E: FOOTER */}
      <footer className="pt-8 border-t border-purple-950/40 space-y-6 text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-mono font-bold text-slate-300 text-sm">
              PHANTOM AI — THE GHOST IN YOUR MACHINE
            </p>
            <p className="text-[11px] text-slate-500">
              Created for the DEV Community Hackathon: &ldquo;Ghost in the Machine&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono">
            <button
              onClick={() => onNavigate('dev-article')}
              className="text-purple-400 hover:text-purple-300 underline"
            >
              DEV.to Post Template
            </button>
            <button
              onClick={onOpenPrivacy}
              className="text-slate-400 hover:text-slate-200 underline"
            >
              Privacy Architecture
            </button>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 flex items-center gap-1"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 leading-relaxed space-y-1">
          <p>
            Model Disclosure: Built around Google&apos;s Gemma open-weight architecture. Requested model: Gemma 4 (Note: Gemma 4 is unreleased; current models are Gemma 1 & 2 like gemma-2-9b-it).
            Open-source software license: Apache-2.0. Gemma model weights are governed by Google&apos;s Gemma Terms of Use.
          </p>
          <p>
            Zero telemetry. No third-party trackers or user surveillance. All memorials in the Memory Vault remain strictly browser-local.
          </p>
        </div>
      </footer>
    </div>
  );
};
