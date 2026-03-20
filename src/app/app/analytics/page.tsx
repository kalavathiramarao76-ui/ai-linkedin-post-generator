"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Type,
  BarChart3,
  Zap,
  RotateCcw,
} from "lucide-react";
import { getAnalytics, resetAnalytics } from "@/lib/analytics";
import type { AnalyticsData } from "@/lib/analytics";
import StatCard from "@/components/analytics/StatCard";
import DonutChart from "@/components/analytics/DonutChart";
import BarChart from "@/components/analytics/BarChart";
import StreakIndicator from "@/components/analytics/StreakIndicator";

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    setData(getAnalytics());
  }, []);

  const handleReset = () => {
    resetAnalytics();
    setData(getAnalytics());
    setShowResetConfirm(false);
  };

  if (!data) return null;

  const isEmpty = data.totalPosts === 0;

  return (
    <div className="space-y-6 page-transition">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Track your content creation activity and trends
          </p>
        </div>

        {!isEmpty && (
          <div className="relative">
            {showResetConfirm ? (
              <div className="flex items-center gap-2 glass-card !p-3 !rounded-lg">
                <span className="text-xs text-zinc-400">Are you sure?</span>
                <button
                  onClick={handleReset}
                  className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded bg-red-500/10"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="btn-secondary !py-1.5 !px-3 !text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Analytics
              </button>
            )}
          </div>
        )}
      </div>

      {isEmpty ? (
        /* Empty State */
        <div className="glass-card !p-16 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400">
              <BarChart3 className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-zinc-200">
            No analytics yet
          </h2>
          <p className="mt-2 text-sm text-zinc-500 max-w-md mx-auto">
            Start generating posts to see your analytics! Every post, hook,
            and hashtag suggestion is tracked here.
          </p>
        </div>
      ) : (
        <>
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard
              label="Total Posts Generated"
              value={data.totalPosts}
              icon={<FileText className="h-5 w-5" />}
              color="indigo"
              delay={0}
            />
            <StatCard
              label="Total Words"
              value={data.totalWords}
              icon={<Type className="h-5 w-5" />}
              color="emerald"
              delay={100}
            />
            <StatCard
              label="Avg Post Length"
              value={data.averagePostLength}
              suffix="words"
              icon={<BarChart3 className="h-5 w-5" />}
              color="purple"
              delay={200}
            />
            <StreakIndicator streak={data.streak} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DonutChart
              data={data.styleBreakdown}
              title="Posts by Style"
            />
            <DonutChart
              data={data.featureBreakdown}
              title="Feature Usage"
            />
          </div>

          {/* Daily Activity */}
          <BarChart
            data={data.dailyHistory}
            title="Daily Activity — Last 7 Days"
          />
        </>
      )}
    </div>
  );
}
