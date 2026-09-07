import React, { useMemo } from 'react';
import { SpeedTestStage } from '../types';

interface SpeedometerProps {
  speed: number;
  stage: SpeedTestStage;
  maxScale?: number; // e.g. 100, 500, or 1000
}

export const Speedometer: React.FC<SpeedometerProps> = ({
  speed,
  stage,
  maxScale = 500,
}) => {
  // Speed is non-linear so lower speeds (1-25 Mbps) have visible resolution
  // Range: -125 degrees to +125 degrees (250 degrees total sweep)
  const needleRotation = useMemo(() => {
    if (speed <= 0) return -125;
    
    // Logarithmic-linear hybrid scaling for realistic needle motion
    // 0 -> -125deg
    // 5 -> -85deg
    // 25 -> -30deg
    // 50 -> 0deg (top)
    // 100 -> 35deg
    // 250 -> 80deg
    // 500+ -> 125deg
    let ratio = 0;
    if (speed <= 10) {
      ratio = (speed / 10) * 0.25; // 0 to 0.25
    } else if (speed <= 50) {
      ratio = 0.25 + ((speed - 10) / 40) * 0.25; // 0.25 to 0.50
    } else if (speed <= 100) {
      ratio = 0.50 + ((speed - 50) / 50) * 0.20; // 0.50 to 0.70
    } else if (speed <= 250) {
      ratio = 0.70 + ((speed - 100) / 150) * 0.18; // 0.70 to 0.88
    } else {
      ratio = 0.88 + Math.min(1, (speed - 250) / (maxScale - 250)) * 0.12; // 0.88 to 1.0
    }

    const deg = -125 + ratio * 250;
    return Math.min(125, Math.max(-125, deg));
  }, [speed, maxScale]);

  // Stage display label and theme colors
  const stageInfo = useMemo(() => {
    switch (stage) {
      case 'ping':
        return { label: 'TESTING LATENCY', color: 'text-amber-400', border: 'border-amber-500/40', glow: 'shadow-amber-500/20' };
      case 'download':
        return { label: 'MEASURING DOWNLOAD', color: 'text-cyan-400', border: 'border-cyan-500/40', glow: 'shadow-cyan-500/20' };
      case 'upload':
        return { label: 'MEASURING UPLOAD', color: 'text-emerald-400', border: 'border-emerald-500/40', glow: 'shadow-emerald-500/20' };
      case 'completed':
        return { label: 'TEST COMPLETE', color: 'text-indigo-300', border: 'border-indigo-500/40', glow: 'shadow-indigo-500/20' };
      default:
        return { label: 'READY TO TEST', color: 'text-slate-400', border: 'border-slate-700/60', glow: 'shadow-transparent' };
    }
  }, [stage]);

  // Speedometer ticks
  const ticks = [
    { label: '0', deg: -125 },
    { label: '1', deg: -105 },
    { label: '5', deg: -85 },
    { label: '10', deg: -62.5 },
    { label: '25', deg: -30 },
    { label: '50', deg: 0 },
    { label: '100', deg: 35 },
    { label: '250', deg: 80 },
    { label: '500+', deg: 125 }
  ];

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">
      {/* Outer Glow & Background Disk */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center">
        
        {/* Ambient Ring Backdrop */}
        <div className="absolute inset-2 rounded-full bg-slate-900/90 border border-slate-800/80 shadow-[0_0_50px_rgba(6,182,212,0.08)]" />

        {/* Dynamic Pulsing Ring when Active */}
        {stage !== 'idle' && stage !== 'completed' && (
          <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-30 pointer-events-none" />
        )}

        {/* SVG Dial Arc */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 360 360">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="60%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <filter id="gaugeGlow">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc (250 degrees from 145deg to 395deg) */}
          <circle
            cx="180"
            cy="180"
            r="140"
            fill="none"
            stroke="#1e293b"
            strokeWidth="10"
            strokeDasharray="610"
            strokeDashoffset="180"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* Active Colored Arc */}
          <circle
            cx="180"
            cy="180"
            r="140"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="10"
            strokeDasharray="610"
            strokeDashoffset={Math.max(180, 610 - (((needleRotation + 125) / 250) * 430))}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            className="transition-all duration-300 ease-out"
          />
        </svg>

        {/* Gauge Tick Marks and Labels */}
        <div className="absolute inset-0 pointer-events-none">
          {ticks.map((tick, idx) => {
            const rad = ((tick.deg - 90) * Math.PI) / 180;
            const r = 118; // radius for text
            const cx = 50 + (r / 180) * 50 * Math.cos(rad);
            const cy = 50 + (r / 180) * 50 * Math.sin(rad);

            return (
              <React.Fragment key={idx}>
                {/* Major Tick Mark Line */}
                <div
                  className="absolute left-1/2 top-1/2 w-0.5 h-3 -translate-x-1/2 origin-bottom bg-slate-700/80"
                  style={{
                    transform: `translate(-50%, -100%) rotate(${tick.deg}deg) translateY(-128px)`,
                  }}
                />
                {/* Number Label */}
                <span
                  className="absolute text-[11px] sm:text-xs font-mono font-medium text-slate-400/90 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${cx}%`, top: `${cy}%` }}
                >
                  {tick.label}
                </span>
              </React.Fragment>
            );
          })}
        </div>

        {/* Rotating Needle (CSS transform: rotate() for realistic movement) */}
        <div
          id="speedometer-needle"
          className="absolute left-1/2 top-1/2 w-1 -translate-x-1/2 origin-bottom pointer-events-none z-20"
          style={{
            height: '110px',
            transform: `translate(-50%, -100%) rotate(${needleRotation}deg)`,
            transition: 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Needle Graphic with Neon Gradient & Glow */}
          <div className="w-full h-full bg-gradient-to-t from-cyan-500 via-sky-400 to-white rounded-t-full shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
        </div>

        {/* Center Hub & Digital Readout */}
        <div className="relative z-30 flex flex-col items-center justify-center w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-slate-950 border border-slate-700/60 shadow-xl shadow-black/80">
          {/* Small Pivot Dot */}
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-cyan-400 to-sky-200 shadow-[0_0_8px_rgba(56,189,248,0.9)] mb-1" />

          {/* Main Speed Value */}
          <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white leading-none">
            {speed > 0 ? (speed >= 100 ? Math.round(speed) : speed.toFixed(1)) : '0.0'}
          </div>

          {/* Speed Unit */}
          <div className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-cyan-400 mt-1">
            Mbps
          </div>

          {/* Stage Mini Badge */}
          <div className={`mt-2 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full border ${stageInfo.border} ${stageInfo.color} bg-slate-900/80`}>
            {stageInfo.label}
          </div>
        </div>

      </div>
    </div>
  );
};
