"use client";

import { useState } from "react";
import { Copy, Check, Bookmark, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { getLanguageByCode } from "@/lib/languages";

interface PostCardProps {
  content: string;
  isStreaming?: boolean;
  onSave?: () => void;
  onDelete?: () => void;
  onUseAsTemplate?: () => void;
  showActions?: boolean;
  meta?: { style?: string; topic?: string; date?: string };
  language?: string;
}

export default function PostCard({
  content,
  isStreaming = false,
  onSave,
  onDelete,
  onUseAsTemplate,
  showActions = true,
  meta,
  language,
}: PostCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Post copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const langInfo = language ? getLanguageByCode(language) : null;

  return (
    <div className="card group relative" role="region" aria-label="Generated post">
      {(meta || langInfo) && (
        <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500 flex-wrap">
          {meta?.style && (
            <span className="pill pill-inactive">{meta.style}</span>
          )}
          {langInfo && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600/15 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium text-indigo-300">
              <span aria-hidden="true">{langInfo.flag}</span>
              {langInfo.label}
            </span>
          )}
          {meta?.date && <span>{meta.date}</span>}
        </div>
      )}

      <div
        className={`whitespace-pre-line text-sm leading-relaxed text-zinc-200 ${
          isStreaming ? "streaming-cursor" : ""
        }`}
        aria-live={isStreaming ? "polite" : undefined}
        aria-atomic="false"
      >
        {content || (
          <span className="text-zinc-500 italic">
            Generated post will appear here...
          </span>
        )}
      </div>

      {showActions && content && (
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-zinc-800" role="group" aria-label="Post actions">
          <button
            onClick={handleCopy}
            className="btn-secondary !py-1.5 !px-3 !text-xs"
            aria-label={copied ? "Copied to clipboard" : "Copy post to clipboard"}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>

          {onSave && (
            <button
              onClick={onSave}
              className="btn-secondary !py-1.5 !px-3 !text-xs"
              aria-label="Save post"
            >
              <Bookmark className="h-3.5 w-3.5" aria-hidden="true" />
              Save
            </button>
          )}

          {onUseAsTemplate && (
            <button
              onClick={onUseAsTemplate}
              className="btn-secondary !py-1.5 !px-3 !text-xs"
              aria-label="Use this post as a template"
            >
              Use as Template
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="btn-secondary !py-1.5 !px-3 !text-xs ml-auto hover:!border-red-800 hover:!text-red-400"
              aria-label="Delete post"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
