"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Sparkles,
  Loader2,
  Hash,
  Lightbulb,
  RefreshCw,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import StyleSelector from "@/components/StyleSelector";
import ToneSelector from "@/components/ToneSelector";
import CharacterCounter from "@/components/CharacterCounter";
import PostCard from "@/components/PostCard";
import LinkedInPreview from "@/components/LinkedInPreview";
import { savePost, saveDraft, getDraft } from "@/lib/storage";

type ActiveTool = "generate" | "hooks" | "hashtags" | "tone";

export default function GeneratePage() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("thought-leadership");
  const [tone, setTone] = useState("professional");
  const [generatedPost, setGeneratedPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>("generate");
  const [showPreview, setShowPreview] = useState(false);
  const [hookResults, setHookResults] = useState("");
  const [hashtagResults, setHashtagResults] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  // Load draft on mount
  useEffect(() => {
    const draft = getDraft();
    if (draft) setTopic(draft);
  }, []);

  // Save draft on topic change
  useEffect(() => {
    if (topic) saveDraft(topic);
  }, [topic]);

  const streamFromAPI = useCallback(
    async (
      endpoint: string,
      body: Record<string, unknown>,
      onChunk: (text: string) => void,
      onDone: () => void
    ) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error || "Request failed");
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
              if (parsed.text) onChunk(parsed.text);
            } catch {
              // skip
            }
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") return;
        throw err;
      } finally {
        onDone();
      }
    },
    []
  );

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic or idea");
      return;
    }

    setIsGenerating(true);
    setGeneratedPost("");

    try {
      await streamFromAPI(
        "/api/generate",
        { topic, style, type: "generate" },
        (text) => setGeneratedPost((prev) => prev + text),
        () => {
          setIsGenerating(false);
          toast.success("Post generated successfully!");
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      toast.error(msg);
      setIsGenerating(false);
    }
  }, [topic, style, streamFromAPI]);

  const handleGenerateHooks = useCallback(async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setHookResults("");
    setActiveTool("hooks");

    try {
      await streamFromAPI(
        "/api/generate",
        { topic, type: "hooks" },
        (text) => setHookResults((prev) => prev + text),
        () => {
          setIsGenerating(false);
          toast.success("Hooks generated!");
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hook generation failed";
      toast.error(msg);
      setIsGenerating(false);
    }
  }, [topic, streamFromAPI]);

  const handleSuggestHashtags = useCallback(async () => {
    if (!generatedPost.trim() && !topic.trim()) {
      toast.error("Generate a post first or enter a topic");
      return;
    }

    setIsGenerating(true);
    setHashtagResults("");
    setActiveTool("hashtags");

    try {
      await streamFromAPI(
        "/api/generate",
        { topic, content: generatedPost, type: "hashtags" },
        (text) => setHashtagResults((prev) => prev + text),
        () => {
          setIsGenerating(false);
          toast.success("Hashtags suggested!");
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hashtag suggestion failed";
      toast.error(msg);
      setIsGenerating(false);
    }
  }, [topic, generatedPost, streamFromAPI]);

  const handleToneAdjust = useCallback(async () => {
    if (!generatedPost.trim()) {
      toast.error("Generate a post first");
      return;
    }

    setIsGenerating(true);
    setGeneratedPost("");

    try {
      await streamFromAPI(
        "/api/generate",
        { content: generatedPost, tone, type: "tone", topic },
        (text) => setGeneratedPost((prev) => prev + text),
        () => {
          setIsGenerating(false);
          toast.success("Tone adjusted!");
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Tone adjustment failed";
      toast.error(msg);
      setIsGenerating(false);
    }
  }, [generatedPost, tone, topic, streamFromAPI]);

  const handleSavePost = useCallback(() => {
    if (!generatedPost.trim()) return;
    savePost({ content: generatedPost, style, topic });
    toast.success("Post saved!");
  }, [generatedPost, style, topic]);

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Post Generator</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Enter your topic and let AI craft the perfect LinkedIn post
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column — Input */}
        <div className="space-y-5">
          {/* Topic Input */}
          <div className="card space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">
                Topic / Idea
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Why most startups fail in the first year, Leadership lessons from building a remote team, How I grew my LinkedIn following to 50K..."
                className="input-field min-h-[120px] resize-none"
                rows={4}
              />
            </div>

            <StyleSelector selected={style} onSelect={setStyle} />
            <ToneSelector selected={tone} onSelect={setTone} />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className={`btn-primary flex-1 min-w-[140px] ${
                  !isGenerating && topic.trim() ? "btn-pulse-idle" : ""
                }`}
              >
                {isGenerating && activeTool === "generate" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate Post
              </button>

              <button
                onClick={handleGenerateHooks}
                disabled={isGenerating || !topic.trim()}
                className="btn-secondary"
                title="Generate 10 hooks"
              >
                <Lightbulb className="h-4 w-4" />
                Hooks
              </button>

              <button
                onClick={handleSuggestHashtags}
                disabled={isGenerating}
                className="btn-secondary"
                title="Suggest hashtags"
              >
                <Hash className="h-4 w-4" />
                Hashtags
              </button>

              <button
                onClick={handleToneAdjust}
                disabled={isGenerating || !generatedPost.trim()}
                className="btn-secondary"
                title="Adjust tone"
              >
                <RefreshCw className="h-4 w-4" />
                Adjust Tone
              </button>
            </div>
          </div>

          {/* Hook Results */}
          {hookResults && (
            <div className="card">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                Generated Hooks
              </h3>
              <div
                className={`whitespace-pre-line text-sm text-zinc-300 leading-relaxed ${
                  isGenerating && activeTool === "hooks"
                    ? "streaming-cursor"
                    : ""
                }`}
              >
                {hookResults}
              </div>
            </div>
          )}

          {/* Hashtag Results */}
          {hashtagResults && (
            <div className="card">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                <Hash className="h-4 w-4 text-indigo-400" />
                Suggested Hashtags
              </h3>
              <div
                className={`whitespace-pre-line text-sm text-zinc-300 leading-relaxed ${
                  isGenerating && activeTool === "hashtags"
                    ? "streaming-cursor"
                    : ""
                }`}
              >
                {hashtagResults}
              </div>
            </div>
          )}
        </div>

        {/* Right Column — Output */}
        <div className="space-y-4">
          {/* Toggle Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(false)}
                className={`text-sm font-medium transition-colors ${
                  !showPreview ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                Editor View
              </button>
              <span className="text-zinc-700">|</span>
              <button
                onClick={() => setShowPreview(true)}
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  showPreview ? "text-indigo-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {showPreview ? (
                  <Eye className="h-3.5 w-3.5" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" />
                )}
                LinkedIn Preview
              </button>
            </div>

            {generatedPost && (
              <button
                onClick={handleSavePost}
                className="btn-secondary !py-1.5 !px-3 !text-xs"
              >
                <Save className="h-3.5 w-3.5" />
                Save Draft
              </button>
            )}
          </div>

          {/* Character Counter */}
          <CharacterCounter count={generatedPost.length} />

          {/* Output */}
          {showPreview ? (
            <LinkedInPreview content={generatedPost} />
          ) : (
            <PostCard
              content={generatedPost}
              isStreaming={isGenerating && activeTool === "generate"}
              onSave={generatedPost ? handleSavePost : undefined}
            />
          )}
        </div>
      </div>
    </div>
  );
}
