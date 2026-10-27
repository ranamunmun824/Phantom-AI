import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Cpu,
  HardDrive,
  Ghost,
  Save,
  Clock,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ChatMessage, ModelInfo, PersonalityId } from '../types';
import { PERSONALITIES, PERSONALITY_LIST } from '../utils/personalities';
import { ApiClient } from '../services/apiClient';
import { StorageService } from '../services/storageService';
import { audioService } from '../services/audioService';
import { ConfirmModal } from '../components/ConfirmModal';

interface PhantomChatProps {
  modelInfo: ModelInfo | null;
}

export const PhantomChat: React.FC<PhantomChatProps> = ({ modelInfo }) => {
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityId>('phantom');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saveHistory, setSaveHistory] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const activePersona = PERSONALITIES[selectedPersonality];

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = StorageService.getChatMessages();
    if (saved.length > 0) {
      setMessages(saved);
    } else {
      // Initial welcome message from default personality
      const initial: ChatMessage = {
        id: 'init_welcome',
        role: 'assistant',
        content: activePersona.greeting,
        timestamp: Date.now(),
        personalityId: 'phantom',
        isSimulated: modelInfo?.isDemo ?? true,
        provider: modelInfo?.activeProvider ?? 'demo',
        model: modelInfo?.configuredModel || 'gemma-2-9b-it',
      };
      setMessages([initial]);
    }
  }, []);

  // Save to storage if enabled
  useEffect(() => {
    if (saveHistory && messages.length > 0) {
      StorageService.saveChatMessages(messages);
    }
  }, [messages, saveHistory]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle switching personality
  const handleSelectPersonality = (pId: PersonalityId) => {
    setSelectedPersonality(pId);
    const persona = PERSONALITIES[pId];

    // Append greeting as system announcement or assistant message if switching
    const greetingMsg: ChatMessage = {
      id: `greeting_${Date.now()}`,
      role: 'assistant',
      content: persona.greeting,
      timestamp: Date.now(),
      personalityId: pId,
      isSimulated: modelInfo?.isDemo ?? true,
      provider: modelInfo?.activeProvider ?? 'demo',
      model: modelInfo?.configuredModel || 'gemma-2-9b-it',
    };
    setMessages((prev) => [...prev, greetingMsg]);
    audioService.playSpectralPulse();
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isLoading) return;

    setErrorMsg(null);
    setInput('');
    audioService.playKeyClick();

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      // Build conversation payload for the model (limit last 8 messages for context)
      const payloadMessages = newHistory.slice(-8).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await ApiClient.sendChatMessage(
        payloadMessages,
        activePersona.systemInstruction,
        activePersona.id
      );

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: res.text,
        timestamp: Date.now(),
        personalityId: activePersona.id,
        isSimulated: res.isSimulated,
        provider: res.provider,
        model: res.model,
        latencyMs: res.latencyMs,
      };

      setMessages((prev) => [...prev, aiMessage]);
      audioService.playKeyClick();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error communicating with AI service.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const executeClear = () => {
    const resetMsg: ChatMessage = {
      id: `reset_${Date.now()}`,
      role: 'assistant',
      content: activePersona.greeting,
      timestamp: Date.now(),
      personalityId: activePersona.id,
      isSimulated: modelInfo?.isDemo ?? true,
      provider: modelInfo?.activeProvider ?? 'demo',
      model: modelInfo?.configuredModel || 'gemma-2-9b-it',
    };
    setMessages([resetMsg]);
    StorageService.clearChatMessages();
    setShowClearConfirm(false);
  };

  const handleRegenerate = async () => {
    if (isLoading || messages.length < 2) return;
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === 'user');
    if (lastUserIndex === -1) return;

    const actualIdx = messages.length - 1 - lastUserIndex;
    const userPrompt = messages[actualIdx].content;

    // Prune back to the user prompt and resend
    setMessages((prev) => prev.slice(0, actualIdx));
    handleSend(userPrompt);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-4">
      {/* Top Banner: Personality Selector */}
      <div className="p-4 rounded-xl bg-[#0b0a16] border border-purple-950/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold font-mono tracking-wider text-purple-200 uppercase flex items-center gap-2">
              <Ghost className="w-4 h-4 text-purple-400" />
              <span>Select AI Personality</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Each persona embodies a distinct voice from the digital ether.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setSaveHistory(!saveHistory)}
              className={`px-2.5 py-1 rounded border flex items-center gap-1.5 transition-colors ${
                saveHistory
                  ? 'bg-purple-950/50 border-purple-500/30 text-purple-200'
                  : 'bg-black/40 border-slate-800 text-slate-500'
              }`}
              title="Save chat history locally in your browser"
            >
              <Save className="w-3 h-3" />
              <span>{saveHistory ? 'History Saved' : 'History Off'}</span>
            </button>

            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-2.5 py-1 rounded border border-rose-950/40 text-rose-300 hover:text-rose-200 hover:bg-rose-950/30 flex items-center gap-1.5 transition-colors"
              title="Clear all messages"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Personality Cards Horizontal Scroller */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
          {PERSONALITY_LIST.map((p) => {
            const isSelected = selectedPersonality === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPersonality(p.id)}
                className={`p-2.5 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-400 text-white shadow-md shadow-purple-950/40'
                    : 'bg-black/40 border-purple-950/30 text-slate-400 hover:text-slate-200 hover:bg-purple-950/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: p.accentColor }}
                  />
                  {isSelected && <span className="text-[9px] font-mono text-purple-300">ACTIVE</span>}
                </div>
                <p className="text-xs font-semibold truncate text-slate-200">{p.name}</p>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{p.title}</p>
              </button>
            );
          })}
        </div>

        {/* Active persona descriptor */}
        <div className="pt-2 border-t border-purple-950/30 flex items-start gap-2 text-xs text-slate-300">
          <span className="text-purple-400 font-semibold shrink-0 font-mono">
            {activePersona.name}:
          </span>
          <span className="text-slate-400 text-xs italic">{activePersona.description}</span>
        </div>
      </div>

      {/* Main Chat Thread Area */}
      <div className="rounded-xl bg-[#080710] border border-purple-950/40 overflow-hidden flex flex-col h-[560px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const persona = msg.personalityId ? PERSONALITIES[msg.personalityId] : activePersona;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                {/* Author & Metadata line */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 px-1">
                  <span className={isUser ? 'text-slate-300' : 'text-purple-300 font-medium'}>
                    {isUser ? 'You' : persona?.name || 'The Phantom'}
                  </span>
                  <span>·</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                  {!isUser && msg.isSimulated && (
                    <>
                      <span>·</span>
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Simulated Demo</span>
                      </span>
                    </>
                  )}

                  {!isUser && !msg.isSimulated && (
                    <>
                      <span>·</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        {msg.provider === 'local' ? (
                          <HardDrive className="w-2.5 h-2.5" />
                        ) : (
                          <Cpu className="w-2.5 h-2.5" />
                        )}
                        <span>{msg.model || 'Gemma'}</span>
                      </span>
                    </>
                  )}

                  {msg.latencyMs && (
                    <>
                      <span>·</span>
                      <span>{msg.latencyMs}ms</span>
                    </>
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`relative group max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    isUser
                      ? 'bg-purple-900/40 text-purple-50 border border-purple-500/30 rounded-tr-sm'
                      : 'bg-[#100e1f] text-slate-200 border border-purple-950/50 rounded-tl-sm'
                  }`}
                >
                  {msg.content}

                  {/* Message Action Tools on Hover */}
                  {!isUser && (
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-black/60 rounded-md p-1 border border-purple-900/30">
                      <button
                        onClick={() => copyToClipboard(msg.id, msg.content)}
                        className="p-1 text-slate-400 hover:text-white rounded"
                        title="Copy response"
                        aria-label="Copy response"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex flex-col items-start space-y-1">
              <div className="flex items-center gap-2 text-[10px] font-mono text-purple-400 px-1">
                <span>{activePersona.name} is listening to the silicon...</span>
              </div>
              <div className="px-4 py-3 rounded-2xl bg-[#100e1f] border border-purple-950/50 text-purple-300 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping delay-150" />
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping delay-300" />
                <span className="text-slate-400 italic text-[11px] ml-1">Summoning response...</span>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-900/40 flex items-start gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Inference Interruption</p>
                <p className="text-slate-400 mt-0.5">{errorMsg}</p>
                <button
                  onClick={handleRegenerate}
                  className="mt-2 text-xs font-medium text-rose-200 underline hover:text-white"
                >
                  Retry with fallback
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pill Tray */}
        <div className="px-4 py-2 border-t border-purple-950/30 bg-[#06060c] overflow-x-auto flex items-center gap-2 text-xs">
          <span className="text-[11px] font-mono text-slate-500 shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-purple-400" />
            <span>Whisper:</span>
          </span>
          {activePersona.samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="shrink-0 px-2.5 py-1 rounded-full bg-purple-950/30 hover:bg-purple-900/40 border border-purple-900/30 hover:border-purple-600/40 text-purple-300 text-[11px] transition-colors disabled:opacity-50"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>

        {/* Bottom Input Form */}
        <div className="p-3 bg-[#0a0914] border-t border-purple-950/40 flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={`Speak with ${activePersona.name}... (Press Enter to send, Shift+Enter for newline)`}
            rows={1}
            className="flex-1 bg-black/60 border border-purple-900/30 focus:border-purple-500/60 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none resize-none max-h-32 transition-colors"
          />

          {messages.length > 1 && (
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isLoading}
              title="Regenerate last response"
              className="p-2.5 rounded-xl border border-purple-900/30 bg-purple-950/20 text-slate-400 hover:text-purple-200 hover:bg-purple-900/30 disabled:opacity-40 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-purple-950/40 transition-all cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showClearConfirm}
        title="Clear Conversation History?"
        message="Are you sure you want to clear your current conversation? All messages in this thread will be permanently deleted from your browser."
        confirmLabel="Clear Conversation"
        isDestructive={true}
        onConfirm={executeClear}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
