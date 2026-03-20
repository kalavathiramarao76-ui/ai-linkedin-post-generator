"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { LANGUAGES, type Language } from "@/lib/languages";

interface LanguageSelectorProps {
  selected: string;
  onSelect: (code: string) => void;
}

export default function LanguageSelector({ selected, onSelect }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === selected) || LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
    if (e.key === "ArrowDown" && isOpen && listRef.current) {
      e.preventDefault();
      const firstItem = listRef.current.querySelector<HTMLElement>('[role="option"]');
      firstItem?.focus();
    }
  }

  function handleOptionKeyDown(e: React.KeyboardEvent, lang: Language, index: number) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(lang.code);
      setIsOpen(false);
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const items = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
      if (items && index < items.length - 1) items[index + 1].focus();
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const items = listRef.current?.querySelectorAll<HTMLElement>('[role="option"]');
      if (items && index > 0) items[index - 1].focus();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div className="space-y-2">
      <label id="language-label" className="text-sm font-medium text-zinc-300 flex items-center gap-1.5">
        <Globe className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
        Language
      </label>
      <div ref={containerRef} className="relative">
        <button
          type="button"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby="language-label"
          aria-label={`Language: ${currentLang.label}`}
          onKeyDown={handleKeyDown}
          onClick={() => setIsOpen((prev) => !prev)}
          className="language-selector-trigger flex items-center justify-between w-full rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-2.5 text-sm text-zinc-100 transition-all hover:border-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          <span className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">{currentLang.flag}</span>
            <span>{currentLang.label}</span>
            <span className="text-zinc-500 text-xs">({currentLang.nativeName})</span>
          </span>
          <ChevronDown
            className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <ul
            ref={listRef}
            role="listbox"
            aria-labelledby="language-label"
            className="language-dropdown absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-2xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {LANGUAGES.map((lang, index) => (
              <li
                key={lang.code}
                role="option"
                tabIndex={0}
                aria-selected={lang.code === selected}
                onClick={() => {
                  onSelect(lang.code);
                  setIsOpen(false);
                }}
                onKeyDown={(e) => handleOptionKeyDown(e, lang, index)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-all text-sm focus:outline-none focus:bg-indigo-600/20 ${
                  lang.code === selected
                    ? "bg-indigo-600/15 text-indigo-300"
                    : "text-zinc-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-lg" aria-hidden="true">{lang.flag}</span>
                <span className="flex-1">{lang.label}</span>
                <span className="text-xs text-zinc-500">{lang.nativeName}</span>
                {lang.code === selected && (
                  <span className="text-indigo-400 text-xs" aria-hidden="true">&#10003;</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
