import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, User, Shield, FileCode, ChevronRight } from 'lucide-react';
import { ActiveTab } from '../types';

interface TopCornerMenuProps {
  onNavigateToTab: (tab: ActiveTab) => void;
  activeTab?: ActiveTab;
}

export const TopCornerMenu: React.FC<TopCornerMenuProps> = ({ onNavigateToTab, activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (tab: ActiveTab) => {
    onNavigateToTab(tab);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Top Right Hamburger Button */}
      <button
        id="btn-top-menu"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Navigation Menu"
        className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-cyan-400 border border-slate-800 shadow-sm transition-all duration-300"
      >
        {isOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Dropdown Menu directly navigating to dedicated pages (No Popups!) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 overflow-hidden animate-fadeIn">
          <div className="px-3 py-2 border-b border-slate-800/80 flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Network Menu
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              NetPulse
            </span>
          </div>

          <div className="py-1 space-y-1">
            {/* 1. Creator Information Page Link */}
            <button
              id="menu-item-creator"
              onClick={() => handleSelect('creator')}
              className={`w-full px-3 py-2.5 text-left rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'creator'
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                  : 'text-slate-200 hover:text-cyan-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="leading-tight">Creator Information</div>
                  <div className="text-[10px] text-slate-400 font-normal truncate">Ashraf hossen jubaed</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            </button>

            {/* 2. Disclaimer & Privacy Page Link */}
            <button
              id="menu-item-privacy"
              onClick={() => handleSelect('privacy')}
              className={`w-full px-3 py-2.5 text-left rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'privacy'
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  : 'text-slate-200 hover:text-cyan-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="leading-tight">Disclaimer & Privacy</div>
                  <div className="text-[10px] text-slate-400 font-normal">Dedicated Transparency Page</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            </button>

            {/* 3. GitHub Pages Deployment Page Link */}
            <button
              id="menu-item-export"
              onClick={() => handleSelect('github-guide')}
              className={`w-full px-3 py-2.5 text-left rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                activeTab === 'github-guide'
                  ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                  : 'text-slate-200 hover:text-cyan-300 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="leading-tight">GitHub Pages Guide</div>
                  <div className="text-[10px] text-slate-400 font-normal">CI/CD & Vanilla index.html</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
