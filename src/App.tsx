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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          
          {/* Logo and Brand */}
          <div 
            onClick={() => setActiveTab('speedtest')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5 fill-current" />
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
                <span>Net</span>
                <span className="text-cyan-400">Pulse</span>
                <span className="text-xs px-1.5 py-0.5 rounded-md font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  NETWORK
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Network Utility & Diagnostics SPA
              </p>
            </div>
          </div>

          {/* Right Header: Online Status & Top Corner Hamburger Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]" />
              <span>{userNetwork ? userNetwork.country : 'Online'}</span>
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
