import React, { useState, useEffect, useRef } from 'react';
import { UserNetworkInfo, ServerOption, SpeedTestMetrics, SpeedTestResult, SpeedTestStage, ActiveTab } from '../types';
import { SpeedTestEngine } from '../utils/speedTestEngine';
import { soundFX } from '../utils/audioEffects';
import { DEFAULT_SERVERS } from '../utils/networkUtils';
import { Speedometer } from './Speedometer';
import { LiveTelemetryStream } from './LiveTelemetryStream';
import {
  Wifi,
  Server,
  RefreshCw,
  Play,
  Square,
  Activity,
  ArrowDown,
  ArrowUp,
  Sparkles,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface SpeedTestViewProps {
  userNetwork: UserNetworkInfo | null;
  onRefreshNetwork: () => void;
  onTestComplete: (result: SpeedTestResult) => void;
  latestResult: SpeedTestResult | null;
  onNavigateToTab: (tab: ActiveTab) => void;
}

export const SpeedTestView: React.FC<SpeedTestViewProps> = ({
  userNetwork,
  onRefreshNetwork,
  onTestComplete,
  latestResult,
  onNavigateToTab,
}) => {
  const [selectedServer, setSelectedServer] = useState<ServerOption>(DEFAULT_SERVERS[0]);
  const [stage, setStage] = useState<SpeedTestStage>('idle');
  const [metrics, setMetrics] = useState<SpeedTestMetrics>({
    ping: 0,
    jitter: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    progress: 0,
    bytesDownloaded: 0,
    bytesUploaded: 0,
  });

  const [peakSpeed, setPeakSpeed] = useState<number>(0);
  const [streamHistory, setStreamHistory] = useState<{ time: number; speed: number; stage: SpeedTestStage }[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('netpulse_sound');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const engineRef = useRef<SpeedTestEngine | null>(null);
  const prevStageRef = useRef<SpeedTestStage>('idle');

  // Keep soundFX enabled state synced
  useEffect(() => {
    soundFX.enabled = isSoundEnabled;
  }, [isSoundEnabled]);

  const toggleSound = () => {
    setIsSoundEnabled((prev) => {
      const next = !prev;
      soundFX.enabled = next;
      try {
        localStorage.setItem('netpulse_sound', JSON.stringify(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  // Keyboard shortcut: Spacebar toggles start/abort test
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        toggleTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage]);

  // Audio trigger on stage transitions
  useEffect(() => {
    if (stage !== prevStageRef.current) {
      if (stage === 'ping') {
        soundFX.playStart();
      } else if (stage === 'completed') {
        soundFX.playComplete();
      }
      prevStageRef.current = stage;
    }
  }, [stage]);

  // Start or Stop the Speed Test
  const toggleTest = () => {
    if (stage === 'idle' || stage === 'completed') {
      setErrorMessage(null);
      setPeakSpeed(0);
      setStreamHistory([]);

      const engine = new SpeedTestEngine({
        onStageChange: (newStage) => {
          setStage(newStage);
        },
        onMetricUpdate: (m) => {
          setMetrics({ ...m });

          const currentSpeed = m.downloadSpeed || m.uploadSpeed || 0;
          if (currentSpeed > 0) {
            setPeakSpeed((prev) => Math.max(prev, currentSpeed));
            soundFX.playTick();

            setStreamHistory((prev) => {
              const next = [...prev, { time: Date.now(), speed: currentSpeed, stage: prevStageRef.current }];
              return next.slice(-40);
            });
          }
        },
        onComplete: (result) => {
          setStage('completed');
          onTestComplete(result);
        },
        onError: (err) => {
          setStage('idle');
          setErrorMessage(err);
        },
      });

      engineRef.current = engine;
      engine.start(
        selectedServer.host,
        selectedServer.name,
        userNetwork?.ip || '',
        userNetwork?.isp || ''
      );
    } else {
      // Abort test
      engineRef.current?.abort();
      setStage('idle');
    }
  };

  const currentGaugeSpeed =
    stage === 'download'
      ? metrics.downloadSpeed
      : stage === 'upload'
        ? metrics.uploadSpeed
        : stage === 'completed' && latestResult
          ? latestResult.downloadSpeed
          : 0;

  const isTesting = stage !== 'idle' && stage !== 'completed';

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-6 px-4">

      {/* Network & Server Pill (Simple, Clean, Minimal) */}
      <div className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 backdrop-blur-xl">

        {/* User ISP info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <Wifi className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <span>{userNetwork?.flag || '🌐'}</span>
              <span>{userNetwork?.ip || 'Detecting network...'}</span>
            </div>
            <div className="text-sm font-semibold text-slate-200 truncate">
              {userNetwork?.isp || 'Broadband Network'}
            </div>
          </div>
          <button
            id="btn-refresh-network"
            onClick={onRefreshNetwork}
            title="Refresh network information"
            className="ml-auto sm:ml-2 p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-white/5 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Subtle separator on mobile */}
        <div className="w-full h-px bg-white/[0.06] sm:hidden" />

        {/* Server Picker */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Server className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            id="server-select"
            disabled={isTesting}
            value={selectedServer.id}
            onChange={(e) => {
              const s = DEFAULT_SERVERS.find((srv) => srv.id === e.target.value);
              if (s) setSelectedServer(s);
            }}
            className="bg-transparent text-xs sm:text-sm font-medium text-slate-200 focus:outline-none cursor-pointer disabled:opacity-50 py-1"
          >
            {DEFAULT_SERVERS.map((srv) => (
              <option key={srv.id} value={srv.id} className="bg-slate-900 text-slate-200">
                {srv.flag} {srv.name} ({srv.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Speedometer Gauge Component */}
      <div className="relative w-full flex justify-center mt-2 mb-1">
        <Speedometer
          speed={currentGaugeSpeed}
          stage={stage}
          peakSpeed={peakSpeed}
          isSoundEnabled={isSoundEnabled}
          onToggleSound={toggleSound}
        />
      </div>

      {/* Sleek Progress Bar (Only during testing) */}
      {isTesting && (
        <div className="w-full max-w-md bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 rounded-full transition-all duration-200"
            style={{ width: `${metrics.progress}%` }}
          />
        </div>
      )}

      {/* Live Minimal Waveform Stream */}
      {(isTesting || streamHistory.length > 0) && (
        <LiveTelemetryStream
          stage={stage}
          downloadSpeed={metrics.downloadSpeed}
          uploadSpeed={metrics.uploadSpeed}
          historyPoints={streamHistory}
          peakSpeed={peakSpeed}
        />
      )}

      {/* Clean 4-Metric Grid */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">

        {/* Latency / Ping */}
        <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 ${
          stage === 'ping'
            ? 'bg-amber-500/10 border border-amber-500/40 shadow-lg shadow-amber-500/10'
            : 'bg-white/[0.03] border border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-medium">
            <Activity className={`w-3.5 h-3.5 ${stage === 'ping' ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span>Ping</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-100 font-num">
            {metrics.ping > 0 ? metrics.ping : latestResult ? latestResult.ping : '--'}
            <span className="text-xs font-normal text-slate-400 ml-1">ms</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 font-num">
            jitter {metrics.jitter > 0 ? metrics.jitter : latestResult ? latestResult.jitter : '0'} ms
          </span>
        </div>

        {/* Download Speed */}
        <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 ${
          stage === 'download'
            ? 'bg-cyan-500/10 border border-cyan-500/40 shadow-lg shadow-cyan-500/10'
            : 'bg-white/[0.03] border border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-medium">
            <ArrowDown className={`w-3.5 h-3.5 ${stage === 'download' ? 'text-cyan-400 animate-bounce' : 'text-cyan-400'}`} />
            <span>Download</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-cyan-300 font-num">
            {metrics.downloadSpeed > 0 ? metrics.downloadSpeed.toFixed(1) : latestResult ? latestResult.downloadSpeed.toFixed(1) : '--'}
            <span className="text-xs font-normal text-slate-400 ml-1">Mbps</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 font-num">
            {metrics.bytesDownloaded > 0 ? `${(metrics.bytesDownloaded / (1024 * 1024)).toFixed(1)} MB` : '0 MB'}
          </span>
        </div>

        {/* Upload Speed */}
        <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 ${
          stage === 'upload'
            ? 'bg-emerald-500/10 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
            : 'bg-white/[0.03] border border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-medium">
            <ArrowUp className={`w-3.5 h-3.5 ${stage === 'upload' ? 'text-emerald-400 animate-bounce' : 'text-emerald-400'}`} />
            <span>Upload</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-300 font-num">
            {metrics.uploadSpeed > 0 ? metrics.uploadSpeed.toFixed(1) : latestResult ? latestResult.uploadSpeed.toFixed(1) : '--'}
            <span className="text-xs font-normal text-slate-400 ml-1">Mbps</span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 font-num">
            {metrics.bytesUploaded > 0 ? `${(metrics.bytesUploaded / (1024 * 1024)).toFixed(1)} MB` : '0 MB'}
          </span>
        </div>

        {/* Quality Rating */}
        <div className={`p-4 rounded-2xl flex flex-col items-center justify-center text-center transition-all duration-300 ${
          stage === 'completed'
            ? 'bg-purple-500/10 border border-purple-500/40 shadow-lg shadow-purple-500/10'
            : 'bg-white/[0.03] border border-white/[0.06]'
        }`}>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Rating</span>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-purple-300">
            {latestResult ? latestResult.grade : stage === 'completed' ? 'A+' : '--'}
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5">
            {latestResult ? (latestResult.downloadSpeed >= 50 ? 'Fast & Stable' : 'Standard') : 'Pending'}
          </span>
        </div>

      </div>

      {/* Start / Stop Button (Creative, Cool, Minimal) */}
      <div className="flex flex-col items-center gap-2 mt-2">
        <button
          id="btn-speedtest-toggle"
          onClick={toggleTest}
          className={`px-10 py-3.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 flex items-center gap-2.5 shadow-xl active:scale-95 cursor-pointer select-none ${
            isTesting
              ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-cyan-500/30 hover:shadow-cyan-500/50'
          }`}
        >
          {isTesting ? (
            <>
              <Square className="w-4 h-4 fill-current" />
              <span>Stop Test</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{stage === 'completed' ? 'Test Again' : 'Start Test'}</span>
            </>
          )}
        </button>

        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          Press <kbd className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] text-slate-300 font-mono">Space</kbd> to {isTesting ? 'stop' : 'start'}
        </span>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="w-full p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs text-center">
          {errorMessage}
        </div>
      )}

      {/* Completion Clean Card */}
      {stage === 'completed' && latestResult && (
        <div className="w-full bg-white/[0.03] border border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl animate-fadeIn">
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                <span>Speed Test Complete</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300">
                  Grade {latestResult.grade}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {latestResult.downloadSpeed >= 50
                  ? 'Ultra-fast connection. Ideal for 4K streaming, online gaming & large downloads.'
                  : 'Stable connection. Good for high-definition streaming and standard browsing.'}
              </p>
            </div>
          </div>

          <button
            id="btn-view-suggestions-from-home"
            onClick={() => onNavigateToTab('history')}
            className="shrink-0 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-cyan-300 text-xs font-semibold flex items-center gap-1.5 border border-cyan-500/20 transition-all active:scale-95"
          >
            <span>View Insights</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};
