"use client";

import { useEffect, useState } from "react";
import type { DailyEntry } from "@/lib/analytics";

interface BarChartProps {
  data: DailyEntry[];
  title: string;
}

export default function BarChart({ data, title }: BarChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const hasData = data.some((d) => d.count > 0);

  const dayLabels = data.map((d) => {
    const date = new Date(d.date + "T00:00:00");
    return date.toLocaleDateString("en-US", { weekday: "short" });
  });

  return (
    <div className="glass-card !p-6">
      <h3 className="text-sm font-semibold text-zinc-200 mb-6">{title}</h3>

      {!hasData ? (
        <div className="flex items-center justify-center h-48 text-sm text-zinc-500">
          No activity this week
        </div>
      ) : (
        <div className="flex items-end gap-3 h-48 px-2">
          {data.map((entry, i) => {
            const heightPct = (entry.count / maxCount) * 100;
            const isToday = i === data.length - 1;

            return (
              <div
                key={entry.date}
                className="flex-1 flex flex-col items-center gap-2"
              >
                {/* Count label */}
                <span
                  className={`text-xs font-medium transition-opacity duration-500 ${
                    animated && entry.count > 0
                      ? "opacity-100"
                      : "opacity-0"
                  } ${isToday ? "text-indigo-400" : "text-zinc-400"}`}
                  style={{ transitionDelay: `${i * 0.1 + 0.6}s` }}
                >
                  {entry.count > 0 ? entry.count : ""}
                </span>

                {/* Bar container */}
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t-md transition-all ease-out ${
                      isToday
                        ? "bg-gradient-to-t from-indigo-600 to-indigo-400"
                        : "bg-gradient-to-t from-indigo-600/60 to-indigo-400/40"
                    }`}
                    style={{
                      height: animated
                        ? `${Math.max(heightPct, entry.count > 0 ? 8 : 2)}%`
                        : "2%",
                      transitionDuration: "0.8s",
                      transitionDelay: `${i * 0.1}s`,
                    }}
                  />
                </div>

                {/* Day label */}
                <span
                  className={`text-[10px] ${
                    isToday ? "text-indigo-400 font-semibold" : "text-zinc-600"
                  }`}
                >
                  {dayLabels[i]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
