"use client";

import { useState, useEffect } from "react";
import {
  Link2,
  Hash,
  Send,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  getIntegrationsConfig,
  updateDiscordConfig,
  type DiscordConfig,
} from "@/lib/integrations";

export default function DiscordCard() {
  const [config, setConfig] = useState<DiscordConfig>({
    connected: false,
    webhookUrl: "",
    channelName: "",
    autoPost: false,
  });
  const [expanded, setExpanded] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    const cfg = getIntegrationsConfig();
    setConfig(cfg.discord);
  }, []);

  const handleConnect = () => {
    const updated = updateDiscordConfig({ connected: !config.connected });
    setConfig(updated.discord);
  };

  const handleChange = (field: keyof DiscordConfig, value: string | boolean) => {
    const updated = updateDiscordConfig({ [field]: value });
    setConfig(updated.discord);
  };

  const handleTestNotification = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 2500);
  };

  return (
    <div className="glass-card overflow-hidden integration-card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Discord Icon */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5865F2] shadow-lg shadow-[#5865F2]/20">
            <svg width="22" height="16" viewBox="0 0 71 55" fill="white">
              <path d="M60.1 4.9C55.6 2.8 50.7 1.3 45.7.4c-.1 0-.2 0-.2.1-.6 1.1-1.3 2.6-1.8 3.7-5.5-.8-10.9-.8-16.3 0-.5-1.2-1.2-2.6-1.8-3.7-.1-.1-.2-.1-.2-.1C20.3 1.3 15.4 2.8 10.9 4.9c0 0-.1 0-.1.1C1.6 18.7-.9 32.1.3 45.4c0 .1 0 .1.1.2 6.1 4.5 12 7.2 17.7 9 .1 0 .2 0 .2-.1 1.4-1.9 2.6-3.8 3.6-5.9.1-.1 0-.3-.1-.3-2-.7-3.8-1.6-5.6-2.7-.1-.1-.1-.3 0-.4.4-.3.8-.6 1.1-.9.1-.1.1-.1.2 0 11.6 5.3 24.2 5.3 35.7 0 .1 0 .2 0 .2.1.4.3.7.6 1.1.9.1.1.1.3 0 .4-1.8 1-3.6 2-5.6 2.7-.1 0-.2.2-.1.3 1.1 2.1 2.3 4 3.6 5.9.1.1.2.1.3.1 5.8-1.8 11.7-4.5 17.8-9 .1 0 .1-.1.1-.2 1.5-15.4-2.5-28.7-10.5-40.5 0 0 0-.1-.1-.1zM23.7 37.3c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.4 3.2 6.4 7.2 0 4-2.8 7.2-6.4 7.2zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.6 0 6.4 3.2 6.4 7.2 0 4-2.8 7.2-6.4 7.2z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Discord</h3>
            <p className="text-xs text-zinc-500">Send via webhook to any server</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
              config.connected
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-zinc-800 text-zinc-500 border border-zinc-700"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                config.connected ? "bg-emerald-400 presence-pulse" : "bg-zinc-600"
              }`}
            />
            {config.connected ? "Connected" : "Not connected"}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 transition-colors"
            aria-label={expanded ? "Collapse settings" : "Expand settings"}
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Settings */}
      {expanded && (
        <div className="mt-5 space-y-4 border-t border-white/5 pt-5 integration-expand">
          {/* Webhook URL */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Link2 className="h-3.5 w-3.5" />
              Webhook URL
            </label>
            <input
              type="url"
              value={config.webhookUrl}
              onChange={(e) => handleChange("webhookUrl", e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="input-field font-mono text-xs"
            />
          </div>

          {/* Channel Name */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Hash className="h-3.5 w-3.5" />
              Channel Name
            </label>
            <input
              type="text"
              value={config.channelName}
              onChange={(e) => handleChange("channelName", e.target.value)}
              placeholder="e.g. linkedin-posts"
              className="input-field"
            />
          </div>

          {/* Auto-post Toggle */}
          <div className="flex items-center justify-between rounded-lg bg-zinc-900/50 p-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span className="text-sm text-zinc-300">Auto-post generated content</span>
            </div>
            <button
              onClick={() => handleChange("autoPost", !config.autoPost)}
              className="text-zinc-400 hover:text-white transition-colors"
              aria-label={config.autoPost ? "Disable auto-post" : "Enable auto-post"}
            >
              {config.autoPost ? (
                <ToggleRight className="h-7 w-7 text-indigo-400" />
              ) : (
                <ToggleLeft className="h-7 w-7" />
              )}
            </button>
          </div>

          {/* Mock Discord Embed Preview */}
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Embed Preview</p>
            <div className="rounded-lg bg-[#2b2d31] border border-[#3f4147] p-4">
              {/* Discord embed */}
              <div className="flex gap-3">
                {/* Bot avatar */}
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">PostCraft</span>
                    <span className="rounded bg-[#5865F2] px-1 py-0.5 text-[9px] text-white font-bold uppercase">Bot</span>
                    <span className="text-[11px] text-zinc-500">Today at 12:34 PM</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-300">New post is ready!</p>
                  {/* Embed */}
                  <div className="mt-2 rounded border-l-4 border-indigo-500 bg-[#2f3136] p-3">
                    <p className="text-sm font-semibold text-indigo-300">LinkedIn Post Generated</p>
                    <p className="mt-1.5 text-[13px] text-zinc-400 leading-relaxed line-clamp-3">
                      Just shipped a new feature that changes how teams collaborate on content. Here&apos;s what I learned building it from zero to production in 48 hours...
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="h-4 w-4 rounded bg-indigo-500/20 flex items-center justify-center">
                        <Zap className="h-2.5 w-2.5 text-indigo-400" />
                      </div>
                      <span className="text-[11px] text-zinc-500">PostCraft AI</span>
                      <span className="text-[11px] text-zinc-700 mx-1">|</span>
                      <span className="text-[11px] text-zinc-500">
                        #{config.channelName || "linkedin-posts"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleConnect}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                config.connected
                  ? "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                  : "bg-[#5865F2] text-white hover:bg-[#4752C4]"
              }`}
            >
              {config.connected ? (
                <span className="flex items-center justify-center gap-2">
                  <X className="h-4 w-4" /> Disconnect
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" /> Connect Discord
                </span>
              )}
            </button>
            <button
              onClick={handleTestNotification}
              disabled={!config.connected}
              className="btn-secondary flex items-center gap-2 disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
              {testSent ? "Sent!" : "Test"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
