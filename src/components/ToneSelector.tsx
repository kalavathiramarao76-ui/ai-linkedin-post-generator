"use client";

import { TONES } from "@/lib/constants";

interface ToneSelectorProps {
  selected: string;
  onSelect: (tone: string) => void;
}

export default function ToneSelector({ selected, onSelect }: ToneSelectorProps) {
  return (
    <div className="space-y-2">
      <label id="tone-label" className="text-sm font-medium text-zinc-300">Tone</label>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="tone-label">
        {TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onSelect(tone.id)}
            role="radio"
            aria-checked={selected === tone.id}
            aria-label={`Tone: ${tone.label}`}
            className={`pill ${
              selected === tone.id ? "pill-active" : "pill-inactive"
            }`}
          >
            {tone.label}
          </button>
        ))}
      </div>
    </div>
  );
}
