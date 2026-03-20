"use client";

import { POST_STYLES } from "@/lib/constants";

interface StyleSelectorProps {
  selected: string;
  onSelect: (style: string) => void;
}

export default function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">Writing Style</label>
      <div className="flex flex-wrap gap-2">
        {POST_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={`pill ${
              selected === style.id ? "pill-active" : "pill-inactive"
            }`}
            title={style.description}
          >
            <span className="mr-1">{style.emoji}</span>
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
}
