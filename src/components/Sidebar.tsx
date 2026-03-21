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
  Plug,
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
  { href: "/app/integrations", label: "Integrations", icon: Plug, description: "Slack, Discord & more" },
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
      className="fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-[#0a0a0c]/95 backdrop-blur-2xl border-r border-white/[0.04]"
      role="complementary"
      aria-label="Sidebar navigation"
    >
      {/* Logo + Notifications */}
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600" aria-hidden="true">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-white tracking-tight">PostCraft</h1>
            <p className="text-[10px] text-blue-400 font-medium tracking-wider uppercase">AI Studio</p>
          </div>
        </div>
        <NotificationCenter />
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-white/[0.04]" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5" role="navigation" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              aria-label={`${item.label}: ${item.description}`}
              className={`group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-300"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                  isActive ? "text-blue-400" : "text-zinc-600 group-hover:text-zinc-400"
                } ${item.label === "Favorites" && isActive ? "fill-amber-400 text-amber-400" : ""}`}
                aria-hidden="true"
              />
              <span className="flex-1">{item.label}</span>
              {"hasBadge" in item && item.hasBadge && favCount > 0 && (
                <span className="inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-amber-500/15 px-1.5 text-[10px] font-bold text-amber-400">
                  {favCount > 99 ? "99+" : favCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-5 space-y-3">
        {/* Collaboration Presence */}
        <div className="px-1">
          <CollabPresence />
        </div>

        <div className="mx-1 border-t border-white/[0.04]" />

        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-[13px] text-zinc-600 hover:text-zinc-400 transition-colors"
          aria-label="Back to home page"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Back to Home
        </Link>
        <div className="px-3.5 text-[10px] text-zinc-800">
          Free & Open Source
        </div>
      </div>
    </aside>
  );
}
