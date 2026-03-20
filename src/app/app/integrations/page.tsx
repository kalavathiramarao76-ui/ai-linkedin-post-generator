"use client";

import { useState } from "react";
import { Plug, ArrowRight, Clock, Mail, Check, Sparkles } from "lucide-react";
import SlackCard from "@/components/integrations/SlackCard";
import DiscordCard from "@/components/integrations/DiscordCard";
import { updateZapierConfig, getIntegrationsConfig } from "@/lib/integrations";

export default function IntegrationsPage() {
  const [zapierEmail, setZapierEmail] = useState("");
  const [zapierJoined, setZapierJoined] = useState(() => {
    if (typeof window === "undefined") return false;
    return getIntegrationsConfig().zapier.joined;
  });

  const handleZapierJoin = () => {
    if (!zapierEmail || !zapierEmail.includes("@")) return;
    updateZapierConfig({ waitlistEmail: zapierEmail, joined: true });
    setZapierJoined(true);
  };

  return (
    <div className="page-transition space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 border border-indigo-500/20">
            <Plug className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Integrations</h1>
            <p className="text-sm text-zinc-500">Connect your favorite tools and automate your workflow</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Available", value: "2", sub: "integrations" },
          { label: "Coming Soon", value: "1", sub: "in development" },
          { label: "Auto-posts", value: "0", sub: "this month" },
        ].map((stat) => (
          <div key={stat.label} className="glass-card text-center py-4">
            <p className="text-2xl font-bold text-gradient">{stat.value}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{stat.label}</p>
            <p className="text-[10px] text-zinc-600">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Integration Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          Active Integrations
        </h2>

        {/* Slack */}
        <SlackCard />

        {/* Discord */}
        <DiscordCard />
      </div>

      {/* Zapier Coming Soon */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-amber-400" />
          Coming Soon
        </h2>

        <div className="glass-card relative overflow-hidden integration-card">
          {/* Coming soon ribbon */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[11px] font-medium text-amber-400">
              <Clock className="h-3 w-3" />
              Coming Soon
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            {/* Zapier logo placeholder */}
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF4A00] to-[#FF7A00] shadow-lg shadow-[#FF4A00]/20">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M15.535 8.465l-3.535 3.535-3.535-3.535-1.415 1.415 3.535 3.535-3.535 3.535 1.415 1.415 3.535-3.535 3.535 3.535 1.415-1.415-3.535-3.535 3.535-3.535-1.415-1.415z"/>
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" opacity="0.3"/>
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Zapier</h3>
              <p className="text-xs text-zinc-500">Connect 5,000+ apps to your workflow</p>
            </div>
          </div>

          <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
            Automate your LinkedIn content pipeline by connecting PostCraft to thousands of apps through Zapier.
            Trigger post generation from CRM events, schedule drafts, and more.
          </p>

          {/* Feature preview list */}
          <div className="mb-5 space-y-2">
            {[
              "Trigger post generation from any Zapier event",
              "Auto-schedule posts to LinkedIn via Buffer/Hootsuite",
              "Sync generated content to Google Sheets/Notion",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-xs text-zinc-500">
                <ArrowRight className="h-3 w-3 text-amber-500/60 flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>

          {/* Waitlist */}
          {zapierJoined ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3">
              <Check className="h-4 w-4 text-emerald-400" />
              <span className="text-sm text-emerald-400 font-medium">
                You&apos;re on the waitlist! We&apos;ll notify you when Zapier is ready.
              </span>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
                <input
                  type="email"
                  value={zapierEmail}
                  onChange={(e) => setZapierEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field pl-10"
                  onKeyDown={(e) => e.key === "Enter" && handleZapierJoin()}
                />
              </div>
              <button
                onClick={handleZapierJoin}
                disabled={!zapierEmail || !zapierEmail.includes("@")}
                className="btn-primary whitespace-nowrap disabled:opacity-40"
              >
                Join Waitlist
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="text-center py-4">
        <p className="text-xs text-zinc-700">
          Integrations store configuration locally. No data is sent to external services in this demo.
        </p>
      </div>
    </div>
  );
}
