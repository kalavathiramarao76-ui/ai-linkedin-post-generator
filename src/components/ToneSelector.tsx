"use client";

import { TONES } from "@/lib/constants";

interface ToneSelectorProps {
  selected: string;
  onSelect: (tone: string) => void;
}

export default function ToneSelector({ selected, onSelect }: ToneSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-300">Tone</label>
      <div className="flex flex-wrap gap-2">
        {TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => onSelect(tone.id)}
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
