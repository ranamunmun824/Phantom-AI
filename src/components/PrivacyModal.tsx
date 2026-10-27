import React from 'react';
import { Shield, Lock, EyeOff, Server, HardDrive, Trash2, X, CheckCircle2 } from 'lucide-react';
import { StorageService } from '../services/storageService';
import { ConfirmModal } from './ConfirmModal';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataCleared?: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose, onDataCleared }) => {
  const [showConfirmWipe, setShowConfirmWipe] = React.useState(false);

  if (!isOpen) return null;

  const handleExecuteWipe = () => {
    StorageService.clearAllData();
    onDataCleared?.();
    setShowConfirmWipe(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="privacy-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl bg-[#0f0e1a] border border-purple-900/40 rounded-xl p-6 text-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/30">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-purple-400" />
            <h2 id="privacy-modal-title" className="text-lg font-semibold tracking-wide text-white">
              Privacy & Security Architecture
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close privacy modal"
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-purple-950/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 py-4 text-sm leading-relaxed text-slate-300">
          <div className="p-3.5 rounded-lg bg-purple-950/20 border border-purple-500/20 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-white">Zero Telemetry & Tracker-Free</p>
              <p className="text-xs text-slate-400 mt-1">
                PHANTOM AI does not include Google Analytics, Facebook Pixel, Mixpanel, or third-party advertising scripts.
                No cookies are installed on your device.
              </p>
            </div>
          </div>

          {/* Data Path Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-300">
              Inference Data Path Comparison
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-lg bg-black/40 border border-slate-800">
                <div className="flex items-center gap-2 text-cyan-400 font-medium mb-1.5">
                  <HardDrive className="w-4 h-4" />
                  <span>Local Open-Weight (Ollama)</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Prompts and model outputs never leave your computer. Inference executes entirely on your CPU/GPU hardware.
                  Requires local Ollama daemon.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-black/40 border border-slate-800">
                <div className="flex items-center gap-2 text-purple-400 font-medium mb-1.5">
                  <Server className="w-4 h-4" />
                  <span>Hosted Google AI API</span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  Prompts are proxied through our backend server to protect API keys. Prompts are never logged to public databases.
                </p>
              </div>
            </div>
          </div>

          {/* Storage Disclosure */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-300">
              Client Storage Disclosure
            </h3>
            <p className="text-xs text-slate-400">
              Personal memorials (Memory Vault), generated stories, and chat sessions are stored exclusively in your browser&apos;s
              <code className="mx-1 px-1.5 py-0.5 bg-purple-950/60 rounded text-purple-300">localStorage</code>.
              Browser storage is unencrypted. If you clear your browser cache or browse in incognito mode, saved entries may be deleted.
              You can export a JSON backup at any time.
            </p>
          </div>

          {/* Memory Vault Guarantee */}
          <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/25">
            <div className="flex items-center gap-2 text-amber-300 font-medium text-xs mb-1">
              <Lock className="w-4 h-4" />
              <span>Digital Remembrance Guarantee</span>
            </div>
            <p className="text-xs text-amber-200/80">
              Remembrance cards in the Digital Memory Vault are never automatically transmitted to AI inference endpoints or third parties.
              The vault is a quiet, sacred space that strictly respects personal memories.
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-purple-900/30">
          <button
            onClick={() => setShowConfirmWipe(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-900/40"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Wipe Local Browser Storage</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-lg shadow-purple-900/20"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmWipe}
        title="Wipe Local Browser Storage?"
        message="Are you sure you want to delete all saved memories, stories, and chat history from this browser? This action cannot be undone."
        confirmLabel="Wipe All Data"
        isDestructive={true}
        onConfirm={handleExecuteWipe}
        onCancel={() => setShowConfirmWipe(false)}
      />
    </div>
  );
};
