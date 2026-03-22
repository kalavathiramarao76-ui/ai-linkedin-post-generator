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
import ToneSelector from "@/components/ToneSelector";
import LanguageSelector from "@/components/LanguageSelector";
import CharacterCounter from "@/components/CharacterCounter";
import PostCard from "@/components/PostCard";
import LinkedInPreview from "@/components/LinkedInPreview";
import { savePost, saveDraft, getDraft } from "@/lib/storage";
import { trackGeneration } from "@/lib/analytics";
import { getStoredLanguage, setStoredLanguage, getLanguageByCode } from "@/lib/languages";
import ApiErrorFallback from "@/components/ApiErrorFallback";
import { POST_STYLES } from "@/lib/constants";

type ActiveTool = "generate" | "hooks" | "hashtags" | "tone";

export default function GeneratePage() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState("thought-leadership");
  const [tone, setTone] = useState("professional");
  const [language, setLanguage] = useState("en");
  const [generatedPost, setGeneratedPost] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>("generate");
  const [showPreview, setShowPreview] = useState(false);
  const [hookResults, setHookResults] = useState("");
  const [hashtagResults, setHashtagResults] = useState("");
  const [postLanguage, setPostLanguage] = useState("en");
  const [apiError, setApiError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  // Load draft and language on mount
  useEffect(() => {
    const draft = getDraft();
    if (draft) setTopic(draft);
    const storedLang = getStoredLanguage();
    setLanguage(storedLang);
  }, []);

  // Save draft on topic change
  useEffect(() => {
    if (topic) saveDraft(topic);
  }, [topic]);

  // Persist language preference
  const handleLanguageChange = useCallback((code: string) => {
    setLanguage(code);
    setStoredLanguage(code);
  }, []);

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

        if (response.status === 429) {
          const errorData = await response.json();
          if (errorData.error === "FREE_LIMIT_REACHED") {
            window.dispatchEvent(new CustomEvent("usage-changed", { detail: errorData.count }));
            return;
          }
        }

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
    setPostLanguage(language);
    setApiError(null);
    let fullText = "";

    try {
      await streamFromAPI(
        "/api/generate",
        { topic, style, type: "generate", language },
        (text) => {
          fullText += text;
          setGeneratedPost((prev) => prev + text);
        },
        () => {
          setIsGenerating(false);
          const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
          trackGeneration(style, wordCount, "generate");
          toast.success("Post generated successfully!");
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      setApiError(msg);
      toast.error(msg);
      setIsGenerating(false);
    }
  }, [topic, style, language, streamFromAPI]);

  const handleGenerateHooks = useCallback(async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    setHookResults("");
    setActiveTool("hooks");
    let fullText = "";

    try {
      await streamFromAPI(
        "/api/generate",
        { topic, type: "hooks", language },
        (text) => {
          fullText += text;
          setHookResults((prev) => prev + text);
        },
        () => {
          setIsGenerating(false);
          const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
          trackGeneration(style, wordCount, "hooks");
          toast.success("Hooks generated!");
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hook generation failed";
      toast.error(msg);
      setIsGenerating(false);
    }
  }, [topic, style, language, streamFromAPI]);

  const handleSuggestHashtags = useCallback(async () => {
    if (!generatedPost.trim() && !topic.trim()) {
      toast.error("Generate a post first or enter a topic");
      return;
    }

    setIsGenerating(true);
    setHashtagResults("");
    setActiveTool("hashtags");
    let fullText = "";

    try {
      await streamFromAPI(
        "/api/generate",
        { topic, content: generatedPost, type: "hashtags", language },
        (text) => {
          fullText += text;
          setHashtagResults((prev) => prev + text);
        },
        () => {
          setIsGenerating(false);
          const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
          trackGeneration(style, wordCount, "hashtags");
          toast.success("Hashtags suggested!");
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Hashtag suggestion failed";
      toast.error(msg);
      setIsGenerating(false);
    }
  }, [topic, style, language, generatedPost, streamFromAPI]);

  const handleToneAdjust = useCallback(async () => {
    if (!generatedPost.trim()) {
      toast.error("Generate a post first");
      return;
    }

    setIsGenerating(true);
    setGeneratedPost("");
    let fullText = "";

    try {
      await streamFromAPI(
        "/api/generate",
        { content: generatedPost, tone, type: "tone", topic, language },
        (text) => {
          fullText += text;
          setGeneratedPost((prev) => prev + text);
        },
        () => {
          setIsGenerating(false);
          const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
          trackGeneration(style, wordCount, "optimize");
          toast.success("Tone adjusted!");
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Tone adjustment failed";
      toast.error(msg);
      setIsGenerating(false);
    }
  }, [generatedPost, tone, style, topic, language, streamFromAPI]);

  const handleSavePost = useCallback(() => {
    if (!generatedPost.trim()) return;
    savePost({ content: generatedPost, style, topic });
    toast.success("Post saved!");
  }, [generatedPost, style, topic]);

  const langInfo = getLanguageByCode(postLanguage);

  const styleDescriptions: Record<string, string> = {
    "thought-leadership": "Position yourself as an industry expert with authority",
    "storytelling": "Share compelling personal narratives that resonate",
    "how-to": "Step-by-step guides your audience can act on",
    "personal-brand": "Build and showcase your professional identity",
    "controversial": "Challenge conventional wisdom with bold takes",
    "data-driven": "Insights and arguments backed by real numbers",
  };

  return (
    <div className="page-transition" role="main">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-3">
          <h1 className="text-4xl font-bold text-white tracking-tight">Post Studio</h1>
          <span className="inline-flex items-center rounded-full bg-blue-500/15 border border-blue-500/25 px-3.5 py-1 text-[11px] font-semibold tracking-widest text-blue-400 uppercase">
            Workspace
          </span>
        </div>
        <p className="text-base text-zinc-500 font-light">
          Enter your topic. Choose a style. Let AI craft the perfect LinkedIn post.
        </p>
      </div>

      {/* Style Selector — Editorial Rows */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold tracking-widest text-zinc-600 uppercase mb-4">Writing Style</p>
        <div className="space-y-0">
          {POST_STYLES.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              className={`studio-style-row w-full text-left flex items-baseline gap-6 px-5 py-5 transition-all duration-200 border-t border-white/[0.04] ${
                index === POST_STYLES.length - 1 ? "border-b border-white/[0.04]" : ""
              } ${
                style === s.id
                  ? "bg-blue-500/[0.06]"
                  : "hover:bg-white/[0.015]"
              }`}
              role="radio"
              aria-checked={style === s.id}
              aria-label={`${s.label}: ${s.description}`}
            >
              <span className={`font-mono text-sm tabular-nums ${style === s.id ? "text-blue-400" : "text-zinc-700"}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={`text-2xl font-semibold tracking-tight min-w-[200px] ${style === s.id ? "text-white" : "text-zinc-400"}`}>
                {s.label}
              </span>
              <span className={`text-sm font-light ${style === s.id ? "text-zinc-400" : "text-zinc-600"}`}>
                {styleDescriptions[s.id] || s.description}
              </span>
              {style === s.id && (
                <span className="ml-auto flex-shrink-0 w-2 h-2 rounded-full bg-blue-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column — Input */}
        <div className="space-y-6">
          {/* Topic Input */}
          <div className="space-y-5">
            <div className="space-y-3">
              <label htmlFor="topic-input" className="text-[11px] font-semibold tracking-widest text-zinc-600 uppercase">
                Topic / Idea
              </label>
              <textarea
                id="topic-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Why most startups fail in the first year, Leadership lessons from building a remote team..."
                className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-5 text-base text-zinc-100 placeholder:text-zinc-600 transition-all duration-200 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[140px] resize-none font-light leading-relaxed"
                rows={4}
                aria-label="Enter your topic or idea for the LinkedIn post"
              />
            </div>

            <ToneSelector selected={tone} onSelect={setTone} />
            <LanguageSelector selected={language} onSelect={handleLanguageChange} />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-3" role="group" aria-label="Generation actions">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim()}
                className={`btn-primary flex-1 min-w-[140px] !rounded-2xl !py-3.5 !text-base ${
                  !isGenerating && topic.trim() ? "btn-pulse-idle" : ""
                }`}
                aria-label="Generate LinkedIn post"
              >
                {isGenerating && activeTool === "generate" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                )}
                Generate Post
              </button>

              <button
                onClick={handleGenerateHooks}
                disabled={isGenerating || !topic.trim()}
                className="btn-secondary !rounded-2xl !py-3.5"
                title="Generate 10 hooks"
                aria-label="Generate 10 attention-grabbing hooks"
              >
                <Lightbulb className="h-4 w-4" aria-hidden="true" />
                Hooks
              </button>

              <button
                onClick={handleSuggestHashtags}
                disabled={isGenerating}
                className="btn-secondary !rounded-2xl !py-3.5"
                title="Suggest hashtags"
                aria-label="Suggest relevant hashtags"
              >
                <Hash className="h-4 w-4" aria-hidden="true" />
                Hashtags
              </button>

              <button
                onClick={handleToneAdjust}
                disabled={isGenerating || !generatedPost.trim()}
                className="btn-secondary !rounded-2xl !py-3.5"
                title="Adjust tone"
                aria-label="Adjust the tone of the generated post"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Adjust
              </button>
            </div>
          </div>

          {/* Hook Results */}
          {hookResults && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6" role="region" aria-label="Generated hooks">
              <h3 className="text-[11px] font-semibold tracking-widest text-zinc-600 uppercase mb-4 flex items-center gap-2">
                <Lightbulb className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
                Generated Hooks
              </h3>
              <div
                className={`whitespace-pre-line text-sm text-zinc-300 leading-relaxed font-light ${
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
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6" role="region" aria-label="Suggested hashtags">
              <h3 className="text-[11px] font-semibold tracking-widest text-zinc-600 uppercase mb-4 flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-blue-400" aria-hidden="true" />
                Suggested Hashtags
              </h3>
              <div
                className={`whitespace-pre-line text-sm text-zinc-300 leading-relaxed font-light ${
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
        <div className="space-y-5">
          {/* Toggle Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4" role="tablist" aria-label="View mode">
              <button
                role="tab"
                aria-selected={!showPreview}
                onClick={() => setShowPreview(false)}
                className={`text-sm font-medium transition-colors ${
                  !showPreview ? "text-blue-400" : "text-zinc-600 hover:text-zinc-400"
                }`}
                aria-label="Switch to editor view"
              >
                Editor
              </button>
              <span className="text-zinc-800" aria-hidden="true">|</span>
              <button
                role="tab"
                aria-selected={showPreview}
                onClick={() => setShowPreview(true)}
                className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  showPreview ? "text-blue-400" : "text-zinc-600 hover:text-zinc-400"
                }`}
                aria-label="Switch to LinkedIn preview"
              >
                {showPreview ? (
                  <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                Preview
              </button>
            </div>

            {generatedPost && (
              <button
                onClick={handleSavePost}
                className="btn-secondary !py-1.5 !px-3 !text-xs !rounded-xl"
                aria-label="Save generated post as draft"
              >
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
                Save Draft
              </button>
            )}
          </div>

          {/* Language Badge */}
          {generatedPost && postLanguage !== "en" && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                <span aria-hidden="true">{langInfo.flag}</span>
                {langInfo.label}
              </span>
            </div>
          )}

          {/* Character Counter */}
          <CharacterCounter count={generatedPost.length} />

          {/* Live region for screen readers */}
          <div
            ref={liveRegionRef}
            aria-live="polite"
            aria-atomic="false"
            className="sr-only"
          >
            {isGenerating ? "Generating post content..." : generatedPost ? "Post generation complete." : ""}
          </div>

          {/* API Error Fallback */}
          {apiError && !isGenerating && (
            <ApiErrorFallback
              error={apiError}
              onRetry={() => {
                setApiError(null);
                handleGenerate();
              }}
            />
          )}

          {/* Output */}
          <div role="tabpanel" aria-label={showPreview ? "LinkedIn preview" : "Editor view"}>
            {showPreview ? (
              <LinkedInPreview content={generatedPost} />
            ) : (
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-1">
                <PostCard
                  content={generatedPost}
                  isStreaming={isGenerating && activeTool === "generate"}
                  onSave={generatedPost ? handleSavePost : undefined}
                  language={postLanguage !== "en" ? postLanguage : undefined}
                  style={style}
                  topic={topic}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
