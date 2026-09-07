import React from 'react';
import { ArrowLeft, Shield, CheckCircle2, Lock, EyeOff, Database, Server, RefreshCw } from 'lucide-react';
import { ActiveTab } from '../types';

interface PrivacyPageViewProps {
  onNavigateToTab: (tab: ActiveTab) => void;
}

export const PrivacyPageView: React.FC<PrivacyPageViewProps> = ({ onNavigateToTab }) => {
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

        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
          <Lock className="w-3 h-3" />
          <span>Client-Side Privacy</span>
        </span>
      </div>

      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 text-emerald-400 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Disclaimer & Privacy Policy</h2>
            <p className="text-xs font-mono text-slate-400">Pure Client-Side Transparency Guarantee</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed max-w-2xl">
          NetPulse is designed from the ground up as a zero-telemetry Single Page Application (SPA). We operate without any tracking databases, user cookies, or advertising trackers.
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 w-fit">
            <EyeOff className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-100 text-sm">No Tracking</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your network IP, test results, location, and device details are never transmitted to any analytics or advertising service.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 w-fit">
            <Database className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-100 text-sm">Local Storage Only</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Speed history remains strictly inside your browser’s private sandbox (<code className="text-cyan-400 font-mono">localStorage</code>).
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-2">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 w-fit">
            <Server className="w-5 h-5" />
          </div>
          <div className="font-bold text-slate-100 text-sm">Open Public APIs</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            All IP and geolocation lookups query trusted, public open-source endpoints with zero required personal API keys.
          </p>
        </div>
      </div>

      {/* Detailed Articles */}
      <div className="space-y-4">
        {/* Article 1 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-2">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>1. Pure Client-Side Architecture</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
            NetPulse is completely static and functions directly inside your client browser. There is no custom backend server, microservice, or proxy collecting logs. When you benchmark your connection, the timing measurements are performed locally on your device using client-side JavaScript (<code className="text-cyan-300 font-mono">fetch()</code> and <code className="text-cyan-300 font-mono">performance.now()</code>).
          </p>
        </div>

        {/* Article 2 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-2">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>2. Data Storage & Ownership</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
            Any speed test logs that you see in the "History & Tips" tab are saved on your local hard drive via the HTML5 Web Storage API. At no point is this data shared. You retain complete control to export this history as a JSON file or wipe it permanently with a single click using the "Clear History" button.
          </p>
        </div>

        {/* Article 3 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-2">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>3. External Open-Source Providers</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
            To provide accurate Autonomous System (ASN), ISP names, and Leaflet.js map tiles, this application interacts over HTTPS with community-trusted open providers:
          </p>
          <ul className="text-xs text-slate-400 list-disc list-inside space-y-1 pl-6 pt-1">
            <li><strong className="text-slate-200">ipwho.is & ipapi.co:</strong> Provides public IP, ISP organization, and approximate country/city data.</li>
            <li><strong className="text-slate-200">Cloudflare 1.1.1.1 (DNS over HTTPS):</strong> Resolves hostnames securely without leaking queries to third parties.</li>
            <li><strong className="text-slate-200">OpenStreetMap & Leaflet:</strong> Delivers interactive open-source map tiles.</li>
          </ul>
        </div>

        {/* Article 4 */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-2">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>4. Measurement Accuracy & Disclaimer</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
            Network benchmarks calculate real-world throughput by measuring raw data chunk transfers across geographically distributed Edge CDNs. Speeds and latency can fluctuate due to Wi-Fi distance, browser tab workload, operating system power-saving policies, or local internet throttling. NetPulse is provided free of charge for diagnostics, informational, and utility purposes.
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
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
