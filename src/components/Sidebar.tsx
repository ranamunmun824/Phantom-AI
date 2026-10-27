import React from 'react';
import {
  Ghost,
  MessageSquare,
  BookOpen,
  Terminal,
  Heart,
  Cpu,
  Compass,
  FileCode,
  Settings,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { ModelInfo } from '../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  mobileNavOpen: boolean;
  onCloseMobileNav: () => void;
  modelInfo: ModelInfo | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileNavOpen,
  onCloseMobileNav,
  modelInfo,
}) => {
  const navItems = [
    { id: 'home', label: 'Sanctum (Home)', icon: Ghost, badge: undefined },
    { id: 'chat', label: 'Phantom Chat', icon: MessageSquare, badge: 'AI' },
    { id: 'story', label: 'Story Generator', icon: BookOpen, badge: 'Gemma' },
    { id: 'terminal', label: 'Haunted Terminal', icon: Terminal, badge: 'Safe' },
    { id: 'vault', label: 'Memory Vault', icon: Heart, badge: 'Local' },
    { id: 'model-lab', label: 'Model Lab', icon: Cpu, badge: undefined },
    { id: 'open-innovation', label: 'Why Open AI Matters', icon: Compass, badge: undefined },
    { id: 'dev-article', label: 'DEV.to Launch Post', icon: FileCode, badge: 'Article' },
    { id: 'settings', label: 'Settings & Data', icon: Settings, badge: undefined },
  ];

  const handleNavClick = (id: string) => {
    onSelectTab(id);
    onCloseMobileNav();
  };

  const content = (
    <div className="h-full flex flex-col justify-between p-4 bg-[#090812] border-r border-purple-950/30 text-slate-300">
      {/* Navigation List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2 pt-2 md:hidden">
          <span className="font-mono text-sm font-bold tracking-wider text-purple-200">
            PHANTOM AI
          </span>
          <button
            onClick={onCloseMobileNav}
            className="p-1 rounded text-slate-400 hover:text-white"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2">
            System Modules
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-purple-950/70 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-purple-950/20'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-purple-300' : 'text-slate-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/40">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-3 rounded-lg bg-black/40 border border-purple-950/40 text-xs font-mono space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-[11px]">Inference:</span>
          <span
            className={`text-[11px] font-semibold ${
              modelInfo?.location === 'local'
                ? 'text-cyan-400'
                : modelInfo?.isDemo
                ? 'text-amber-400'
                : 'text-purple-400'
            }`}
          >
            {modelInfo?.location === 'local'
              ? 'Local Ollama'
              : modelInfo?.isDemo
              ? 'Simulated Demo'
              : 'Google AI'}
          </span>
        </div>

        <div className="text-[10px] text-slate-500 truncate" title={modelInfo?.configuredModel}>
          Model: {modelInfo?.configuredModel || 'gemma-2-9b-it'}
        </div>

        <div className="pt-2 border-t border-purple-950/40 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Zero Trackers</span>
          </span>
          <span className="text-slate-500">v1.0.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/80 backdrop-blur-sm">
          <div className="w-72 h-full bg-[#090812] shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
