import React, { useState, useEffect } from 'react';
import { Activity, Zap, Shield, Globe, Terminal } from 'lucide-react';
import { ActiveTab, UserNetworkInfo, SpeedTestResult } from './types';
import { fetchUserNetworkInfo } from './utils/networkUtils';
import { SpeedTestView } from './components/SpeedTestView';
import { HistorySuggestionsView } from './components/HistorySuggestionsView';
import { HostCheckerLeafletView } from './components/HostCheckerLeafletView';
import { CreatorTerminalView } from './components/CreatorTerminalView';
import { StickyBottomNav } from './components/StickyBottomNav';
import { TopCornerMenu } from './components/TopCornerMenu';
import { PrivacyPageView } from './components/PrivacyPageView';
import { GitHubGuidePageView } from './components/GitHubGuidePageView';

const STORAGE_KEY = 'speedtest_network_history_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('speedtest');
  const [userNetwork, setUserNetwork] = useState<UserNetworkInfo | null>(null);
  const [history, setHistory] = useState<SpeedTestResult[]>([]);
  const [latestResult, setLatestResult] = useState<SpeedTestResult | null>(null);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
          if (parsed.length > 0) {
            setLatestResult(parsed[0]);
          }
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Fetch user network info on initial mount
  const loadNetworkInfo = async () => {
    try {
      const info = await fetchUserNetworkInfo();
      setUserNetwork(info);
    } catch (e) {
      console.error('Failed to detect network info:', e);
    }
  };

  useEffect(() => {
    loadNetworkInfo();
  }, []);

  // Handle new speed test completed
  const handleTestComplete = (result: SpeedTestResult) => {
    setLatestResult(result);
    setHistory((prev) => {
      const updated = [result, ...prev].slice(0, 50); // keep last 50
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage quota
      }
      return updated;
    });
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden">
      
      {/* Ambient Soft Glow Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl opacity-70" />
      </div>

      {/* Top Application Header */}
      <header className="sticky top-0 z-40 w-full bg-[#090d16]/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo and Brand */}
          <div 
            onClick={() => setActiveTab('speedtest')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[10px] bg-[#090d16] flex items-center justify-center text-cyan-400">
                <Zap className="w-4 h-4 fill-current" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
                <span>Net</span><span className="text-cyan-400">Pulse</span>
              </h1>
            </div>
          </div>

          {/* Right Header: Online Status & Top Corner Hamburger Menu */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-xs text-slate-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{userNetwork ? `${userNetwork.city || userNetwork.country}` : 'Online'}</span>
            </div>

            <TopCornerMenu 
              onNavigateToTab={(tab) => setActiveTab(tab)} 
              activeTab={activeTab}
            />
          </div>

        </div>
      </header>

      {/* Main Content Area (with pb-28 bottom padding so content is never hidden behind sticky nav) */}
      <main className="flex-1 w-full max-w-5xl mx-auto py-6 sm:py-8 pb-28 sm:pb-32">
        {activeTab === 'speedtest' && (
          <div className="animate-fadeIn">
            <SpeedTestView
              userNetwork={userNetwork}
              onRefreshNetwork={loadNetworkInfo}
              onTestComplete={handleTestComplete}
              latestResult={latestResult}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="animate-fadeIn">
            <HistorySuggestionsView
              history={history}
              onClearHistory={handleClearHistory}
              latestResult={latestResult}
              onNavigateToTest={() => setActiveTab('speedtest')}
            />
          </div>
        )}

        {activeTab === 'hostchecker' && (
          <div className="animate-fadeIn">
            <HostCheckerLeafletView userNetwork={userNetwork} />
          </div>
        )}

        {activeTab === 'creator' && (
          <div className="animate-fadeIn">
            <CreatorTerminalView />
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="animate-fadeIn">
            <PrivacyPageView onNavigateToTab={(tab) => setActiveTab(tab)} />
          </div>
        )}

        {activeTab === 'github-guide' && (
          <div className="animate-fadeIn">
            <GitHubGuidePageView onNavigateToTab={(tab) => setActiveTab(tab)} />
          </div>
        )}
      </main>

      {/* Footer info (above sticky bottom nav) */}
      <footer className="w-full text-center py-4 mb-16 text-[11px] text-slate-500 font-mono">
        <div className="max-w-md mx-auto px-4 flex items-center justify-center gap-3">
          <span>Client-Side SPA</span>
          <span>•</span>
          <span>Crafted by Ashraf hossen jubaed</span>
          <span>•</span>
          <a
            href="https://github.com/ashraf-dev71"
            target="_blank"
            rel="noreferrer"
            className="text-cyan-400 hover:underline"
          >
            GitHub
          </a>
        </div>
      </footer>

      {/* Sticky Bottom Navigation Bar */}
      <StickyBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

    </div>
  );
}
