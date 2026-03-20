"use client";

import { useEffect, useState } from "react";

interface DonutChartProps {
  data: Record<string, number>;
  title: string;
}

const COLORS = [
  { stroke: "#818cf8", label: "text-indigo-400", bg: "bg-indigo-400" },
  { stroke: "#a78bfa", label: "text-purple-400", bg: "bg-purple-400" },
  { stroke: "#f472b6", label: "text-pink-400", bg: "bg-pink-400" },
  { stroke: "#34d399", label: "text-emerald-400", bg: "bg-emerald-400" },
  { stroke: "#fbbf24", label: "text-amber-400", bg: "bg-amber-400" },
  { stroke: "#60a5fa", label: "text-blue-400", bg: "bg-blue-400" },
  { stroke: "#f87171", label: "text-red-400", bg: "bg-red-400" },
  { stroke: "#2dd4bf", label: "text-teal-400", bg: "bg-teal-400" },
];

export default function DonutChart({ data, title }: DonutChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);

  if (total === 0) {
    return (
      <div className="glass-card !p-6">
        <h3 className="text-sm font-semibold text-zinc-200 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-sm text-zinc-500">
          No data yet
        </div>
      </div>
    );
  }

  // SVG donut chart parameters
  const size = 160;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeOffset = 0;
  const segments = entries.map(([key, value], i) => {
    const percentage = value / total;
    const dashLength = circumference * percentage;
    const dashOffset = circumference * cumulativeOffset;
    cumulativeOffset += percentage;
    return {
      key,
      value,
      percentage,
      dashLength,
      dashOffset,
      color: COLORS[i % COLORS.length],
    };
  });

  return (
    <div className="glass-card !p-6">
      <h3 className="text-sm font-semibold text-zinc-200 mb-6">{title}</h3>
      <div className="flex items-center gap-8">
        {/* SVG Donut */}
        <div className="relative flex-shrink-0">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="donut-chart-svg"
            style={{ transform: "rotate(-90deg)" }}
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth={strokeWidth}
            />
            {/* Segments */}
            {segments.map((seg, i) => (
              <circle
                key={seg.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color.stroke}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
                strokeDasharray={`${animated ? seg.dashLength : 0} ${circumference}`}
                strokeDashoffset={-seg.dashOffset}
                style={{
                  transition: `stroke-dasharray 1s ease ${i * 0.15}s`,
                }}
              />
            ))}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-white">{total}</span>
            <span className="text-[10px] text-zinc-500">total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 min-w-0">
          {segments.map((seg) => (
            <div key={seg.key} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: seg.color.stroke }}
              />
              <span className="text-xs text-zinc-400 truncate flex-1">
                {formatLabel(seg.key)}
              </span>
              <span className="text-xs font-medium text-zinc-300 flex-shrink-0">
                {seg.value}
              </span>
              <span className="text-[10px] text-zinc-600 flex-shrink-0 w-8 text-right">
                {Math.round(seg.percentage * 100)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatLabel(key: string): string {
  return key
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
