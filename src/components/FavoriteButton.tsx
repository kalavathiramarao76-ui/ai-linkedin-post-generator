"use client";

import { useState, useEffect, useCallback } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import {
  addFavorite,
  removeFavorite,
  isFavorite,
  getFavoriteByContent,
} from "@/lib/favorites";

interface FavoriteButtonProps {
  content: string;
  style: string;
  topic: string;
  size?: "sm" | "md";
}

export default function FavoriteButton({
  content,
  style,
  topic,
  size = "sm",
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [bouncing, setBouncing] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(content));
  }, [content]);

  const handleToggle = useCallback(() => {
    if (favorited) {
      const existing = getFavoriteByContent(content);
      if (existing) {
        removeFavorite(existing.id);
        setFavorited(false);
        toast.success("Removed from favorites");
      }
    } else {
      addFavorite({ content, style, topic });
      setFavorited(true);
      setBouncing(true);
      setTimeout(() => setBouncing(false), 600);
      toast.success("Added to favorites!");
    }
  }, [favorited, content, style, topic]);

  if (!content) return null;

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg transition-all ${
        size === "sm"
          ? "py-1.5 px-3 text-xs"
          : "py-2 px-4 text-sm"
      } ${
        favorited
          ? "bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25"
          : "btn-secondary"
      } ${bouncing ? "favorite-bounce" : ""}`}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={favorited}
    >
      <Star
        className={`${iconSize} transition-all ${
          favorited ? "fill-amber-400 text-amber-400" : ""
        }`}
        aria-hidden="true"
      />
      {size === "sm" ? (favorited ? "Faved" : "Fave") : (favorited ? "Favorited" : "Favorite")}
    </button>
  );
}
