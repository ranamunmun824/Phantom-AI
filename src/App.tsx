import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PrivacyModal } from './components/PrivacyModal';
import { Home } from './pages/Home';
import { PhantomChat } from './pages/PhantomChat';
import { StoryLab } from './pages/StoryLab';
import { HauntedTerminalPage } from './pages/HauntedTerminalPage';
import { MemoryVaultPage } from './pages/MemoryVaultPage';
import { ModelLab } from './pages/ModelLab';
import { OpenInnovation } from './pages/OpenInnovation';
import { DevLaunchArticle } from './pages/DevLaunchArticle';
import { SettingsPage } from './pages/SettingsPage';
import { ApiClient } from './services/apiClient';
import { audioService } from './services/audioService';
import { ModelInfo } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [audioActive, setAudioActive] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);

  const fetchHealth = async () => {
    try {
      const data = await ApiClient.getHealth();
      setModelInfo(data);
    } catch (err) {
      console.warn('Initial health check failed:', err);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Periodically refresh model health
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleAudio = () => {
    const newState = audioService.toggleSound();
    setAudioActive(newState);
  };

  const renderActivePage = () => {
    switch (currentTab) {
      case 'home':
        return (
          <Home
            onNavigate={(tab) => setCurrentTab(tab)}
            modelInfo={modelInfo}
            onOpenPrivacy={() => setPrivacyModalOpen(true)}
            onRefreshHealth={fetchHealth}
          />
        );
      case 'chat':
        return <PhantomChat modelInfo={modelInfo} />;
      case 'story':
        return <StoryLab modelInfo={modelInfo} />;
      case 'terminal':
        return <HauntedTerminalPage modelInfo={modelInfo} />;
      case 'vault':
        return <MemoryVaultPage />;
      case 'model-lab':
        return (
          <ModelLab
            modelInfo={modelInfo}
            onRefreshHealth={fetchHealth}
          />
        );
      case 'open-innovation':
        return <OpenInnovation />;
      case 'dev-article':
        return <DevLaunchArticle />;
      case 'settings':
        return (
          <SettingsPage
            audioActive={audioActive}
            onToggleAudio={handleToggleAudio}
            onOpenPrivacy={() => setPrivacyModalOpen(true)}
          />
        );
      default:
        return (
          <Home
            onNavigate={(tab) => setCurrentTab(tab)}
            modelInfo={modelInfo}
            onOpenPrivacy={() => setPrivacyModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-slate-100 flex flex-col font-sans selection:bg-purple-900 selection:text-white">
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 z-50 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-purple-300"
      >
        Skip to main content
      </a>

      {/* Top Navbar */}
      <Navbar
        modelInfo={modelInfo}
        audioActive={audioActive}
        onToggleAudio={handleToggleAudio}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onToggleMobileNav={() => setMobileNavOpen(!mobileNavOpen)}
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
      />

      {/* Main Layout Area: Persistent Sidebar + Page View */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          mobileNavOpen={mobileNavOpen}
          onCloseMobileNav={() => setMobileNavOpen(false)}
          modelInfo={modelInfo}
        />

        <main id="main-content" tabIndex={-1} className="flex-1 px-4 sm:px-6 lg:px-8 overflow-y-auto focus:outline-none">
          {renderActivePage()}
        </main>
      </div>

      {/* Privacy & Security Architecture Modal */}
      <PrivacyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
        onDataCleared={() => {
          fetchHealth();
        }}
      />
    </div>
  );
}

export default App;
