"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Copy, Check, Zap } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

function SharedPostContent() {
  const searchParams = useSearchParams();
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const postParam = searchParams.get("post");
    if (postParam) {
      try {
        const decoded = decodeURIComponent(atob(postParam));
        setContent(decoded);
      } catch {
        setError(true);
      }
    } else {
      setError(true);
    }
  }, [searchParams]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="card max-w-md w-full text-center py-12">
          <h2 className="text-xl font-bold text-white mb-2">Invalid Share Link</h2>
          <p className="text-sm text-zinc-400 mb-6">
            This link is expired or invalid. Try generating a new post.
          </p>
          <Link href="/app" className="btn-primary">
            Create Your Own Post
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Animated Background */}
      <div className="animated-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-zinc-800 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600" aria-hidden="true">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">PostCraft</h1>
              <p className="text-[10px] text-indigo-400 font-medium -mt-0.5">AI-Powered</p>
            </div>
          </Link>
          <Link href="/app" className="btn-primary !py-2 !px-4 !text-xs">
            Create Your Own
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-start justify-center px-6 py-12">
        <div className="max-w-2xl w-full space-y-6 page-transition">
          {/* Shared badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600/15 border border-indigo-500/20 px-3 py-1 text-xs font-medium text-indigo-300">
              Shared Post
            </span>
          </div>

          {/* LinkedIn Preview Card */}
          <div className="card">
            {/* LinkedIn-style header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-800">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">PostCraft User</p>
                <p className="text-xs text-zinc-500">Generated with PostCraft AI</p>
              </div>
            </div>

            {/* Post Content */}
            <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-200">
              {content}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={handleCopy}
                className="btn-secondary"
                aria-label={copied ? "Copied" : "Copy post"}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                ) : (
                  <Copy className="h-4 w-4" aria-hidden="true" />
                )}
                {copied ? "Copied!" : "Copy Post"}
              </button>

              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  content.length > 250 ? content.slice(0, 247) + "..." : content
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                aria-label="Share to Twitter"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Tweet
              </a>

              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
                aria-label="Share to LinkedIn"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Post
              </a>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-sm text-zinc-500 mb-3">
              Want to create posts like this?
            </p>
            <Link href="/app" className="btn-primary">
              <Zap className="h-4 w-4" aria-hidden="true" />
              Try PostCraft AI — Free
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SharedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <div className="text-zinc-500 text-sm">Loading shared post...</div>
        </div>
      }
    >
      <SharedPostContent />
    </Suspense>
  );
}
