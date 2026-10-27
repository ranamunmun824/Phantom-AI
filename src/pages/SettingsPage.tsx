import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  HardDrive,
  Download,
  Upload,
  Trash2,
  Volume2,
  VolumeX,
  Shield,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import { ConfirmModal } from '../components/ConfirmModal';

interface SettingsPageProps {
  audioActive: boolean;
  onToggleAudio: () => void;
  onOpenPrivacy: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  audioActive,
  onToggleAudio,
  onOpenPrivacy,
}) => {
  const [stats, setStats] = useState({
    memoriesCount: 0,
    storiesCount: 0,
    chatCount: 0,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);

  const refreshStats = () => {
    setStats({
      memoriesCount: StorageService.getMemories().length,
      storiesCount: StorageService.getSavedStories().length,
      chatCount: StorageService.getChatMessages().length,
    });
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const handleExportAll = () => {
    const jsonStr = StorageService.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phantom_ai_full_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setMessage('Full archive backup exported successfully.');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = StorageService.importBackup(text);
      if (res.success) {
        refreshStats();
        setMessage('Archive backup imported successfully.');
      } else {
        setMessage(`Import failed: ${res.message}`);
      }
    };
    reader.readAsText(file);
  };

  const executeClearAll = () => {
    StorageService.clearAllData();
    refreshStats();
    setMessage('All local storage has been wiped clean.');
    setShowEraseConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 pb-20">
      {/* Title */}
      <div className="p-6 rounded-xl bg-[#0b0a16] border border-purple-950/40 space-y-1">
        <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-semibold uppercase tracking-wider">
          <SettingsIcon className="w-4 h-4" />
          <span>System Preferences & Data Governance</span>
        </div>
        <h1 className="text-2xl font-mono font-bold text-white">SETTINGS & ARCHIVES</h1>
        <p className="text-xs text-slate-400">
          Manage your browser storage, export full backups, and configure atmospheric preferences.
        </p>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/40 text-xs font-mono text-purple-200 flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)}>✕</button>
        </div>
      )}

      {/* Local Storage & Data Management */}
      <div className="p-6 rounded-xl bg-[#090812] border border-purple-950/40 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-purple-950/40">
          <h2 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-purple-400" />
            <span>Browser-Local Storage</span>
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Zero-Cloud Storage</span>
        </div>

        {/* Current Data Quantities */}
        <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
          <div className="p-3 rounded-lg bg-black/40 border border-purple-950/30">
            <p className="text-[10px] text-slate-500 uppercase">Memory Cards</p>
            <p className="text-lg font-bold text-amber-300 mt-1">{stats.memoriesCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-purple-950/30">
            <p className="text-[10px] text-slate-500 uppercase">Saved Stories</p>
            <p className="text-lg font-bold text-purple-300 mt-1">{stats.storiesCount}</p>
          </div>
          <div className="p-3 rounded-lg bg-black/40 border border-purple-950/30">
            <p className="text-[10px] text-slate-500 uppercase">Chat Messages</p>
            <p className="text-lg font-bold text-cyan-300 mt-1">{stats.chatCount}</p>
          </div>
        </div>

        {/* Backup & Restore Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
          <button
            onClick={handleExportAll}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full JSON Archive</span>
          </button>

          <label className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-black/40 hover:bg-purple-950/30 border border-purple-900/40 text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Restore From Backup JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>

          <button
            onClick={() => setShowEraseConfirm(true)}
            className="w-full sm:w-auto ml-auto px-4 py-2.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/40 text-rose-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Erase All Local Data</span>
          </button>
        </div>
      </div>

      {/* Atmospheric Audio Settings */}
      <div className="p-6 rounded-xl bg-[#090812] border border-purple-950/40 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-purple-950/40">
          <h2 className="text-sm font-mono font-bold text-white uppercase flex items-center gap-2">
            {audioActive ? <Volume2 className="w-4 h-4 text-purple-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>Atmospheric Web Audio</span>
          </h2>
          <span className="text-[11px] font-mono text-purple-300">
            {audioActive ? 'Active' : 'Muted'}
          </span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          PHANTOM AI features a custom Web Audio API synthesizer that generates real-time, low-frequency atmospheric binaural pulses, typing clicks, and gentle meditative chimes without external audio assets.
        </p>

        <button
          onClick={onToggleAudio}
          className={`px-4 py-2 rounded-lg text-xs font-mono font-medium border transition-colors ${
            audioActive
              ? 'bg-purple-950/60 border-purple-500 text-purple-200'
              : 'bg-black/40 border-purple-900/30 text-slate-400 hover:text-white'
          }`}
        >
          {audioActive ? 'Disable Audio Ambience' : 'Enable Atmospheric Audio'}
        </button>
      </div>

      {/* Privacy Architecture Summary */}
      <div className="p-6 rounded-xl bg-[#090812] border border-purple-950/40 space-y-3 text-xs leading-relaxed text-slate-400">
        <h3 className="font-mono text-sm font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span>Security & Privacy Summary</span>
        </h3>
        <p>
          This application adheres strictly to zero-tracking ethics. All personal writings and memorial cards in the Digital Memory Vault reside exclusively inside your client browser. No telemetry or tracking pixels are embedded.
        </p>
        <button
          onClick={onOpenPrivacy}
          className="text-purple-400 hover:text-purple-300 underline font-mono text-xs pt-1 inline-block"
        >
          View Full Privacy Architecture Modal →
        </button>
      </div>

      <ConfirmModal
        isOpen={showEraseConfirm}
        title="Permanently Erase All Local Data?"
        message="Are you sure you want to completely erase all local memories, stories, and chats from this browser? This action cannot be undone."
        confirmLabel="Erase All Data"
        isDestructive={true}
        onConfirm={executeClearAll}
        onCancel={() => setShowEraseConfirm(false)}
      />
    </div>
  );
};
