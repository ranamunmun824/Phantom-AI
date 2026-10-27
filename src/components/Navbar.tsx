import React from 'react';
import { Ghost, Shield, Volume2, VolumeX, Menu, Activity, Sparkles, HardDrive, Cpu } from 'lucide-react';
import { ModelInfo } from '../types';

interface NavbarProps {
  modelInfo: ModelInfo | null;
  audioActive: boolean;
  onToggleAudio: () => void;
  onOpenPrivacy: () => void;
  onToggleMobileNav: () => void;
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  modelInfo,
  audioActive,
  onToggleAudio,
  onOpenPrivacy,
  onToggleMobileNav,
  onSelectTab,
}) => {
  const isDemo = modelInfo?.isDemo ?? true;
  const isLocal = modelInfo?.location === 'local';
  const isConnected = modelInfo?.isConnected ?? false;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-purple-950/40 bg-[#07070b]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-purple-950/30"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:border-purple-400/60 group-hover:text-purple-200 transition-all">
              <Ghost className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-bold tracking-wider text-white group-hover:text-purple-200 transition-colors">
                  PHANTOM AI
                </span>
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-tight">
                Something is thinking inside your machine.
              </p>
            </div>
          </button>
        </div>

        {/* Center Live Telemetry (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-emerald-400">AWAKE</span>
          </div>
          <span>/</span>
          <div className="flex items-center gap-1.5">
            {isLocal ? (
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
            ) : isDemo ? (
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
            )}
            <span className="text-slate-300">
              {modelInfo?.configuredModel || 'gemma-2-9b-it'}
            </span>
          </div>
          <span>/</span>
          <span className={isConnected ? 'text-emerald-400' : 'text-amber-400'}>
            {isDemo
              ? 'Demo (Simulated)'
              : isLocal
              ? 'Local (Ollama)'
              : 'Google AI (Remote)'}
          </span>
          {modelInfo?.latencyMs ? (
            <>
              <span>/</span>
              <span className="text-slate-400">{modelInfo.latencyMs}ms</span>
            </>
          ) : null}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Audio Ambience Toggle */}
          <button
            onClick={onToggleAudio}
            title={audioActive ? 'Mute atmospheric sound' : 'Enable atmospheric sound (Web Audio)'}
            aria-label={audioActive ? 'Mute atmospheric sound' : 'Enable atmospheric sound'}
            className={`p-2 rounded-lg text-xs flex items-center gap-1.5 border transition-all ${
              audioActive
                ? 'bg-purple-950/60 border-purple-500/40 text-purple-200'
                : 'bg-black/40 border-purple-900/20 text-slate-400 hover:text-slate-200'
            }`}
          >
            {audioActive ? (
              <>
                <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                <span className="hidden sm:inline text-[11px]">Audio On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline text-[11px]">Muted</span>
              </>
            )}
          </button>

          {/* Privacy Architecture Modal Trigger */}
          <button
            onClick={onOpenPrivacy}
            title="Privacy and Security Architecture"
            aria-label="View Privacy Architecture"
            className="p-2 rounded-lg text-xs flex items-center gap-1.5 bg-black/40 border border-purple-900/20 text-slate-400 hover:text-slate-200 hover:border-purple-500/40 transition-all"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline text-[11px]">Privacy</span>
          </button>

          {/* Model Lab Shortcut */}
          <button
            onClick={() => onSelectTab('model-lab')}
            className="px-3 py-1.5 text-xs font-medium text-purple-200 bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/30 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xs:inline">Model Lab</span>
          </button>
        </div>
      </div>
    </header>
  );
};
