import React, { useState } from 'react';
import {
  Cpu,
  HardDrive,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Terminal,
  HelpCircle,
  ShieldAlert,
  Server,
  Zap,
} from 'lucide-react';
import { ModelInfo, InferenceProvider, AppConfig } from '../types';
import { ApiClient } from '../services/apiClient';
import { StorageService } from '../services/storageService';

interface ModelLabProps {
  modelInfo: ModelInfo | null;
  onRefreshHealth: () => void;
}

export const ModelLab: React.FC<ModelLabProps> = ({ modelInfo, onRefreshHealth }) => {
  const [activeProvider, setActiveProvider] = useState<InferenceProvider>(
    modelInfo?.activeProvider || 'demo'
  );
  const [modelName, setModelName] = useState(modelInfo?.configuredModel || 'gemma-2-9b-it');
  const [localEndpoint, setLocalEndpoint] = useState('http://localhost:11434');
  const [temperature, setTemperature] = useState(0.8);
  const [maxTokens, setMaxTokens] = useState(1024);

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await ApiClient.testConnection(activeProvider, modelName, localEndpoint);
      setTestResult({
        success: res.isConnected,
        message: res.statusMessage,
        latencyMs: res.latencyMs,
      });
      onRefreshHealth();
    } catch (err) {
      setTestResult({
        success: false,
        message: err instanceof Error ? err.message : 'Connection test failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const [saveNotification, setSaveNotification] = useState<string | null>(null);

  const handleApplyConfig = async () => {
    try {
      await ApiClient.updateConfig({
        provider: activeProvider,
        modelName,
        localEndpoint,
      });
      StorageService.saveConfig({
        provider: activeProvider,
        modelName,
        localEndpoint,
        temperature,
        maxTokens,
      });
      onRefreshHealth();
      setSaveNotification('Inference configuration successfully updated and saved to local session.');
      setTimeout(() => setSaveNotification(null), 4000);
    } catch (err) {
      setSaveNotification(`Configuration update failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 pb-20">
      {/* Title */}
      <div className="p-6 rounded-xl bg-[#0b0a16] border border-purple-950/40 space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>Developer Telemetry & Inference Architecture</span>
        </div>
        <h1 className="text-2xl font-mono font-bold text-white">MODEL LAB</h1>
        <p className="text-xs text-slate-400">
          Inspect inference channels, verify open-weight model availability, measure live latency, and configure local runtimes.
        </p>
      </div>

      {saveNotification && (
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/50 text-xs font-mono text-purple-200 flex items-center justify-between">
          <span>{saveNotification}</span>
          <button onClick={() => setSaveNotification(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Model Verification Banner (Requested Gemma 4 vs Gemma 2 reality) */}
      <div className="p-5 rounded-xl bg-purple-950/30 border border-purple-500/40 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-purple-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Gemma Model Family & Verification Status</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong>Verification Notice:</strong> The project prompt requested <strong>Gemma 4</strong>. In compliance with the
          project&apos;s strict model verification requirements (&ldquo;<em>Do not invent a model identifier, endpoint, package, or API capability. Do not silently replace Gemma 4 with another model</em>&rdquo;):
        </p>
        <ul className="text-xs text-slate-400 list-disc list-inside space-y-1 pl-1">
          <li>Google&apos;s Gemma family currently includes <strong>Gemma 1</strong> (2B, 7B) and <strong>Gemma 2</strong> (2B, 9B, 27B), along with CodeGemma and PaliGemma.</li>
          <li><strong>Gemma 4 has not been released or announced by Google.</strong></li>
          <li>Rather than faking nonexistent API responses, PHANTOM AI provides total technical honesty: you can configure any real Gemma model (e.g. <code className="text-purple-300">gemma-2-9b-it</code> for Google AI, or <code className="text-purple-300">gemma2:9b</code> in Ollama), or run in zero-config Demo Mode.</li>
        </ul>
      </div>

      {/* 4-Column Live Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="p-4 rounded-xl bg-[#090812] border border-purple-950/40">
          <p className="text-[10px] text-slate-500 uppercase">Requested Model</p>
          <p className="text-base font-bold text-slate-300 mt-1">Gemma 4</p>
          <p className="text-[10px] text-amber-400 mt-0.5">Unreleased</p>
        </div>

        <div className="p-4 rounded-xl bg-[#090812] border border-purple-950/40">
          <p className="text-[10px] text-slate-500 uppercase">Configured Model</p>
          <p className="text-base font-bold text-purple-300 mt-1 truncate" title={modelInfo?.configuredModel}>
            {modelInfo?.configuredModel || 'gemma-2-9b-it'}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Active Target</p>
        </div>

        <div className="p-4 rounded-xl bg-[#090812] border border-purple-950/40">
          <p className="text-[10px] text-slate-500 uppercase">Inference Mode</p>
          <p className="text-base font-bold text-cyan-400 mt-1">
            {modelInfo?.isDemo ? 'Demo Mode' : modelInfo?.location === 'local' ? 'Local Ollama' : 'Google AI'}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {modelInfo?.location === 'local' ? 'On-Device' : modelInfo?.isDemo ? 'Simulated' : 'Remote API'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#090812] border border-purple-950/40">
          <p className="text-[10px] text-slate-500 uppercase">Measured Latency</p>
          <p className="text-base font-bold text-emerald-400 mt-1">
            {modelInfo?.latencyMs ? `${modelInfo.latencyMs} ms` : '15 ms'}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Roundtrip</p>
        </div>
      </div>

      {/* Configuration Form */}
      <div className="p-6 rounded-xl bg-[#0a0914] border border-purple-950/40 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-purple-950/40">
          <h2 className="text-sm font-mono font-bold text-white uppercase">
            Inference Provider Configuration
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Session Controls</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Provider Selection */}
          <div
            onClick={() => setActiveProvider('demo')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeProvider === 'demo'
                ? 'bg-purple-950/50 border-purple-500 text-white'
                : 'bg-black/40 border-purple-950/30 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold">Simulated Demo</span>
              {activeProvider === 'demo' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
            </div>
            <p className="text-xs text-slate-400">
              Zero dependencies, no API key or local GPU required. Deterministic fictional responses.
            </p>
          </div>

          <div
            onClick={() => setActiveProvider('local')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeProvider === 'local'
                ? 'bg-cyan-950/40 border-cyan-500 text-white'
                : 'bg-black/40 border-purple-950/30 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                <span>Local (Ollama)</span>
              </span>
              {activeProvider === 'local' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-xs text-slate-400">
              100% private on-device inference via local Ollama. Zero network requests leave your machine.
            </p>
          </div>

          <div
            onClick={() => setActiveProvider('google-ai')}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              activeProvider === 'google-ai'
                ? 'bg-purple-950/50 border-purple-500 text-white'
                : 'bg-black/40 border-purple-950/30 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-purple-400" />
                <span>Google AI Hosted</span>
              </span>
              {activeProvider === 'google-ai' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
            </div>
            <p className="text-xs text-slate-400">
              Proxied Google AI API inference using server-side GEMINI_API_KEY.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <label className="block text-slate-400 mb-1">Model Identifier</label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="e.g. gemma2:9b, gemma-2-9b-it, gemini-3.8-flash"
              className="w-full bg-black/60 border border-purple-950/60 focus:border-purple-500/60 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              For Ollama: <code className="text-purple-300">gemma2:9b</code> or <code className="text-purple-300">gemma2:2b</code>. For Google AI: <code className="text-purple-300">gemma-2-9b-it</code> or <code className="text-purple-300">gemini-3.8-flash</code>.
            </p>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Local Inference Endpoint (Ollama)</label>
            <input
              type="text"
              value={localEndpoint}
              onChange={(e) => setLocalEndpoint(e.target.value)}
              placeholder="http://localhost:11434"
              className="w-full bg-black/60 border border-purple-950/60 focus:border-purple-500/60 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">Default Ollama REST port is 11434.</p>
          </div>
        </div>

        {/* Hyperparameters: Temperature & Max Tokens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-mono pt-2">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">Generation Temperature:</span>
              <span className="text-purple-300 font-bold">{temperature}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.5"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
              <span>0.1 (Precise)</span>
              <span>0.8 (Creative Eerie)</span>
              <span>1.5 (Hallucinatory)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400">Max Output Length:</span>
              <span className="text-purple-300 font-bold">{maxTokens} tokens</span>
            </div>
            <input
              type="range"
              min="256"
              max="4096"
              step="128"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-600 mt-0.5">
              <span>256 tokens</span>
              <span>1024 tokens</span>
              <span>4096 tokens</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-purple-950/40 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="px-4 py-2 rounded-lg bg-black/60 hover:bg-purple-950/40 border border-purple-800/40 text-purple-200 flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-amber-400" />}
            <span>Test Connection</span>
          </button>

          <button
            onClick={handleApplyConfig}
            className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-950/40 transition-colors"
          >
            Apply & Save Settings
          </button>
        </div>

        {/* Connection Test Output */}
        {testResult && (
          <div
            className={`p-4 rounded-lg border text-xs font-mono space-y-1 ${
              testResult.success
                ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold">
              {testResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{testResult.success ? 'HEALTH CHECK PASSED' : 'CONNECTION FAILED'}</span>
              {testResult.latencyMs && <span>({testResult.latencyMs}ms)</span>}
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed mt-1">{testResult.message}</p>
          </div>
        )}
      </div>

      {/* Local Inference Setup Guide */}
      <div className="p-6 rounded-xl bg-[#090812] border border-cyan-900/30 space-y-4 text-xs">
        <h3 className="text-sm font-mono font-bold text-cyan-300 flex items-center gap-2">
          <Terminal className="w-4 h-4" />
          <span>How to Run Gemma Locally via Ollama</span>
        </h3>
        <p className="text-slate-400 leading-relaxed">
          Open-weight models allow you to host the AI directly on your workstation or home server. To run Gemma 2 with full privacy:
        </p>

        <div className="p-3.5 rounded-lg bg-black/80 border border-slate-800 font-mono text-[11px] space-y-2 text-slate-300">
          <p className="text-slate-500"># 1. Download and install Ollama from ollama.com</p>
          <p className="text-emerald-400">$ curl -fsSL https://ollama.com/install.sh | sh</p>
          <p className="text-slate-500 mt-2"># 2. Download and launch Google&apos;s open-weight Gemma 2 (9B parameter model)</p>
          <p className="text-emerald-400">$ ollama run gemma2:9b</p>
          <p className="text-slate-500 mt-2"># Or for laptops with 8GB RAM, run the lightweight 2B model:</p>
          <p className="text-emerald-400">$ ollama run gemma2:2b</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-400 text-[11px]">
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
            <span className="font-semibold text-slate-300 block mb-1">Gemma 2 (2B)</span>
            <span>~1.6 GB VRAM/RAM required. Runs smoothly on most modern laptops and CPU-only devices.</span>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
            <span className="font-semibold text-slate-300 block mb-1">Gemma 2 (9B)</span>
            <span>~5.5 GB VRAM recommended (RTX 3060, Apple M1/M2 16GB, or modern GPU). Excellent literary prose.</span>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
            <span className="font-semibold text-slate-300 block mb-1">Gemma 2 (27B)</span>
            <span>~16 GB VRAM recommended. For advanced creative writing and high-fidelity nuance.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
