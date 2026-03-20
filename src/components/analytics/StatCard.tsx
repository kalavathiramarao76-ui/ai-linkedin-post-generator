"use client";

import { useEffect, useState, useRef } from "react";

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  color: "indigo" | "emerald" | "amber" | "purple";
  delay?: number;
}

const colorMap = {
  indigo: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
  },
};

export default function StatCard({
  label,
  value,
  suffix = "",
  icon,
  color,
  delay = 0,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!visible || value === 0) return;

    const duration = 1200;
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;
    const increment = value / steps;

    const interval = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [visible, value]);

  const colors = colorMap[color];

  return (
    <div
      ref={ref}
      className={`stat-card-enter glass-card !p-5 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            {label}
          </p>
          <p className={`text-3xl font-bold mt-2 ${colors.text}`}>
            {displayValue.toLocaleString()}
            {suffix && (
              <span className="text-lg ml-1 text-zinc-500">{suffix}</span>
            )}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${colors.bg} ${colors.text}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
