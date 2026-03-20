"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Sparkles, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import CharacterCounter from "@/components/CharacterCounter";
import PostCard from "@/components/PostCard";
import LinkedInPreview from "@/components/LinkedInPreview";
import { savePost } from "@/lib/storage";
import { trackGeneration } from "@/lib/analytics";

export default function OptimizePage() {
  const [originalPost, setOriginalPost] = useState("");
  const [optimizedPost, setOptimizedPost] = useState("");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleOptimize = useCallback(async () => {
    if (!originalPost.trim()) {
      toast.error("Please paste your existing LinkedIn post");
      return;
    }

    if (originalPost.trim().length < 20) {
      toast.error("Post is too short. Add more content to optimize.");
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsOptimizing(true);
    setOptimizedPost("");

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: originalPost }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Optimization failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith("data: ")) continue;
          const data = trimmed.slice(6);
          if (data === "[DONE]") continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              setOptimizedPost((prev) => prev + parsed.text);
            }
          } catch {
            // skip
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Optimization failed";
      toast.error(msg);
    } finally {
      setIsOptimizing(false);
    }
  }, [originalPost]);

  // Track optimization after optimizedPost is set
  const prevOptimizedRef = useRef("");
  useEffect(() => {
    if (optimizedPost && optimizedPost !== prevOptimizedRef.current && !isOptimizing) {
      const wordCount = optimizedPost.trim().split(/\s+/).filter(Boolean).length;
      trackGeneration("optimized", wordCount, "optimize");
      prevOptimizedRef.current = optimizedPost;
    }
  }, [optimizedPost, isOptimizing]);

  const handleSave = useCallback(() => {
    if (!optimizedPost.trim()) return;
    savePost({ content: optimizedPost, style: "optimized", topic: "Optimized post" });
    toast.success("Optimized post saved!");
  }, [optimizedPost]);

  // Analysis stats
  const originalWords = originalPost.trim().split(/\s+/).filter(Boolean).length;
  const optimizedWords = optimizedPost.trim().split(/\s+/).filter(Boolean).length;
  const hasHashtags = (text: string) => (text.match(/#\w+/g) || []).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Post Optimizer</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Paste your existing LinkedIn post and AI will optimize it for maximum engagement
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — Original */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">Original Post</h2>
            <span className="text-xs text-zinc-500">{originalWords} words</span>
          </div>

          <div className="card !p-0">
            <textarea
              value={originalPost}
              onChange={(e) => setOriginalPost(e.target.value)}
              placeholder="Paste your LinkedIn post here...

Example:
Just got promoted to Senior Engineer! Really happy about it. Been working hard for the past 2 years and finally made it. Thanks to my team for the support. #Engineering #Career"
              className="w-full min-h-[300px] resize-none rounded-xl border-0 bg-transparent px-5 py-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
            />
          </div>

          <CharacterCounter count={originalPost.length} />

          <button
            onClick={handleOptimize}
            disabled={isOptimizing || !originalPost.trim()}
            className="btn-primary w-full"
          >
            {isOptimizing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Optimize for Engagement
          </button>

          {/* Comparison Stats */}
          {optimizedPost && (
            <div className="card !p-4">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                Optimization Analysis
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-zinc-200">
                    {originalPost.length}{" "}
                    <ArrowRight className="inline h-3 w-3 text-zinc-600" />{" "}
                    {optimizedPost.length}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Characters</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-zinc-200">
                    {originalWords}{" "}
                    <ArrowRight className="inline h-3 w-3 text-zinc-600" />{" "}
                    {optimizedWords}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Words</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-zinc-200">
                    {hasHashtags(originalPost)}{" "}
                    <ArrowRight className="inline h-3 w-3 text-zinc-600" />{" "}
                    {hasHashtags(optimizedPost)}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-0.5">Hashtags</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right — Optimized */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-300">
              Optimized Post
            </h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPreview ? "Editor View" : "LinkedIn Preview"}
            </button>
          </div>

          <CharacterCounter count={optimizedPost.length} />

          {showPreview ? (
            <LinkedInPreview content={optimizedPost} />
          ) : (
            <PostCard
              content={optimizedPost}
              isStreaming={isOptimizing}
              onSave={optimizedPost ? handleSave : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
