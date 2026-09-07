import React, { useState } from 'react';
import { 
  History, Trash2, Download, Gamepad2, Tv, Video, DownloadCloud, 
  Globe, Smartphone, CheckCircle, AlertTriangle, XCircle, ArrowDown, ArrowUp, Activity, Play, Sparkles
} from 'lucide-react';
import { SpeedTestResult } from '../types';
import { evaluateCapabilities } from '../utils/suggestions';

interface HistorySuggestionsViewProps {
  history: SpeedTestResult[];
  onClearHistory: () => void;
  latestResult: SpeedTestResult | null;
  onNavigateToTest: () => void;
}

export const HistorySuggestionsView: React.FC<HistorySuggestionsViewProps> = ({
  history,
  onClearHistory,
  latestResult,
  onNavigateToTest,
}) => {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'history'>('suggestions');
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  // If no test yet, evaluate with benchmark 45 Mbps / 22 ms or latest
  const evalDownload = latestResult ? latestResult.downloadSpeed : (history.length > 0 ? history[0].downloadSpeed : 45);
  const evalPing = latestResult ? latestResult.ping : (history.length > 0 ? history[0].ping : 24);

  const evaluation = evaluateCapabilities(evalDownload, evalPing);

  // Export history as JSON
  const handleExportJSON = () => {
    if (history.length === 0) return;
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `speedtest-history-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: 'optimal' | 'adequate' | 'insufficient') => {
    if (status === 'optimal') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
          <CheckCircle className="w-3.5 h-3.5" /> Optimal
        </span>
      );
    }
    if (status === 'adequate') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
          <AlertTriangle className="w-3.5 h-3.5" /> Adequate
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded-full">
        <XCircle className="w-3.5 h-3.5" /> Insufficient
      </span>
    );
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Gamepad2':
        return <Gamepad2 className="w-5 h-5 text-indigo-400" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-cyan-400" />;
      case 'Video':
        return <Video className="w-5 h-5 text-sky-400" />;
      case 'DownloadCloud':
        return <DownloadCloud className="w-5 h-5 text-emerald-400" />;
      case 'Globe':
        return <Globe className="w-5 h-5 text-blue-400" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-purple-400" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 px-4">
      
      {/* Sub-tabs header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            id="subtab-suggestions"
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'suggestions'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Speed Suggestions & Capability</span>
          </button>
          <button
            id="subtab-history"
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Test History ({history.length})</span>
          </button>
        </div>

        {activeTab === 'history' && history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              id="btn-export-history"
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Export as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {isConfirmingClear ? (
              <div className="flex items-center gap-1.5 bg-rose-950/80 border border-rose-800/80 rounded-lg p-1 animate-fadeIn">
                <span className="text-[10px] font-mono text-rose-200 px-1">Clear all?</span>
                <button
                  id="btn-confirm-clear"
                  onClick={() => {
                    onClearHistory();
                    setIsConfirmingClear(false);
                  }}
                  className="px-2 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-colors"
                >
                  Yes
                </button>
                <button
                  onClick={() => setIsConfirmingClear(false)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                id="btn-clear-history"
                onClick={() => setIsConfirmingClear(true)}
                className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-mono flex items-center gap-1.5 border border-rose-800/40 transition-colors"
                title="Clear all saved tests"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* SUGGESTIONS VIEW */}
      {activeTab === 'suggestions' && (
        <div className="flex flex-col gap-6">
          
          {/* Active Benchmark Summary Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-1">
                  CONNECTION TIER ASSESSMENT
                </div>
                <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
                  <span>{evaluation.tierName}</span>
                </h3>
                <p className="text-sm text-slate-300 mt-1 max-w-xl">
                  {evaluation.tierSummary}
                </p>
              </div>

              {/* Tested Stats Pill */}
              <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 px-4 py-2.5 rounded-xl shrink-0">
                <div className="text-center">
                  <div className="text-[10px] font-mono text-slate-500">DOWNLOAD</div>
                  <div className="text-base font-bold font-mono text-cyan-400">
                    {evalDownload.toFixed(1)} <span className="text-xs font-normal">Mbps</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div className="text-center">
                  <div className="text-[10px] font-mono text-slate-500">PING</div>
                  <div className="text-base font-bold font-mono text-amber-400">
                    {evalPing} <span className="text-xs font-normal">ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Gaming & Free Fire Box */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-start gap-3 bg-indigo-950/20 p-3.5 rounded-xl border border-indigo-500/20">
              <Gamepad2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-semibold text-indigo-300">Competitive Gaming Evaluation: </span>
                <span className="text-slate-300">{evaluation.gamingVerdict}</span>
              </div>
            </div>
          </div>

          {/* Speed Guide Scale Reference */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3">
              SPEED OPTIMIZATION TIERS & BENCHMARKS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <div className="text-xs font-bold text-cyan-300">1 – 5 Mbps</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Casual web browsing, emails, Spotify, single device SD video.</div>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <div className="text-xs font-bold text-blue-300">5 – 25 Mbps</div>
                <div className="text-[11px] text-slate-400 mt-0.5">1080p FHD streaming, Zoom & Meet video calls, basic multiplayer.</div>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <div className="text-xs font-bold text-emerald-300">25 – 100 Mbps</div>
                <div className="text-[11px] text-slate-400 mt-0.5">4K UHD video streaming, simultaneous multi-device households.</div>
              </div>
              <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
                <div className="text-xs font-bold text-purple-300">Low Ping (&lt; 25 ms)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Optimal for competitive games like Free Fire, Valorant, BGMI.</div>
              </div>
            </div>
          </div>

          {/* Grid of Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {evaluation.capabilities.map((cap) => (
              <div
                key={cap.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between gap-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/90 border border-slate-700/60">
                      {getIcon(cap.iconName)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{cap.name}</div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Req: {cap.minDownloadMbps} Mbps {cap.maxPingMs ? `• < ${cap.maxPingMs}ms ping` : ''}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(cap.status)}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed pl-1">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* HISTORY VIEW */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-4">
          {history.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <History className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-slate-200">No Speed Tests Recorded Yet</h4>
              <p className="text-xs text-slate-400 max-w-sm">
                Run your first internet speed test to automatically log ping, jitter, download, and upload speeds in your browser.
              </p>
              <button
                id="btn-run-test-from-history"
                onClick={onNavigateToTest}
                className="mt-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Run Speed Test</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase font-mono tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-3">Server / ISP</th>
                      <th className="py-3 px-3 text-right">Ping</th>
                      <th className="py-3 px-3 text-right">Download</th>
                      <th className="py-3 px-3 text-right">Upload</th>
                      <th className="py-3 px-4 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {history.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 text-slate-300 font-mono">
                          {item.dateStr}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          <div className="font-medium truncate max-w-[150px]">{item.serverName}</div>
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{item.isp}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-amber-400">
                          <span className="font-semibold">{item.ping}</span> ms
                          <div className="text-[10px] text-slate-500">{item.jitter}j</div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-cyan-400 font-bold">
                          <span className="flex items-center justify-end gap-1">
                            <ArrowDown className="w-3 h-3 text-cyan-500" />
                            {item.downloadSpeed.toFixed(1)} Mbps
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-emerald-400 font-bold">
                          <span className="flex items-center justify-end gap-1">
                            <ArrowUp className="w-3 h-3 text-emerald-500" />
                            {item.uploadSpeed.toFixed(1)} Mbps
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-slate-800 border border-slate-700 text-purple-300">
                            {item.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
