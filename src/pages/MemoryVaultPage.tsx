import React, { useState, useEffect } from 'react';
import {
  Heart,
  Flame,
  Plus,
  Download,
  Trash2,
  Edit2,
  Eye,
  Check,
  Shield,
  FileText,
  Sparkles,
  Music,
  Coffee,
  Quote,
  MessageCircle,
  Calendar,
} from 'lucide-react';
import { MemoryCard } from '../types';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import { ConfirmModal } from '../components/ConfirmModal';

export const MemoryVaultPage: React.FC = () => {
  const [memories, setMemories] = useState<MemoryCard[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewCard, setPreviewCard] = useState<MemoryCard | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cardToDelete, setCardToDelete] = useState<{ id: string; name: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    displayName: '',
    relationship: '',
    story: '',
    favoriteFood: '',
    favoriteSong: '',
    meaningfulQuote: '',
    personalMessage: '',
    dateOrOccasion: '',
  });

  useEffect(() => {
    setMemories(StorageService.getMemories());
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleOpenCreate = () => {
    setFormData({
      displayName: '',
      relationship: '',
      story: '',
      favoriteFood: '',
      favoriteSong: '',
      meaningfulQuote: '',
      personalMessage: '',
      dateOrOccasion: '',
    });
    setEditingId(null);
    setIsEditing(true);
    setPreviewCard(null);
  };

  const handleOpenEdit = (card: MemoryCard) => {
    setFormData({
      displayName: card.displayName,
      relationship: card.relationship || '',
      story: card.story,
      favoriteFood: card.favoriteFood,
      favoriteSong: card.favoriteSong,
      meaningfulQuote: card.meaningfulQuote,
      personalMessage: card.personalMessage,
      dateOrOccasion: card.dateOrOccasion,
    });
    setEditingId(card.id);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!formData.displayName.trim() || !formData.story.trim()) {
      setFormError('Please provide at least a name and a story or cherished memory.');
      return;
    }

    const saved = StorageService.saveMemory(formData, editingId || undefined);
    setMemories(StorageService.getMemories());
    setIsEditing(false);
    audioService.playRemembranceChime();
    showNotification(`Remembrance for "${saved.displayName}" preserved.`);
  };

  const executeDelete = () => {
    if (!cardToDelete) return;
    StorageService.deleteMemory(cardToDelete.id);
    setMemories(StorageService.getMemories());
    if (previewCard?.id === cardToDelete.id) setPreviewCard(null);
    showNotification(`Remembrance for "${cardToDelete.name}" removed.`);
    setCardToDelete(null);
  };

  const handleExportJson = () => {
    const jsonStr = StorageService.exportMemoriesJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phantom_memory_vault_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Memory archive exported.');
  };

  const handleExportCardText = (card: MemoryCard) => {
    const text = StorageService.exportMemoryCardText(card);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `remembrance_${card.displayName.toLowerCase().replace(/[^a-z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`Downloaded card for ${card.displayName}.`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 pb-16">
      {/* Respectful Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-950/20 via-[#0e0c18] to-[#07070b] border border-amber-900/30 text-slate-200 space-y-3 candle-glow">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Sanctuary of Digital Remembrance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-100">
              DIGITAL MEMORY VAULT
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/40 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Preserve a Memory</span>
            </button>

            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-amber-950/30 border border-amber-800/40 text-amber-200 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export All</span>
            </button>
          </div>
        </div>

        {/* Gentle ethical disclaimer */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-amber-900/20 text-xs text-amber-200/80 leading-relaxed flex items-start gap-3">
          <Heart className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <em>&ldquo;This space preserves the stories we choose to remember. It does not recreate or contact the people we miss.&rdquo;</em>
            <span className="block text-[11px] text-slate-400 mt-1">
              Privacy Guarantee: All remembrance cards are stored strictly inside your browser&apos;s local storage. They are never transmitted to AI models or third-party servers.
            </span>
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 font-mono flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)}>✕</button>
        </div>
      )}

      {/* CREATE / EDIT FORM MODAL */}
      {isEditing && (
        <div className="p-6 rounded-2xl bg-[#0e0c1a] border border-amber-800/40 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-amber-900/30">
            <h2 className="text-base font-serif font-bold text-amber-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{editingId ? 'Edit Remembrance Card' : 'Preserve a New Remembrance'}</span>
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          {formError && (
            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/50 text-xs text-rose-300 font-mono">
              {formError}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Name / Nickname <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="e.g. Abuela Elena, Old Friend Leo"
                  className="w-full bg-black/60 border border-amber-900/40 focus:border-amber-400/60 rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Relationship / Title</label>
                <input
                  type="text"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  placeholder="e.g. Grandmother, Mentor, Loyal Companion"
                  className="w-full bg-black/60 border border-amber-900/40 focus:border-amber-400/60 rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">
                Story or Cherished Memory <span className="text-amber-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.story}
                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                placeholder="Share a moment you never want to forget—their laughter, an afternoon walk, a lesson taught..."
                className="w-full bg-black/60 border border-amber-900/40 focus:border-amber-400/60 rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                  <Coffee className="w-3 h-3 text-amber-400" />
                  <span>Favorite Food / Drink</span>
                </label>
                <input
                  type="text"
                  value={formData.favoriteFood}
                  onChange={(e) => setFormData({ ...formData, favoriteFood: e.target.value })}
                  placeholder="e.g. Fresh peach pie & black coffee"
                  className="w-full bg-black/60 border border-amber-900/40 focus:border-amber-400/60 rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                  <Music className="w-3 h-3 text-amber-400" />
                  <span>Favorite Song or Music</span>
                </label>
                <input
                  type="text"
                  value={formData.favoriteSong}
                  onChange={(e) => setFormData({ ...formData, favoriteSong: e.target.value })}
                  placeholder="e.g. Autumn in New York"
                  className="w-full bg-black/60 border border-amber-900/40 focus:border-amber-400/60 rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>Date or Special Occasion</span>
                </label>
                <input
                  type="text"
                  value={formData.dateOrOccasion}
                  onChange={(e) => setFormData({ ...formData, dateOrOccasion: e.target.value })}
                  placeholder="e.g. Autumn Equinox / 1948 - 2021"
                  className="w-full bg-black/60 border border-amber-900/40 focus:border-amber-400/60 rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                <Quote className="w-3 h-3 text-amber-400" />
                <span>Meaningful Quote or Saying</span>
              </label>
              <input
                type="text"
                value={formData.meaningfulQuote}
                onChange={(e) => setFormData({ ...formData, meaningfulQuote: e.target.value })}
                placeholder="Words they often said or lived by..."
                className="w-full bg-black/60 border border-amber-900/40 focus:border-amber-400/60 rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 flex items-center gap-1">
                <MessageCircle className="w-3 h-3 text-amber-400" />
                <span>Personal Message / Dedication</span>
              </label>
              <textarea
                rows={2}
                value={formData.personalMessage}
                onChange={(e) => setFormData({ ...formData, personalMessage: e.target.value })}
                placeholder="A quiet message whispered to their memory..."
                className="w-full bg-black/60 border border-amber-900/40 focus:border-amber-400/60 rounded-lg px-3 py-2 text-slate-100 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-semibold shadow-md transition-colors"
              >
                Save to Vault
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {memories.map((card) => (
          <div
            key={card.id}
            className="p-6 rounded-2xl bg-[#0c0a18] border border-amber-900/30 hover:border-amber-500/40 transition-all space-y-4 relative flex flex-col justify-between group candle-glow"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-serif font-bold text-amber-100">{card.displayName}</h3>
                  {card.relationship && (
                    <p className="text-xs text-amber-400/80 font-mono mt-0.5">{card.relationship}</p>
                  )}
                  {card.dateOrOccasion && (
                    <p className="text-[11px] text-slate-500 font-mono">{card.dateOrOccasion}</p>
                  )}
                </div>

                <div className="w-8 h-8 rounded-full bg-amber-950/40 border border-amber-600/30 flex items-center justify-center text-amber-400">
                  <Flame className="w-4 h-4 animate-pulse" />
                </div>
              </div>

              {/* Story */}
              <div className="text-sm font-serif text-slate-200 leading-relaxed italic border-l-2 border-amber-500/40 pl-3">
                &ldquo;{card.story}&rdquo;
              </div>

              {/* Attributes */}
              <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-amber-950/40">
                {card.meaningfulQuote && (
                  <div className="flex items-start gap-2">
                    <Quote className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-amber-200">{card.meaningfulQuote}</span>
                  </div>
                )}
                {card.favoriteFood && (
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <Coffee className="w-3 h-3 text-amber-400" />
                    <span>Favorite: {card.favoriteFood}</span>
                  </div>
                )}
                {card.favoriteSong && (
                  <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                    <Music className="w-3 h-3 text-amber-400" />
                    <span>Song: {card.favoriteSong}</span>
                  </div>
                )}
                {card.personalMessage && (
                  <div className="pt-2 text-[11px] text-amber-300/80 italic">
                    {card.personalMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-amber-950/30 flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-slate-500">
                Preserved: {new Date(card.createdAt).toLocaleDateString()}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportCardText(card)}
                  className="p-1.5 text-slate-400 hover:text-amber-200 rounded"
                  title="Download Remembrance Card as Text"
                  aria-label="Download Remembrance Card"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleOpenEdit(card)}
                  className="p-1.5 text-slate-400 hover:text-amber-200 rounded"
                  title="Edit Card"
                  aria-label="Edit Remembrance Card"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setCardToDelete({ id: card.id, name: card.displayName })}
                  className="p-1.5 text-rose-400 hover:text-rose-200 rounded"
                  title="Delete Card"
                  aria-label="Delete Remembrance Card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!cardToDelete}
        title="Remove Remembrance Card?"
        message={`Are you sure you want to remove the remembrance card for "${cardToDelete?.name}" from this device? This action cannot be reversed.`}
        confirmLabel="Remove Card"
        isDestructive={true}
        onConfirm={executeDelete}
        onCancel={() => setCardToDelete(null)}
      />
    </div>
  );
};
