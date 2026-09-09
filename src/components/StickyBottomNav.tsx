import React from 'react';
import { Gauge, History, Globe, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface StickyBottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const StickyBottomNav: React.FC<StickyBottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'speedtest' as ActiveTab, label: 'Speed Test', icon: Gauge },
    { id: 'history' as ActiveTab, label: 'History & Tips', icon: History },
    { id: 'hostchecker' as ActiveTab, label: 'Host & IP', icon: Globe },
    { id: 'creator' as ActiveTab, label: 'Creator', icon: User },
  ];

  return (
    <nav
      id="main-sticky-bottom-nav"
      className="fixed bottom-0 left-0 w-full z-[1000] bg-[#090d16]/90 backdrop-blur-2xl border-t border-white/[0.06] shadow-2xl"
      style={{ position: 'fixed', bottom: 0, width: '100%', zIndex: 1000 }}
    >
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-btn-${tab.id}`}
              onClick={() => {
                onTabChange(tab.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 min-h-[46px] ${
                isActive
                  ? 'text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full" />
                )}
              </div>
              <span className={`text-[11px] mt-1 tracking-tight truncate ${isActive ? 'text-cyan-300' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
