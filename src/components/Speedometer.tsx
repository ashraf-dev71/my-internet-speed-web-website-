import React, { useMemo, useEffect, useState } from 'react';
import { SpeedTestStage } from '../types';
import { Volume2, VolumeX, ArrowDown, ArrowUp, Activity } from 'lucide-react';

interface SpeedometerProps {
  speed: number;
  stage: SpeedTestStage;
  maxScale?: number;
  peakSpeed?: number;
  isSoundEnabled?: boolean;
  onToggleSound?: () => void;
  speedHistoryPoints?: number[];
}

export const Speedometer: React.FC<SpeedometerProps> = ({
  speed,
  stage,
  maxScale = 500,
  peakSpeed = 0,
  isSoundEnabled = true,
  onToggleSound,
}) => {
  const [internalPeak, setInternalPeak] = useState(0);

  useEffect(() => {
    if (stage === 'idle') {
      setInternalPeak(0);
    } else if (speed > internalPeak) {
      setInternalPeak(speed);
    }
  }, [speed, stage, internalPeak]);

  const effectivePeak = peakSpeed > 0 ? peakSpeed : internalPeak;

  // Calculate sweep percentage (0 to 1) for 260 degrees arc
  const sweepRatio = useMemo(() => {
    if (speed <= 0) return 0;
    if (speed <= 10) return (speed / 10) * 0.2;
    if (speed <= 50) return 0.2 + ((speed - 10) / 40) * 0.25;
    if (speed <= 100) return 0.45 + ((speed - 50) / 50) * 0.22;
    if (speed <= 250) return 0.67 + ((speed - 100) / 150) * 0.2;
    return Math.min(1, 0.87 + ((speed - 250) / (maxScale - 250)) * 0.13);
  }, [speed, maxScale]);

  // Stage presentation config
  const config = useMemo(() => {
    switch (stage) {
      case 'ping':
        return {
          label: 'Measuring Latency',
          color: '#fbbf24',
          glow: 'rgba(251, 191, 36, 0.25)',
          gradId: 'amberGrad',
          Icon: Activity,
          textColor: 'text-amber-400',
        };
      case 'download':
        return {
          label: 'Downloading',
          color: '#06b6d4',
          glow: 'rgba(6, 182, 212, 0.28)',
          gradId: 'cyanGrad',
          Icon: ArrowDown,
          textColor: 'text-cyan-400',
        };
      case 'upload':
        return {
          label: 'Uploading',
          color: '#10b981',
          glow: 'rgba(16, 185, 129, 0.28)',
          gradId: 'emeraldGrad',
          Icon: ArrowUp,
          textColor: 'text-emerald-400',
        };
      case 'completed':
        return {
          label: 'Finished',
          color: '#8b5cf6',
          glow: 'rgba(139, 92, 246, 0.22)',
          gradId: 'purpleGrad',
          Icon: null,
          textColor: 'text-purple-400',
        };
      default:
        return {
          label: 'Ready to Test',
          color: '#38bdf8',
          glow: 'rgba(56, 189, 248, 0.1)',
          gradId: 'idleGrad',
          Icon: null,
          textColor: 'text-slate-400',
        };
    }
  }, [stage]);

  // SVG Geometry for a 260-degree circle arc
  const radius = 145;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius; // ~911
  const arcLength = (260 / 360) * circumference; // ~658
  const strokeDashoffset = arcLength * (1 - sweepRatio);

  // Angle for orbital beacon dot
  // Start angle: 140deg, End angle: 400deg (260 deg sweep)
  const currentAngleDeg = 140 + sweepRatio * 260;
  const currentAngleRad = (currentAngleDeg * Math.PI) / 180;
  const dotX = 180 + radius * Math.cos(currentAngleRad);
  const dotY = 180 + radius * Math.sin(currentAngleRad);

  const isTesting = stage !== 'idle' && stage !== 'completed';

  // Minimal dial markers
  const markers = [
    { label: '0', ratio: 0 },
    { label: '10', ratio: 0.2 },
    { label: '50', ratio: 0.45 },
    { label: '100', ratio: 0.67 },
    { label: '250', ratio: 0.87 },
    { label: '500+', ratio: 1 },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-2">

      {/* Sound Toggle (Clean & Minimal) */}
      {onToggleSound && (
        <button
          onClick={onToggleSound}
          id="btn-toggle-sound"
          className="absolute -top-2 right-4 z-20 p-2 rounded-full text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          title={isSoundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
        >
          {isSoundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>
      )}

      {/* Main Circular Speed Hub */}
      <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] flex items-center justify-center">

        {/* Soft Ambient Dynamic Glow */}
        <div
          className="absolute inset-8 rounded-full transition-all duration-700 pointer-events-none blur-3xl opacity-60"
          style={{ backgroundColor: config.glow }}
        />

        {/* Outer Minimal Subtle Ring */}
        <div className="absolute inset-4 sm:inset-5 rounded-full border border-white/[0.05] pointer-events-none" />

        {/* SVG Dial Arc */}
        <svg
          className="w-full h-full pointer-events-none"
          viewBox="0 0 360 360"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="idleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Track Arc */}
          <circle
            cx="180"
            cy="180"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            transform="rotate(140 180 180)"
          />

          {/* Active Gradient Speed Arc */}
          <circle
            cx="180"
            cy="180"
            r={radius}
            fill="none"
            stroke={`url(#${config.gradId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            filter="url(#arcGlow)"
            className="transition-all duration-200 ease-out"
            transform="rotate(140 180 180)"
          />

          {/* Gliding Orbital Beacon Dot */}
          {sweepRatio > 0 && (
            <g className="transition-all duration-200 ease-out">
              <circle
                cx={dotX}
                cy={dotY}
                r="7"
                fill={config.color}
                opacity="0.3"
                className={isTesting ? 'animate-ping' : ''}
              />
              <circle
                cx={dotX}
                cy={dotY}
                r="4.5"
                fill="#ffffff"
                stroke={config.color}
                strokeWidth="2.5"
              />
            </g>
          )}

          {/* Minimal Clean Scale Ticks */}
          {markers.map((m, idx) => {
            const angleDeg = 140 + m.ratio * 260;
            const angleRad = (angleDeg * Math.PI) / 180;
            const textR = radius - 20;
            const tx = 180 + textR * Math.cos(angleRad);
            const ty = 180 + textR * Math.sin(angleRad);
            const isPassed = sweepRatio >= m.ratio && sweepRatio > 0;

            return (
              <text
                key={idx}
                x={tx}
                y={ty + 4}
                textAnchor="middle"
                className={`text-[10px] font-mono select-none transition-colors duration-200 ${
                  isPassed ? 'fill-slate-200 font-semibold' : 'fill-slate-600'
                }`}
              >
                {m.label}
              </text>
            );
          })}
        </svg>

        {/* Center Minimal Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">

          {/* Active Status Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-1 backdrop-blur-md">
            {config.Icon && (
              <config.Icon className={`w-3.5 h-3.5 ${config.textColor} ${isTesting ? 'animate-bounce' : ''}`} />
            )}
            <span className={`text-xs font-medium ${config.textColor}`}>
              {config.label}
            </span>
          </div>

          {/* Huge Clean Speed Number */}
          <div className="flex items-baseline justify-center tracking-tight font-extrabold text-white font-num leading-none my-1">
            <span className="text-5xl sm:text-6xl drop-shadow-sm">
              {speed > 0 ? (speed >= 100 ? speed.toFixed(0) : speed.toFixed(1)) : '0'}
            </span>
          </div>

          {/* Mbps Unit Tag */}
          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase font-mono">
            Mbps
          </span>

          {/* Peak burst info if available */}
          {effectivePeak > 0 && isTesting && (
            <div className="text-[11px] font-mono text-slate-500 mt-2">
              Peak: <span className="text-slate-300 font-medium">{effectivePeak.toFixed(1)} Mbps</span>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
