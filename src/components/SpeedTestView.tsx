import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, RefreshCw, ArrowDown, ArrowUp, Activity, Wifi, Server, CheckCircle2, Award, Zap } from 'lucide-react';
import { Speedometer } from './Speedometer';
import { SpeedTestEngine } from '../utils/speedTestEngine';
import { DEFAULT_SERVERS } from '../utils/networkUtils';
import { SpeedTestMetrics, SpeedTestStage, SpeedTestResult, UserNetworkInfo, ServerOption } from '../types';

interface SpeedTestViewProps {
  userNetwork: UserNetworkInfo | null;
  onRefreshNetwork: () => void;
  onTestComplete: (result: SpeedTestResult) => void;
  latestResult: SpeedTestResult | null;
  onNavigateToTab: (tab: any) => void;
}

export const SpeedTestView: React.FC<SpeedTestViewProps> = ({
  userNetwork,
  onRefreshNetwork,
  onTestComplete,
  latestResult,
  onNavigateToTab
}) => {
  const [stage, setStage] = useState<SpeedTestStage>('idle');
  const [selectedServer, setSelectedServer] = useState<ServerOption>(DEFAULT_SERVERS[0]);
  const [metrics, setMetrics] = useState<SpeedTestMetrics>({
    ping: 0,
    jitter: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    bytesDownloaded: 0,
    bytesUploaded: 0,
    progress: 0
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const engineRef = useRef<SpeedTestEngine | null>(null);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new SpeedTestEngine({
      onStageChange: (newStage) => setStage(newStage),
      onMetricUpdate: (newMetrics) => setMetrics(newMetrics),
      onComplete: (result) => {
        setStage('completed');
        onTestComplete(result);
      },
      onError: (err) => {
        setErrorMessage(err);
        setStage('idle');
      }
    });

    return () => {
      if (engineRef.current) {
        engineRef.current.abort();
      }
    };
  }, [onTestComplete]);

  // Handle Spacebar to trigger test
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        toggleTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, selectedServer, userNetwork]);

  const toggleTest = () => {
    setErrorMessage(null);
    if (stage === 'idle' || stage === 'completed') {
      // Start test
      setMetrics({
        ping: 0,
        jitter: 0,
        downloadSpeed: 0,
        uploadSpeed: 0,
        bytesDownloaded: 0,
        bytesUploaded: 0,
        progress: 0
      });
      engineRef.current?.start(
        selectedServer.host,
        selectedServer.name,
        userNetwork?.ip || '',
        userNetwork?.isp || ''
      );
    } else {
      // Stop/Cancel test
      engineRef.current?.abort();
    }
  };

  // Determine current active speed for gauge
  const currentGaugeSpeed = 
    stage === 'download' 
      ? metrics.downloadSpeed 
      : stage === 'upload' 
        ? metrics.uploadSpeed 
        : stage === 'completed' && latestResult 
          ? latestResult.downloadSpeed 
          : 0;

  // Format bytes into MB
  const formatMB = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1);
  };

  const isTesting = stage !== 'idle' && stage !== 'completed';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 px-4">
      
      {/* Top Network Info & Server Picker Bar */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* User IP & ISP Box */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 text-cyan-400">
              <Wifi className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <span>{userNetwork?.flag || '🌐'}</span>
                <span>{userNetwork?.ip || 'Detecting network...'}</span>
              </div>
              <div className="text-sm font-semibold text-slate-100 truncate">
                {userNetwork?.isp || 'Broadband Network'}
              </div>
            </div>
          </div>

          <button
            id="btn-refresh-network"
            onClick={onRefreshNetwork}
            title="Refresh network details"
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/80 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Server Selector Dropdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 min-w-0 w-full">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="server-select" className="text-xs font-mono text-slate-400 block mb-0.5">
                SPEED TEST SERVER
              </label>
              <select
                id="server-select"
                disabled={isTesting}
                value={selectedServer.id}
                onChange={(e) => {
                  const s = DEFAULT_SERVERS.find((srv) => srv.id === e.target.value);
                  if (s) setSelectedServer(s);
                }}
                className="w-full bg-transparent text-sm font-semibold text-slate-100 focus:outline-none cursor-pointer disabled:opacity-60"
              >
                {DEFAULT_SERVERS.map((srv) => (
                  <option key={srv.id} value={srv.id} className="bg-slate-900 text-slate-200">
                    {srv.flag} {srv.name} ({srv.location})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar during Test */}
      {isTesting && (
        <div className="w-full bg-slate-900/80 border border-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-400 transition-all duration-300"
            style={{ width: `${metrics.progress}%` }}
          />
        </div>
      )}

      {/* Speedometer Gauge */}
      <div className="relative">
        <Speedometer
          speed={currentGaugeSpeed}
          stage={stage}
        />
      </div>

      {/* Real-time Data Usage and Metrics Row */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Ping Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>PING / JITTER</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-slate-100">
            {metrics.ping > 0 ? `${metrics.ping}` : latestResult ? `${latestResult.ping}` : '--'}
            <span className="text-xs font-normal text-slate-400 ml-1">ms</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
            Jitter: {metrics.jitter > 0 ? `${metrics.jitter}` : latestResult ? `${latestResult.jitter}` : '0'} ms
          </div>
        </div>

        {/* Download Speed Card */}
        <div className={`bg-slate-900/70 border rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition-colors ${
          stage === 'download' ? 'border-cyan-500/50 bg-cyan-950/20' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <ArrowDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>DOWNLOAD</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-300">
            {metrics.downloadSpeed > 0 ? metrics.downloadSpeed.toFixed(1) : latestResult ? latestResult.downloadSpeed.toFixed(1) : '--'}
            <span className="text-xs font-normal text-slate-400 ml-1">Mbps</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
            Data: {metrics.bytesDownloaded > 0 ? `${formatMB(metrics.bytesDownloaded)} MB` : '0 MB'}
          </div>
        </div>

        {/* Upload Speed Card */}
        <div className={`bg-slate-900/70 border rounded-xl p-3.5 flex flex-col items-center justify-center text-center transition-colors ${
          stage === 'upload' ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>UPLOAD</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-300">
            {metrics.uploadSpeed > 0 ? metrics.uploadSpeed.toFixed(1) : latestResult ? latestResult.uploadSpeed.toFixed(1) : '--'}
            <span className="text-xs font-normal text-slate-400 ml-1">Mbps</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
            Data: {metrics.bytesUploaded > 0 ? `${formatMB(metrics.bytesUploaded)} MB` : '0 MB'}
          </div>
        </div>

        {/* Grade / Connection Quality Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <Award className="w-3.5 h-3.5 text-purple-400" />
            <span>RATING</span>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-purple-300">
            {latestResult ? latestResult.grade : stage === 'completed' ? 'A' : '--'}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
            {latestResult ? (latestResult.downloadSpeed >= 50 ? 'High Speed' : 'Standard') : 'Pending'}
          </div>
        </div>
      </div>

      {/* Start / Stop Test Glowing Button */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <button
          id="btn-speedtest-toggle"
          onClick={toggleTest}
          className={`relative px-10 py-4 rounded-2xl font-bold text-base tracking-wider transition-all duration-300 flex items-center gap-3 shadow-lg active:scale-95 ${
            isTesting
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/40 border border-rose-500'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]'
          }`}
        >
          {isTesting ? (
            <>
              <Square className="w-5 h-5 fill-current" />
              <span>STOP TEST</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{stage === 'completed' ? 'TEST AGAIN' : 'START TEST'}</span>
            </>
          )}
        </button>
        <span className="text-xs text-slate-500 font-mono">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px] text-slate-300">Space</kbd> to {isTesting ? 'stop' : 'start'}
        </span>
      </div>

      {/* Error notification if any */}
      {errorMessage && (
        <div className="w-full p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs text-center font-mono">
          {errorMessage}
        </div>
      )}

      {/* Completion Banner */}
      {stage === 'completed' && latestResult && (
        <div className="w-full bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-cyan-950/20 animate-fadeIn">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Speed Test Finished</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Grade {latestResult.grade}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {latestResult.downloadSpeed >= 50
                  ? 'Great speed! Your connection easily handles 4K streaming and high-capacity tasks.'
                  : 'Stable connection. Check optimized recommendations in the Suggestions tab.'}
              </p>
            </div>
          </div>

          <button
            id="btn-view-suggestions-from-home"
            onClick={() => onNavigateToTab('history')}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>View Suggestions & History</span>
          </button>
        </div>
      )}

    </div>
  );
};
