"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, Search, Trash2, Copy, Check, Filter } from "lucide-react";
import { toast } from "sonner";
import { getFavorites, removeFavorite, FavoritePost } from "@/lib/favorites";
import { POST_STYLES } from "@/lib/constants";
import ShareButton from "@/components/ShareButton";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [search, setSearch] = useState("");
  const [styleFilter, setStyleFilter] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadFavorites = useCallback(() => {
    setFavorites(getFavorites());
  }, []);

  useEffect(() => {
    loadFavorites();
    window.addEventListener("favorites-changed", loadFavorites);
    return () => window.removeEventListener("favorites-changed", loadFavorites);
  }, [loadFavorites]);

  const handleDelete = useCallback((id: string) => {
    removeFavorite(id);
    toast.success("Removed from favorites");
  }, []);

  const handleCopy = useCallback(async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  }, []);

  const filtered = favorites.filter((fav) => {
    const matchesSearch =
      !search ||
      fav.content.toLowerCase().includes(search.toLowerCase()) ||
      fav.topic.toLowerCase().includes(search.toLowerCase());
    const matchesStyle = styleFilter === "all" || fav.style === styleFilter;
    return matchesSearch && matchesStyle;
  });

  const uniqueStyles = Array.from(new Set(favorites.map((f) => f.style)));

  return (
    <div className="space-y-6 page-transition" role="main">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Star className="h-6 w-6 text-amber-400 fill-amber-400" aria-hidden="true" />
          Favorites
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Your starred posts — {favorites.length} saved
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search favorites..."
            className="input-field !pl-10"
            aria-label="Search favorites"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" aria-hidden="true" />
          <select
            value={styleFilter}
            onChange={(e) => setStyleFilter(e.target.value)}
            className="input-field !pl-10 !pr-8 appearance-none cursor-pointer min-w-[160px]"
            aria-label="Filter by style"
          >
            <option value="all">All Styles</option>
            {uniqueStyles.map((s) => {
              const styleInfo = POST_STYLES.find((ps) => ps.id === s);
              return (
                <option key={s} value={s}>
                  {styleInfo ? styleInfo.label : s}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Favorites List */}
      {filtered.length === 0 ? (
        <div className="card text-center py-16">
          <Star className="h-12 w-12 text-zinc-700 mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-zinc-400 mb-2">
            {favorites.length === 0 ? "No favorites yet" : "No matches found"}
          </h3>
          <p className="text-sm text-zinc-600">
            {favorites.length === 0
              ? "Star a generated post to save it here for quick access."
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((fav) => {
            const styleInfo = POST_STYLES.find((ps) => ps.id === fav.style);
            const isCopied = copiedId === fav.id;

            return (
              <div
                key={fav.id}
                className="card group hover:border-amber-500/20 transition-colors"
                role="article"
                aria-label={`Favorited post about ${fav.topic}`}
              >
                {/* Meta */}
                <div className="flex items-center gap-2 mb-3 text-xs text-zinc-500 flex-wrap">
                  {styleInfo && (
                    <span className="pill pill-inactive">
                      {styleInfo.emoji} {styleInfo.label}
                    </span>
                  )}
                  {fav.topic && (
                    <span className="text-zinc-600 truncate max-w-[200px]">
                      {fav.topic}
                    </span>
                  )}
                  <span className="ml-auto text-zinc-700">
                    {new Date(fav.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Content */}
                <div className="whitespace-pre-line text-sm leading-relaxed text-zinc-200">
                  {fav.content.length > 400
                    ? fav.content.slice(0, 400) + "..."
                    : fav.content}
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-2 pt-3 border-t border-zinc-800" role="group" aria-label="Favorite post actions">
                  <button
                    onClick={() => handleCopy(fav.id, fav.content)}
                    className="btn-secondary !py-1.5 !px-3 !text-xs"
                    aria-label={isCopied ? "Copied" : "Copy post"}
                  >
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {isCopied ? "Copied!" : "Copy"}
                  </button>

                  <ShareButton content={fav.content} size="sm" />

                  <button
                    onClick={() => handleDelete(fav.id)}
                    className="btn-secondary !py-1.5 !px-3 !text-xs ml-auto hover:!border-red-800 hover:!text-red-400"
                    aria-label="Remove from favorites"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
