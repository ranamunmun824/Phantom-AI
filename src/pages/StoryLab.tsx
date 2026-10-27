import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Sparkles,
  Download,
  Copy,
  Check,
  BookmarkPlus,
  RefreshCw,
  Flame,
  HelpCircle,
  Eye,
  Trash2,
  Cpu,
  Clock,
  FileText,
} from 'lucide-react';
import { StoryParams, StoryResult, HorrorSubgenre, StoryLength, FearIntensity, NarrativePerspective, EndingType, ModelInfo } from '../types';
import { ApiClient } from '../services/apiClient';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';

interface StoryLabProps {
  modelInfo: ModelInfo | null;
}

const SUBGENRES: Array<{ id: HorrorSubgenre; label: string; desc: string }> = [
  { id: 'haunted_tech', label: 'Haunted Technology', desc: 'Anomalies in hardware, code, and smart devices' },
  { id: 'old_computers', label: 'Ghosts in Old Computers', desc: 'Ancient mainframes, magnetic tapes, forgotten sectors' },
  { id: 'abandoned_internet', label: 'Abandoned Internet', desc: 'Dead forums, unindexed URLs, frozen chatrooms' },
  { id: 'psychological', label: 'Psychological Horror', desc: 'Paranoia, memory lapses, cognitive unraveling' },
  { id: 'cosmic', label: 'Cosmic Horror', desc: 'Indifferent void, impossible geometry, sanity erosion' },
  { id: 'gothic', label: 'Gothic Horror', desc: 'Decaying mansions, ancestral curses, perpetual fog' },
  { id: 'supernatural', label: 'Supernatural Horror', desc: 'Restless apparitions, specters, séances' },
  { id: 'folklore', label: 'Folklore-Inspired', desc: 'Ancient rural myths, forgotten woods, blood oaths' },
];

const FEAR_LEVELS: Array<{ id: FearIntensity; label: string; icon: string }> = [
  { id: 'whispers', label: 'Mild (Whispers in the Dark)', icon: '🕯️' },
  { id: 'creeping_dread', label: 'Medium (Creeping Dread)', icon: '👁️' },
  { id: 'eldritch', label: 'High (Eldritch Nightmare)', icon: '🌑' },
  { id: 'digital_terror', label: 'Extreme (Pure Digital Terror)', icon: '⚡' },
];

export const StoryLab: React.FC<StoryLabProps> = ({ modelInfo }) => {
  const [params, setParams] = useState<StoryParams>({
    title: 'The Unallocated Sector',
    character: 'A solitary nocturnal systems administrator',
    setting: 'A disused telecommunications bunker in late autumn',
    subgenre: 'old_computers',
    length: 'short',
    fearIntensity: 'creeping_dread',
    perspective: 'first_person',
    ending: 'unexpected_twist',
    keywords: 'phosphor screen, cooling fan hum, magnetic tape',
  });

  const [currentStory, setCurrentStory] = useState<StoryResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModifying, setIsModifying] = useState(false);
  const [savedStories, setSavedStories] = useState<StoryResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    setSavedStories(StorageService.getSavedStories());
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    audioService.playSpectralPulse();

    try {
      const res = await ApiClient.generateStory(params);
      setCurrentStory(res);
      audioService.playKeyClick();
      showNotification('Story materialized from the silicon.');
    } catch (err) {
      console.error(err);
      showNotification('Error generating story. Using fallback.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleModifyStory = async (action: 'continue' | 'change_ending' | 'scarier' | 'mysterious') => {
    if (!currentStory) return;
    setIsModifying(true);
    audioService.playKeyClick();

    try {
      const res = await ApiClient.continueStory(currentStory.content, action);
      setCurrentStory({
        ...currentStory,
        content: action === 'continue' ? `${currentStory.content}\n\n---\n\n${res.text}` : res.text,
        wordCount: res.wordCount,
        isSimulated: res.isSimulated,
        latencyMs: res.latencyMs,
      });
      showNotification(`Story modified (${action.replace('_', ' ')}).`);
    } catch (err) {
      console.error(err);
      showNotification('Modification failed. Please try again.');
    } finally {
      setIsModifying(false);
    }
  };

  const handleSaveLocally = () => {
    if (!currentStory) return;
    StorageService.saveStory(currentStory);
    setSavedStories(StorageService.getSavedStories());
    audioService.playRemembranceChime();
    showNotification('Saved to your local browser vault.');
  };

  const handleDeleteSaved = (id: string) => {
    StorageService.deleteStory(id);
    setSavedStories(StorageService.getSavedStories());
    showNotification('Story removed from local storage.');
  };

  const handleDownload = (format: 'txt' | 'md') => {
    if (!currentStory) return;
    const filename = `${currentStory.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_phantom.${format}`;

    let content = '';
    if (format === 'md') {
      content = `# ${currentStory.title}

> *A horror story generated with PHANTOM AI (${currentStory.model} · ${currentStory.provider})*
> *Setting:* ${currentStory.params.setting} | *Subgenre:* ${currentStory.params.subgenre}

${currentStory.content}

---
*Created with PHANTOM AI — The Ghost in Your Machine*
`;
    } else {
      content = `========================================================
${currentStory.title.toUpperCase()}
Generated by PHANTOM AI [Model: ${currentStory.model} | Provider: ${currentStory.provider}]
========================================================

${currentStory.content}

========================================================
Preserved on: ${new Date(currentStory.createdAt).toLocaleString()}
`;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`Downloaded ${filename}`);
  };

  const handleCopy = () => {
    if (!currentStory) return;
    navigator.clipboard.writeText(currentStory.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showNotification('Story copied to clipboard.');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#0b0a16] border border-purple-950/40">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Interactive Horror Laboratory</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-mono font-bold text-white mt-1">
            GHOST STORY GENERATOR
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Craft original horror literature tuned to exact psychological settings, subgenres, and fear scales.
          </p>
        </div>

        {/* Tab switch between Creation Lab and Saved Vault */}
        <div className="flex items-center gap-2 bg-black/60 p-1 rounded-lg border border-purple-950/40 text-xs font-mono">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTab === 'create'
                ? 'bg-purple-900/60 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Story Lab
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-purple-900/60 text-white font-medium shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Saved Stories</span>
            <span className="text-[10px] px-1 rounded bg-purple-950 text-purple-300">
              {savedStories.length}
            </span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 font-mono flex items-center justify-between">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {activeTab === 'saved' ? (
        /* SAVED STORIES VIEW */
        <div className="space-y-4">
          {savedStories.length === 0 ? (
            <div className="p-12 text-center rounded-xl bg-[#090812] border border-purple-950/40 text-slate-400 space-y-2">
              <BookOpen className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm font-medium text-slate-300">No stories saved locally yet.</p>
              <p className="text-xs text-slate-500">
                Generate a story in the lab and click &ldquo;Save to Local Vault&rdquo; to keep it in your browser.
              </p>
              <button
                onClick={() => setActiveTab('create')}
                className="mt-3 px-4 py-2 rounded-lg bg-purple-900/50 hover:bg-purple-800/60 text-purple-200 text-xs"
              >
                Go to Story Lab
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedStories.map((story) => (
                <div
                  key={story.id}
                  className="p-5 rounded-xl bg-[#0b0a16] border border-purple-950/40 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                      <span className="text-purple-400">{story.params.subgenre}</span>
                    </div>
                    <h3 className="text-base font-semibold text-white font-mono">{story.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {story.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-purple-950/30 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setCurrentStory(story);
                        setActiveTab('create');
                      }}
                      className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open in Reader</span>
                    </button>

                    <button
                      onClick={() => handleDeleteSaved(story.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 rounded transition-colors"
                      title="Delete story"
                      aria-label="Delete saved story"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* STORY LAB WORKBENCH (Configuration + Reader) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT PANEL: CONFIGURATION PARAMETERS (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-xl bg-[#0a0914] border border-purple-950/40 space-y-4 text-xs">
              <h2 className="font-mono text-sm font-semibold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Story Parameters</span>
              </h2>

              {/* Title & Character */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Story Title</label>
                  <input
                    type="text"
                    value={params.title}
                    onChange={(e) => setParams({ ...params, title: e.target.value })}
                    placeholder="e.g. The Unallocated Sector"
                    className="w-full bg-black/60 border border-purple-950/60 focus:border-purple-500/60 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Main Character</label>
                  <input
                    type="text"
                    value={params.character}
                    onChange={(e) => setParams({ ...params, character: e.target.value })}
                    placeholder="e.g. A retired radar technician"
                    className="w-full bg-black/60 border border-purple-950/60 focus:border-purple-500/60 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Atmospheric Setting</label>
                  <input
                    type="text"
                    value={params.setting}
                    onChange={(e) => setParams({ ...params, setting: e.target.value })}
                    placeholder="e.g. An abandoned fiber-optic substation during a blizzard"
                    className="w-full bg-black/60 border border-purple-950/60 focus:border-purple-500/60 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Horror Subgenre */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Horror Subgenre</label>
                <select
                  value={params.subgenre}
                  onChange={(e) => setParams({ ...params, subgenre: e.target.value as HorrorSubgenre })}
                  className="w-full bg-black/60 border border-purple-950/60 focus:border-purple-500/60 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                >
                  {SUBGENRES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fear Intensity & Story Length */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Fear Intensity</label>
                  <select
                    value={params.fearIntensity}
                    onChange={(e) => setParams({ ...params, fearIntensity: e.target.value as FearIntensity })}
                    className="w-full bg-black/60 border border-purple-950/60 focus:border-purple-500/60 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none text-xs"
                  >
                    {FEAR_LEVELS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Story Length</label>
                  <select
                    value={params.length}
                    onChange={(e) => setParams({ ...params, length: e.target.value as StoryLength })}
                    className="w-full bg-black/60 border border-purple-950/60 focus:border-purple-500/60 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none text-xs"
                  >
                    <option value="flash">Flash Fiction (~300w)</option>
                    <option value="short">Short Story (~700w)</option>
                    <option value="extended">Extended Story (~1200w)</option>
                  </select>
                </div>
              </div>

              {/* Perspective & Ending */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Perspective</label>
                  <select
                    value={params.perspective}
                    onChange={(e) => setParams({ ...params, perspective: e.target.value as NarrativePerspective })}
                    className="w-full bg-black/60 border border-purple-950/60 focus:border-purple-500/60 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none text-xs"
                  >
                    <option value="first_person">First Person ("I")</option>
                    <option value="second_person">Second Person ("You")</option>
                    <option value="third_limited">Third Limited ("He/She")</option>
                    <option value="omniscient">Omniscient Observer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Ending Style</label>
                  <select
                    value={params.ending}
                    onChange={(e) => setParams({ ...params, ending: e.target.value as EndingType })}
                    className="w-full bg-black/60 border border-purple-950/60 focus:border-purple-500/60 rounded-lg px-2.5 py-2 text-slate-200 focus:outline-none text-xs"
                  >
                    <option value="unexpected_twist">Unexpected Twist</option>
                    <option value="open">Open / Ambiguous</option>
                    <option value="bittersweet">Bittersweet</option>
                    <option value="dark">Dark & Unrelenting</option>
                    <option value="hopeful">Hopeful Survival</option>
                  </select>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Key Motifs (Optional)</label>
                <input
                  type="text"
                  value={params.keywords}
                  onChange={(e) => setParams({ ...params, keywords: e.target.value })}
                  placeholder="e.g. green phosphor, 3:17 AM, cold draft"
                  className="w-full bg-black/60 border border-purple-950/60 focus:border-purple-500/60 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || isModifying}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Summoning Narrative...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-4 h-4 text-amber-300" />
                    <span>GENERATE STORY</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: READING VIEW & STORY WORKSHOP (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-xl bg-[#090812] border border-purple-950/40 min-h-[580px] flex flex-col justify-between">
              {currentStory ? (
                <div className="space-y-6">
                  {/* Story Reader Header */}
                  <div className="space-y-2 pb-4 border-b border-purple-950/40">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
                      <div className="flex items-center gap-2">
                        <span className="text-purple-400 font-semibold uppercase">{currentStory.params.subgenre}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>~{Math.max(1, Math.round(currentStory.wordCount / 200))} min read</span>
                        </span>
                        <span>·</span>
                        <span>{currentStory.wordCount} words</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {currentStory.isSimulated ? (
                          <span className="text-amber-400 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Demo Model</span>
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            <span>{currentStory.model}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
                      {currentStory.title}
                    </h2>
                  </div>

                  {/* Story Body */}
                  <div className="text-slate-200 font-serif text-sm sm:text-base leading-relaxed whitespace-pre-wrap selection:bg-purple-900 selection:text-white">
                    {currentStory.content}
                  </div>

                  {/* Narrative Expansion & Modification Workshop */}
                  <div className="pt-6 border-t border-purple-950/40 space-y-3">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500">
                      Interactive Narrative Modification
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleModifyStory('continue')}
                        disabled={isModifying}
                        className="px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 text-xs font-mono disabled:opacity-50 transition-colors"
                      >
                        CONTINUE STORY
                      </button>

                      <button
                        onClick={() => handleModifyStory('change_ending')}
                        disabled={isModifying}
                        className="px-3 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 text-purple-200 text-xs font-mono disabled:opacity-50 transition-colors"
                      >
                        CHANGE THE ENDING
                      </button>

                      <button
                        onClick={() => handleModifyStory('scarier')}
                        disabled={isModifying}
                        className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 border border-rose-500/30 text-rose-200 text-xs font-mono disabled:opacity-50 transition-colors"
                      >
                        MAKE IT SCARIER
                      </button>

                      <button
                        onClick={() => handleModifyStory('mysterious')}
                        disabled={isModifying}
                        className="px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 text-cyan-200 text-xs font-mono disabled:opacity-50 transition-colors"
                      >
                        MAKE IT MORE MYSTERIOUS
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty State */
                <div className="my-auto text-center space-y-3 py-12">
                  <BookOpen className="w-12 h-12 text-purple-900/60 mx-auto" />
                  <p className="font-mono text-sm text-slate-300">The story parchment is currently blank.</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Configure your parameters on the left and click &ldquo;Generate Story&rdquo; to summon an original horror narrative via Gemma.
                  </p>
                </div>
              )}

              {/* Bottom Utility Actions (Copy, Download, Save) */}
              {currentStory && (
                <div className="pt-6 border-t border-purple-950/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-lg bg-black/40 border border-purple-900/30 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => handleDownload('txt')}
                      className="px-3 py-1.5 rounded-lg bg-black/40 border border-purple-900/30 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>.txt</span>
                    </button>

                    <button
                      onClick={() => handleDownload('md')}
                      className="px-3 py-1.5 rounded-lg bg-black/40 border border-purple-900/30 text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>.md</span>
                    </button>
                  </div>

                  <button
                    onClick={handleSaveLocally}
                    className="px-3.5 py-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/40 text-purple-200 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5 text-purple-400" />
                    <span>Save to Local Vault</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
