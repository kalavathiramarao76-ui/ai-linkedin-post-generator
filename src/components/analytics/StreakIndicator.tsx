"use client";

import { useEffect, useState } from "react";

interface StreakIndicatorProps {
  streak: number;
}

export default function StreakIndicator({ streak }: StreakIndicatorProps) {
  const [visible, setVisible] = useState(false);
  const [displayStreak, setDisplayStreak] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible || streak === 0) return;

    let current = 0;
    const interval = setInterval(() => {
      current++;
      if (current >= streak) {
        setDisplayStreak(streak);
        clearInterval(interval);
      } else {
        setDisplayStreak(current);
      }
    }, 120);

    return () => clearInterval(interval);
  }, [visible, streak]);

  const getMessage = () => {
    if (streak === 0) return "Start generating to build your streak!";
    if (streak === 1) return "First day — keep it going!";
    if (streak < 3) return "Building momentum!";
    if (streak < 7) return "Great consistency!";
    if (streak < 14) return "Unstoppable!";
    return "Legendary streak!";
  };

  const getFlames = () => {
    if (streak === 0) return "";
    if (streak < 3) return "\uD83D\uDD25";
    if (streak < 7) return "\uD83D\uDD25\uD83D\uDD25";
    return "\uD83D\uDD25\uD83D\uDD25\uD83D\uDD25";
  };

  return (
    <div
      className={`glass-card !p-5 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Current Streak
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-amber-400">
              {displayStreak}
            </span>
            <span className="text-sm text-zinc-500">
              {streak === 1 ? "day" : "days"}
            </span>
            <span className="text-xl ml-1">{getFlames()}</span>
          </div>
          <p className="text-xs text-zinc-500 mt-2">{getMessage()}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
