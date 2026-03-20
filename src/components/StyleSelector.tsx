"use client";

import { POST_STYLES } from "@/lib/constants";

interface StyleSelectorProps {
  selected: string;
  onSelect: (style: string) => void;
}

export default function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  return (
    <div className="space-y-2">
      <label id="style-label" className="text-sm font-medium text-zinc-300">Writing Style</label>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="style-label">
        {POST_STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            role="radio"
            aria-checked={selected === style.id}
            aria-label={`${style.label}: ${style.description}`}
            className={`pill ${
              selected === style.id ? "pill-active" : "pill-inactive"
            }`}
            title={style.description}
          >
            <span className="mr-1" aria-hidden="true">{style.emoji}</span>
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
}
