"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  PenLine,
  Sparkles,
  LayoutTemplate,
  Zap,
  Home,
  BarChart3,
  Star,
} from "lucide-react";
import NotificationCenter from "./NotificationCenter";
import CollabPresence from "./CollabPresence";
import { getFavoritesCount } from "@/lib/favorites";

const navItems = [
  { href: "/app", label: "Generate", icon: PenLine, description: "Create new posts" },
  { href: "/app/optimize", label: "Optimize", icon: Sparkles, description: "Improve existing posts" },
  { href: "/app/templates", label: "Templates", icon: LayoutTemplate, description: "Post templates" },
  { href: "/app/favorites", label: "Favorites", icon: Star, description: "Starred posts", hasBadge: true },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3, description: "Usage insights" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [favCount, setFavCount] = useState(0);

  const refreshCount = useCallback(() => {
    setFavCount(getFavoritesCount());
  }, []);

  useEffect(() => {
    refreshCount();
    window.addEventListener("favorites-changed", refreshCount);
    return () => window.removeEventListener("favorites-changed", refreshCount);
  }, [refreshCount]);

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col border-r border-white/5 bg-zinc-950/80 backdrop-blur-2xl"
      role="complementary"
      aria-label="Sidebar navigation"
    >
      {/* Logo + Notifications */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600" aria-hidden="true">
            <Zap className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">PostCraft</h1>
            <p className="text-[10px] text-indigo-400 font-medium -mt-0.5">AI-Powered</p>
          </div>
        </div>
        <NotificationCenter />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={`${item.label}: ${item.description}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent"
              }`}
            >
              <Icon
                className={`h-4.5 w-4.5 flex-shrink-0 ${
                  item.label === "Favorites" && isActive ? "fill-amber-400 text-amber-400" : ""
                }`}
                aria-hidden="true"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p>{item.label}</p>
                  {"hasBadge" in item && item.hasBadge && favCount > 0 && (
                    <span className="inline-flex items-center justify-center h-4.5 min-w-[18px] rounded-full bg-amber-500/20 border border-amber-500/30 px-1.5 text-[10px] font-bold text-amber-400 notification-badge">
                      {favCount > 99 ? "99+" : favCount}
                    </span>
                  )}
                </div>
                <p className={`text-[10px] mt-0.5 ${isActive ? "text-indigo-400/70" : "text-zinc-600"}`}>
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-zinc-800 p-4 space-y-3">
        {/* Collaboration Presence */}
        <div className="px-1">
          <CollabPresence />
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          aria-label="Back to home page"
        >
          <Home className="h-3.5 w-3.5" aria-hidden="true" />
          Back to Home
        </Link>
        <div className="mt-2 px-3 text-[10px] text-zinc-700">
          Free & Open Source
        </div>
      </div>
    </aside>
  );
}
