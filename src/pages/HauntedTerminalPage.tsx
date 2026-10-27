import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  ShieldAlert,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2,
  Sliders,
  Volume2,
} from 'lucide-react';
import { ApiClient } from '../services/apiClient';
import { audioService } from '../services/audioService';
import { ModelInfo } from '../types';

interface HauntedTerminalProps {
  modelInfo: ModelInfo | null;
}

interface LogLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  text: string;
  isAiGenerated?: boolean;
}

export const HauntedTerminalPage: React.FC<HauntedTerminalProps> = ({ modelInfo }) => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [scanlinesActive, setScanlinesActive] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const initialLogs: LogLine[] = [
    {
      id: 'boot_1',
      type: 'system',
      text: `PHANTOM-OS v0.9.4-ghost (tty1) - Sector 0x4F92
Memory allocation: 640 KB Base / 320 KB Living Operator / 320 KB Specter
WARNING: Simulated Sandboxed Environment. Zero host shell access.`,
    },
    {
      id: 'boot_2',
      type: 'output',
      text: `Type 'help' to inspect supported commands.
Type 'summon' or 'whisper' to commune with the active AI model.`,
    },
  ];

  const [logs, setLogs] = useState<LogLine[]>(initialLogs);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = command.trim();
    if (!raw) return;

    audioService.playKeyClick();
    setHistory((prev) => [...prev, raw]);
    setHistoryIdx(-1);
    setCommand('');

    // Append input line
    const inputLine: LogLine = {
      id: `in_${Date.now()}`,
      type: 'input',
      text: `ghost@phantom:~$ ${raw}`,
    };
    setLogs((prev) => [...prev, inputLine]);

    if (raw.toLowerCase() === 'clear') {
      setLogs([]);
      return;
    }

    if (raw.toLowerCase() === 'exit') {
      setLogs(initialLogs);
      return;
    }

    setIsProcessing(true);

    try {
      const res = await ApiClient.executeTerminalCommand(raw);

      if (res.output === '__CLEAR__') {
        setLogs([]);
      } else if (res.output === '__EXIT__') {
        setLogs(initialLogs);
      } else {
        const outLine: LogLine = {
          id: `out_${Date.now()}`,
          type: res.isError ? 'error' : 'output',
          text: res.output,
          isAiGenerated: res.isAiGenerated,
        };
        setLogs((prev) => [...prev, outLine]);
        if (res.isAiGenerated) {
          audioService.playSpectralPulse();
        }
      }
    } catch (err) {
      setLogs((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          type: 'error',
          text: `Command error: ${err instanceof Error ? err.message : String(err)}`,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setCommand(history[nextIdx] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx >= history.length) {
          setHistoryIdx(-1);
          setCommand('');
        } else {
          setHistoryIdx(nextIdx);
          setCommand(history[nextIdx] || '');
        }
      }
    }
  };

  return (
    <div
      className={`space-y-4 py-4 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-black p-4 flex flex-col justify-between' : 'max-w-5xl mx-auto'
      }`}
    >
      {/* Top Banner & Security Disclosure */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#0b0a16] border border-purple-950/40 text-xs font-mono">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white tracking-wide uppercase">HAUNTED TERMINAL SIMULATION</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 text-[10px]">
            SAFE SIMULATION
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <button
            onClick={() => setScanlinesActive(!scanlinesActive)}
            className="flex items-center gap-1.5 hover:text-white"
            title="Toggle CRT Scanlines"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Scanlines: {scanlinesActive ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={() => setLogs(initialLogs)}
            className="flex items-center gap-1.5 hover:text-white"
            title="Reset Terminal"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 hover:text-white"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Terminal Main Window */}
      <div
        className={`relative rounded-xl border border-emerald-900/40 bg-[#050806] font-mono text-emerald-400 text-xs sm:text-sm overflow-hidden flex flex-col shadow-2xl ${
          isFullscreen ? 'flex-1' : 'h-[580px]'
        }`}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Optional Scanlines effect overlay */}
        {scanlinesActive && (
          <div className="absolute inset-0 scanlines opacity-50 z-10 pointer-events-none" />
        )}

        {/* Phosphor glow atmosphere */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-3 z-0 terminal-glow">
          {logs.map((log) => {
            if (log.type === 'input') {
              return (
                <div key={log.id} className="text-slate-300">
                  {log.text}
                </div>
              );
            }
            if (log.type === 'error') {
              return (
                <div key={log.id} className="text-rose-400 bg-rose-950/20 p-2 rounded border border-rose-900/30 whitespace-pre-wrap">
                  {log.text}
                </div>
              );
            }
            if (log.type === 'system') {
              return (
                <div key={log.id} className="text-purple-400/80 italic border-b border-emerald-950/40 pb-2 whitespace-pre-wrap">
                  {log.text}
                </div>
              );
            }
            return (
              <div
                key={log.id}
                className={`whitespace-pre-wrap ${
                  log.isAiGenerated
                    ? 'p-3 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300'
                    : 'text-emerald-400'
                }`}
              >
                {log.text}
              </div>
            );
          })}

          {isProcessing && (
            <div className="text-purple-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Querying the phantom kernel...</span>
            </div>
          )}

          <div ref={terminalEndRef} />
        </div>

        {/* Command Line Input Footer */}
        <form
          onSubmit={handleCommandSubmit}
          className="relative z-20 p-3 sm:p-4 bg-[#030504] border-t border-emerald-950/50 flex items-center gap-2"
        >
          <span className="text-emerald-500 select-none font-bold">ghost@phantom:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            autoFocus
            className="flex-1 bg-transparent text-emerald-300 font-mono text-xs sm:text-sm focus:outline-none caret-emerald-400"
            placeholder="Type 'help', 'status', 'ls', 'summon'..."
          />
          <span className="cursor-blink inline-block w-2 h-4 bg-emerald-400" />
        </form>
      </div>

      {/* Quick Command Buttons Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
        <span className="text-[11px] text-slate-500">Quick Commands:</span>
        {['help', 'status', 'whoami', 'ls', 'scan', 'summon', 'whisper', 'readme'].map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              setCommand(cmd);
              inputRef.current?.focus();
            }}
            className="px-2.5 py-1 rounded bg-[#0b0a16] hover:bg-emerald-950/40 border border-purple-950/40 hover:border-emerald-600/40 text-emerald-400 text-[11px] transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
};
