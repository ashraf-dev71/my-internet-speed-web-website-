import React, { useState } from 'react';
import { ArrowLeft, FileCode, Check, Copy, ExternalLink, Download, Terminal, Rocket, Globe } from 'lucide-react';
import { ActiveTab } from '../types';

interface GitHubGuidePageViewProps {
  onNavigateToTab: (tab: ActiveTab) => void;
}

export const GitHubGuidePageView: React.FC<GitHubGuidePageViewProps> = ({ onNavigateToTab }) => {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div className="space-y-6 px-4 animate-fadeIn">
      {/* Top Breadcrumb / Back button */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <button
          onClick={() => onNavigateToTab('speedtest')}
          className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Speed Test</span>
        </button>

        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
          <Globe className="w-3 h-3" />
          <span>GitHub Pages Ready</span>
        </span>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 text-indigo-400 mb-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <FileCode className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">GitHub Pages Deployment Guide</h2>
            <p className="text-xs font-mono text-slate-400">Zero-Backend Client-Side Hosting Instructions</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed max-w-2xl">
          Because NetPulse runs purely in the client browser with free open-source APIs, it requires no Node server or cloud database. You can host it completely free on GitHub Pages forever.
        </p>
      </div>

      {/* Method 1: Automated CI/CD (GitHub Actions) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              1
            </span>
            <h3 className="font-bold text-slate-100 text-base">Method 1: Auto-Deploy with GitHub Actions (Recommended)</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            Automated CI/CD
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The deployment pipeline is already configured inside <code className="text-cyan-400 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">.github/workflows/deploy.yml</code>. Whenever you push code to your GitHub repository, GitHub will build the Vite bundle and deploy it automatically.
        </p>

        {/* Step-by-step instructions */}
        <div className="space-y-3">
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span>BASH / TERMINAL COMMANDS</span>
              <button
                onClick={() => copyCode('git add .\ngit commit -m "Deploy NetPulse to GitHub Pages"\ngit push origin main', 'git-push')}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                {copiedSnippet === 'git-push' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'git-push' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-slate-200 overflow-x-auto select-all">
{`git add .
git commit -m "Deploy NetPulse to GitHub Pages"
git push origin main`}
            </pre>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-semibold text-slate-100 flex items-center gap-1.5">
              <Rocket className="w-4 h-4 text-cyan-400" />
              <span>Enable GitHub Pages in your repo settings:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 pl-1">
              <li>Open your repository on GitHub.</li>
              <li>Go to <strong className="text-slate-200">Settings</strong> &rarr; <strong className="text-slate-200">Pages</strong>.</li>
              <li>Under <strong className="text-slate-200">Build and deployment</strong>, set Source to <strong className="text-cyan-300">GitHub Actions</strong>.</li>
              <li>Your site will be live at <code className="text-cyan-400">https://&lt;username&gt;.github.io/&lt;repo-name&gt;/</code>!</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Method 2: 1-Click NPM Deploy via gh-pages */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">
              2
            </span>
            <h3 className="font-bold text-slate-100 text-base">Method 2: One-Command CLI Deploy</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Local Terminal
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          We have configured the <code className="text-cyan-400 font-mono">gh-pages</code> package in <code className="text-slate-200 font-mono">package.json</code>. You can build and deploy the application with a single terminal command:
        </p>

        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs">
          <div className="flex justify-between items-center pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <span>TERMINAL COMMAND</span>
            <button
              onClick={() => copyCode('npm run deploy', 'npm-deploy')}
              className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {copiedSnippet === 'npm-deploy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet === 'npm-deploy' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="text-cyan-300 font-bold select-all">npm run deploy</pre>
        </div>
      </div>

      {/* Method 3: Standalone Single-File (Pure Vanilla, Zero Build) */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
              3
            </span>
            <h3 className="font-bold text-slate-100 text-base">Method 3: Direct Upload Single-File (No Node / npm Needed)</h3>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            Zero-Build Vanilla
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          If you don't want to install Node.js, npm, or configure build tools, we prepared a complete, self-contained single-file version containing all HTML, CSS, and Vanilla JavaScript!
        </p>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-300 space-y-1">
            <div className="font-bold text-slate-100 flex items-center gap-2">
              <span>standalone.html</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Self-Contained
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Rename this file to <code className="text-cyan-300">index.html</code> and upload it directly to any GitHub repository root.
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <a
              href="./standalone.html"
              download="index.html"
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download index.html</span>
            </a>

            <a
              href="./standalone.html"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <span>Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom return button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => onNavigateToTab('speedtest')}
          className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
        >
          Return to Speed Test
        </button>
      </div>
    </div>
  );
};
