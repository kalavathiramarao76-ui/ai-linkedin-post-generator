"use client";

import { LINKEDIN_CHAR_LIMIT } from "@/lib/constants";

interface CharacterCounterProps {
  count: number;
}

export default function CharacterCounter({ count }: CharacterCounterProps) {
  const percentage = (count / LINKEDIN_CHAR_LIMIT) * 100;

  let colorClass = "text-emerald-400";
  let bgClass = "bg-emerald-400";
  let label = "Good length";

  if (count > 2800) {
    colorClass = "text-red-400";
    bgClass = "bg-red-400";
    label = "Near limit";
  } else if (count > 2000) {
    colorClass = "text-amber-400";
    bgClass = "bg-amber-400";
    label = "Getting long";
  } else if (count === 0) {
    colorClass = "text-zinc-500";
    bgClass = "bg-zinc-600";
    label = "Start typing";
  }

  return (
    <div className="flex items-center gap-3" role="status" aria-label={`Character count: ${count} of ${LINKEDIN_CHAR_LIMIT}. ${label}`}>
      <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden" role="progressbar" aria-valuenow={count} aria-valuemin={0} aria-valuemax={LINKEDIN_CHAR_LIMIT}>
        <div
          className={`h-full rounded-full transition-all duration-300 ${bgClass}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className={`flex items-center gap-1.5 text-xs font-medium ${colorClass}`}>
        <span>
          {count.toLocaleString()} / {LINKEDIN_CHAR_LIMIT.toLocaleString()}
        </span>
        <span className="text-zinc-600" aria-hidden="true">·</span>
        <span className="text-zinc-500">{label}</span>
      </div>
    </div>
  );
}
