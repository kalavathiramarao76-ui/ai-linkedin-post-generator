"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Share2, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  content: string;
  size?: "sm" | "md";
}

export default function ShareButton({ content, size = "sm" }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const getShareUrl = useCallback(() => {
    const encoded = btoa(encodeURIComponent(content));
    const base = typeof window !== "undefined" ? window.location.origin : "";
    return `${base}/shared?post=${encoded}`;
  }, [content]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      toast.success("Share link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }, [getShareUrl]);

  const handleShareTwitter = useCallback(() => {
    const text = content.length > 250 ? content.slice(0, 247) + "..." : content;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }, [content, getShareUrl]);

  const handleShareLinkedIn = useCallback(() => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }, [getShareUrl]);

  if (!content) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className={`btn-secondary ${
          size === "sm" ? "!py-1.5 !px-3 !text-xs" : ""
        }`}
        aria-label="Share post"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Share2 className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden="true" />
        Share
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-white/10 bg-zinc-900/95 backdrop-blur-xl p-2 shadow-2xl language-dropdown"
          role="menu"
          aria-label="Share options"
        >
          <button
            onClick={handleCopyLink}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            role="menuitem"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            {copied ? "Link Copied!" : "Copy Link"}
          </button>

          <button
            onClick={handleShareTwitter}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            role="menuitem"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Share to X / Twitter
          </button>

          <button
            onClick={handleShareLinkedIn}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
            role="menuitem"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            Share to LinkedIn
          </button>

          <div className="mx-3 my-1.5 border-t border-zinc-800" />

          <a
            href={getShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            role="menuitem"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Open Shared View
          </a>
        </div>
      )}
    </div>
  );
}
