"use client";

import { useState, useEffect, useCallback } from "react";
import { WifiOff, RefreshCw, AlertCircle, Lightbulb } from "lucide-react";

interface ApiErrorFallbackProps {
  error: string;
  onRetry: () => void;
  autoRetrySeconds?: number;
}

export default function ApiErrorFallback({
  error,
  onRetry,
  autoRetrySeconds = 10,
}: ApiErrorFallbackProps) {
  const [countdown, setCountdown] = useState(autoRetrySeconds);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    setCountdown(autoRetrySeconds);
  }, [error, autoRetrySeconds]);

  useEffect(() => {
    if (countdown <= 0) {
      handleRetry();
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  const handleRetry = useCallback(() => {
    setIsRetrying(true);
    setCountdown(autoRetrySeconds);
    onRetry();
    setTimeout(() => setIsRetrying(false), 1500);
  }, [onRetry, autoRetrySeconds]);

  const suggestions = [
    "Check your internet connection",
    "Try a simpler or shorter prompt",
    "Wait a moment and try again",
  ];

  return (
    <div
      className="relative rounded-2xl backdrop-blur-xl overflow-hidden"
      style={{
        background: "rgba(255, 255, 255, 0.04)",
        border: "1px solid rgba(239, 68, 68, 0.12)",
        boxShadow: "0 8px 32px rgba(239, 68, 68, 0.04)",
      }}
      role="alert"
      aria-live="assertive"
    >
      {/* Subtle accent */}
      <div className="h-0.5 w-full bg-gradient-to-r from-red-500/40 via-amber-500/30 to-transparent" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/15 flex-shrink-0">
            <WifiOff className="h-4 w-4 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-zinc-200">
              AI service temporarily unavailable
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">{error}</p>
          </div>
        </div>

        {/* Suggestions */}
        <div className="rounded-lg bg-zinc-900/50 border border-zinc-800/50 p-3 mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb className="h-3 w-3 text-amber-400" />
            <span className="text-[11px] font-medium text-zinc-400">
              Suggestions
            </span>
          </div>
          <ul className="space-y-1">
            {suggestions.map((s) => (
              <li
                key={s}
                className="flex items-center gap-2 text-xs text-zinc-500"
              >
                <AlertCircle className="h-3 w-3 flex-shrink-0 text-zinc-600" />
                {s}
              </li>
            ))}
          </ul>
        </div>

        {/* Retry bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="btn-secondary !py-2 !px-4 !text-xs flex-shrink-0"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`}
            />
            Retry Now
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-zinc-600">Auto-retry in</span>
              <span className="text-[10px] font-mono text-zinc-400">
                {countdown}s
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 transition-all duration-1000 ease-linear"
                style={{
                  width: `${((autoRetrySeconds - countdown) / autoRetrySeconds) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
