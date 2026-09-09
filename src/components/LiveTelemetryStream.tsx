import React, { useMemo } from 'react';
import { SpeedTestStage } from '../types';

interface LiveTelemetryStreamProps {
  stage: SpeedTestStage;
  downloadSpeed: number;
  uploadSpeed: number;
  historyPoints: { time: number; speed: number; stage: SpeedTestStage }[];
  peakSpeed: number;
}

export const LiveTelemetryStream: React.FC<LiveTelemetryStreamProps> = ({
  stage,
  downloadSpeed,
  uploadSpeed,
  historyPoints,
  peakSpeed,
}) => {
  const isTesting = stage === 'download' || stage === 'upload';
  const isCompleted = stage === 'completed';

  const { pathData, areaData, currentPoint } = useMemo(() => {
    if (historyPoints.length < 2) {
      return { pathData: '', areaData: '', currentPoint: null };
    }

    const maxSpeed = Math.max(...historyPoints.map((p) => p.speed), 10);
    const scale = Math.max(20, Math.ceil((maxSpeed * 1.2) / 10) * 10);
    const width = 500;
    const height = 70;

    const coords = historyPoints.map((p, i, arr) => {
      const x = (i / (arr.length - 1 || 1)) * width;
      const y = height - (p.speed / scale) * (height - 10);
      return { x, y, speed: p.speed, stage: p.stage };
    });

    const ptsStr = coords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' L ');
    const path = `M ${ptsStr}`;
    const area = `M ${coords[0].x.toFixed(1)},${height} L ${ptsStr} L ${coords[coords.length - 1].x.toFixed(1)},${height} Z`;
    const lastCoord = coords[coords.length - 1];

    return {
      pathData: path,
      areaData: area,
      currentPoint: lastCoord,
    };
  }, [historyPoints]);

  if (!isTesting && !isCompleted) {
    return null;
  }

  const activeColor = stage === 'upload' ? '#10b981' : '#06b6d4';
  const currentSpeed = stage === 'upload' ? uploadSpeed : downloadSpeed;

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 transition-all duration-300">
      <div className="flex items-center justify-between mb-2 text-xs font-mono text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Live Bandwidth Graph
        </span>
        <span>
          Current: <strong className="text-white">{currentSpeed.toFixed(1)} Mbps</strong>
        </span>
      </div>

      <div className="relative w-full h-16">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 500 70" preserveAspectRatio="none">
          <defs>
            <linearGradient id="streamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={activeColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={activeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {areaData && <path d={areaData} fill="url(#streamGrad)" />}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              stroke={activeColor}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {currentPoint && isTesting && (
            <circle cx={currentPoint.x} cy={currentPoint.y} r="3.5" fill="#ffffff" stroke={activeColor} strokeWidth="2" />
          )}
        </svg>
      </div>
    </div>
  );
};
