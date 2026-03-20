"use client";

import { useState, useEffect } from "react";
import {
  Hash,
  Bot,
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
  updateSlackConfig,
  type SlackConfig,
} from "@/lib/integrations";

export default function SlackCard() {
  const [config, setConfig] = useState<SlackConfig>({
    connected: false,
    channelName: "",
    botName: "PostCraft Bot",
    autoPost: false,
  });
  const [expanded, setExpanded] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    const cfg = getIntegrationsConfig();
    setConfig(cfg.slack);
  }, []);

  const handleConnect = () => {
    const updated = updateSlackConfig({ connected: !config.connected });
    setConfig(updated.slack);
  };

  const handleChange = (field: keyof SlackConfig, value: string | boolean) => {
    const updated = updateSlackConfig({ [field]: value });
    setConfig(updated.slack);
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
          {/* Slack Icon */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#E01E5A] via-[#ECB22E] to-[#2EB67D] shadow-lg shadow-[#E01E5A]/20">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
              <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.27 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.163 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.163 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.163 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.27a2.527 2.527 0 0 1-2.52-2.523 2.527 2.527 0 0 1 2.52-2.52h6.315A2.528 2.528 0 0 1 24 15.163a2.528 2.528 0 0 1-2.522 2.523h-6.315z"/>
            </svg>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Slack</h3>
            <p className="text-xs text-zinc-500">Post to channels automatically</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Badge */}
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
          {/* Expand */}
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
              placeholder="e.g. marketing-posts"
              className="input-field"
            />
          </div>

          {/* Bot Name */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Bot className="h-3.5 w-3.5" />
              Bot Name
            </label>
            <input
              type="text"
              value={config.botName}
              onChange={(e) => handleChange("botName", e.target.value)}
              placeholder="PostCraft Bot"
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

          {/* Mock Slack Message Preview */}
          <div>
            <p className="mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">Message Preview</p>
            <div className="rounded-lg bg-[#1a1d21] border border-[#2c2d30] p-4">
              {/* Slack message layout */}
              <div className="flex gap-3">
                {/* Bot avatar */}
                <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">
                      {config.botName || "PostCraft Bot"}
                    </span>
                    <span className="rounded bg-[#2c2d30] px-1 py-0.5 text-[10px] text-zinc-500 font-medium">APP</span>
                    <span className="text-[11px] text-zinc-600">12:34 PM</span>
                  </div>
                  <p className="mt-1 text-sm text-zinc-300">
                    New LinkedIn post generated and ready to publish!
                  </p>
                  {/* Attachment bar */}
                  <div className="mt-2 rounded border-l-[3px] border-indigo-500 bg-[#222529] p-3">
                    <p className="text-xs font-semibold text-indigo-400">LinkedIn Post Ready</p>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                      Just shipped a new feature that changes how teams collaborate on content. Here&apos;s what I learned building it...
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-[10px] text-zinc-600">
                        #{config.channelName || "marketing-posts"}
                      </span>
                      <span className="text-[10px] text-zinc-700">|</span>
                      <span className="text-[10px] text-zinc-600">via PostCraft</span>
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
                  : "bg-indigo-600 text-white hover:bg-indigo-500"
              }`}
            >
              {config.connected ? (
                <span className="flex items-center justify-center gap-2">
                  <X className="h-4 w-4" /> Disconnect
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" /> Connect Slack
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
