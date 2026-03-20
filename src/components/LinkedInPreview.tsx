"use client";

import { ThumbsUp, MessageCircle, Repeat2, Send } from "lucide-react";

interface LinkedInPreviewProps {
  content: string;
  authorName?: string;
  authorTitle?: string;
}

export default function LinkedInPreview({
  content,
  authorName = "Your Name",
  authorTitle = "Your Title | Company",
}: LinkedInPreviewProps) {
  const truncatedContent =
    content.length > 210
      ? content.slice(0, 210) + "...see more"
      : content;

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <div className="rounded-lg border border-zinc-700/50 bg-zinc-900 shadow-xl">
        {/* Header */}
        <div className="flex items-start gap-3 p-4 pb-2">
          <div className="h-12 w-12 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-zinc-100">{authorName}</p>
            <p className="text-xs text-zinc-400 truncate">{authorTitle}</p>
            <p className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
              Just now · 🌐
            </p>
          </div>
          <button className="text-indigo-400 text-sm font-semibold hover:text-indigo-300">
            + Follow
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
            {content || (
              <span className="text-zinc-500 italic">
                Your generated post will appear here...
              </span>
            )}
          </p>
        </div>

        {/* Engagement Stats */}
        <div className="px-4 py-2 flex items-center justify-between border-t border-zinc-800">
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[8px]">
                👍
              </span>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px]">
                ❤️
              </span>
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[8px]">
                💡
              </span>
            </div>
            <span className="text-xs text-zinc-500 ml-1">
              {content ? Math.floor(Math.random() * 200 + 50) : 0}
            </span>
          </div>
          <div className="text-xs text-zinc-500">
            {content
              ? `${Math.floor(Math.random() * 30 + 5)} comments · ${Math.floor(Math.random() * 15 + 2)} reposts`
              : "0 comments · 0 reposts"}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-around border-t border-zinc-800 px-2 py-1">
          {[
            { icon: ThumbsUp, label: "Like" },
            { icon: MessageCircle, label: "Comment" },
            { icon: Repeat2, label: "Repost" },
            { icon: Send, label: "Send" },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
