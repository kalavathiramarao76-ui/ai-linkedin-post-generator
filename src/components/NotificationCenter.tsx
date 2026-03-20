"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  Sparkles,
  Heart,
  LayoutTemplate,
  BarChart3,
  CheckCheck,
  X,
  Zap,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";

interface Notification {
  id: string;
  icon: string;
  title: string;
  time: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = "postcraft-notifications";
const MAX_NOTIFICATIONS = 20;

const ICON_MAP: Record<string, React.ElementType> = {
  sparkles: Sparkles,
  heart: Heart,
  template: LayoutTemplate,
  analytics: BarChart3,
  zap: Zap,
  trending: TrendingUp,
  users: Users,
  star: Star,
};

const ICON_COLOR_MAP: Record<string, string> = {
  sparkles: "text-indigo-400",
  heart: "text-pink-400",
  template: "text-purple-400",
  analytics: "text-emerald-400",
  zap: "text-amber-400",
  trending: "text-cyan-400",
  users: "text-blue-400",
  star: "text-yellow-400",
};

function getDefaultNotifications(): Notification[] {
  const now = Date.now();
  return [
    { id: "1", icon: "sparkles", title: "Post generated successfully", time: "2 min ago", timestamp: now - 2 * 60000, read: false },
    { id: "2", icon: "heart", title: "Sarah favorited your post", time: "15 min ago", timestamp: now - 15 * 60000, read: false },
    { id: "3", icon: "template", title: "New template added: Career Update", time: "1h ago", timestamp: now - 60 * 60000, read: false },
    { id: "4", icon: "analytics", title: "Weekly analytics ready", time: "3h ago", timestamp: now - 3 * 3600000, read: false },
    { id: "5", icon: "zap", title: "Tone adjustment completed", time: "5h ago", timestamp: now - 5 * 3600000, read: true },
    { id: "6", icon: "trending", title: "Your post is trending in Tech", time: "8h ago", timestamp: now - 8 * 3600000, read: true },
    { id: "7", icon: "users", title: "3 new team members joined", time: "1d ago", timestamp: now - 24 * 3600000, read: true },
    { id: "8", icon: "star", title: "You earned the Power Writer badge", time: "2d ago", timestamp: now - 48 * 3600000, read: true },
    { id: "9", icon: "heart", title: "Alex liked your Career Update post", time: "3d ago", timestamp: now - 72 * 3600000, read: true },
    { id: "10", icon: "sparkles", title: "10 posts generated this week!", time: "4d ago", timestamp: now - 96 * 3600000, read: true },
  ];
}

function formatRelativeTime(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Notification[];
        setNotifications(parsed.slice(0, MAX_NOTIFICATIONS));
      } else {
        const defaults = getDefaultNotifications();
        setNotifications(defaults);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      }
    } catch {
      setNotifications(getDefaultNotifications());
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }, [notifications]);

  // Update relative times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, time: formatRelativeTime(n.timestamp) }))
      );
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }, []);

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-1.5 rounded-lg transition-all hover:bg-white/10 ${
          isOpen ? "bg-white/10" : ""
        }`}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell
          className={`h-4.5 w-4.5 text-zinc-400 transition-colors ${
            isOpen ? "text-indigo-400" : "hover:text-zinc-200"
          } ${unreadCount > 0 ? "bell-shake" : ""}`}
        />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div
          ref={panelRef}
          className="notification-panel absolute top-full left-0 mt-2 w-80 rounded-xl border border-white/10 bg-zinc-900/90 backdrop-blur-2xl shadow-2xl shadow-black/40 z-50 overflow-hidden"
          role="dialog"
          aria-label="Notifications"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium text-indigo-400 hover:bg-white/5 transition-colors"
                  aria-label="Mark all notifications as read"
                >
                  <CheckCheck className="h-3 w-3" />
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
                aria-label="Close notifications"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto overscroll-contain">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-zinc-500">
                <Bell className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-xs">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = ICON_MAP[notification.icon] || Sparkles;
                const iconColor = ICON_COLOR_MAP[notification.icon] || "text-indigo-400";

                return (
                  <div
                    key={notification.id}
                    className={`notification-item group flex items-start gap-3 px-4 py-3 border-b border-white/[0.03] hover:bg-white/[0.04] transition-all cursor-pointer ${
                      !notification.read ? "bg-indigo-500/[0.04]" : ""
                    }`}
                    onClick={() => toggleRead(notification.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${notification.read ? "Read" : "Unread"}: ${notification.title}, ${notification.time}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleRead(notification.id);
                      }
                    }}
                  >
                    {/* Icon */}
                    <div className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${!notification.read ? "text-zinc-200 font-medium" : "text-zinc-400"}`}>
                        {notification.title}
                      </p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">
                        {notification.time}
                      </p>
                    </div>

                    {/* Unread dot + dismiss */}
                    <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
                      {!notification.read && (
                        <span className="h-2 w-2 rounded-full bg-indigo-500 flex-shrink-0" aria-hidden="true" />
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismissNotification(notification.id);
                        }}
                        className="p-0.5 rounded text-zinc-600 opacity-0 group-hover:opacity-100 hover:text-zinc-300 transition-all"
                        aria-label={`Dismiss notification: ${notification.title}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
