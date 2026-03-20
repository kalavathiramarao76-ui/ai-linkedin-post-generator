"use client";

import { useState } from "react";
import { Copy, Check, Bookmark, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PostCardProps {
  content: string;
  isStreaming?: boolean;
  onSave?: () => void;
  onDelete?: () => void;
  onUseAsTemplate?: () => void;
  showActions?: boolean;
  meta?: { style?: string; topic?: string; date?: string };
}

export default function PostCard({
  content,
  isStreaming = false,
  onSave,
  onDelete,
  onUseAsTemplate,
  showActions = true,
  meta,
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

  return (
    <div className="card group relative">
      {meta && (
        <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500">
          {meta.style && (
            <span className="pill pill-inactive">{meta.style}</span>
          )}
          {meta.date && <span>{meta.date}</span>}
        </div>
      )}

      <div
        className={`whitespace-pre-line text-sm leading-relaxed text-zinc-200 ${
          isStreaming ? "streaming-cursor" : ""
        }`}
      >
        {content || (
          <span className="text-zinc-500 italic">
            Generated post will appear here...
          </span>
        )}
      </div>

      {showActions && content && (
        <div className="mt-4 flex items-center gap-2 pt-3 border-t border-zinc-800">
          <button
            onClick={handleCopy}
            className="btn-secondary !py-1.5 !px-3 !text-xs"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>

          {onSave && (
            <button
              onClick={onSave}
              className="btn-secondary !py-1.5 !px-3 !text-xs"
            >
              <Bookmark className="h-3.5 w-3.5" />
              Save
            </button>
          )}

          {onUseAsTemplate && (
            <button
              onClick={onUseAsTemplate}
              className="btn-secondary !py-1.5 !px-3 !text-xs"
            >
              Use as Template
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className="btn-secondary !py-1.5 !px-3 !text-xs ml-auto hover:!border-red-800 hover:!text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
