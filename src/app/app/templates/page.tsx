"use client";

import { useState } from "react";
import { TEMPLATES } from "@/lib/constants";
import { Copy, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function TemplatesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(TEMPLATES.map((t) => t.category))),
  ];

  const filtered =
    filterCategory === "All"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === filterCategory);

  const handleCopy = async (id: string, template: string) => {
    try {
      await navigator.clipboard.writeText(template);
      setCopiedId(id);
      toast.success("Template copied!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Post Templates</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Ready-to-use templates for common LinkedIn post types. Copy, customize,
            and publish.
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`pill ${
              filterCategory === cat ? "pill-active" : "pill-inactive"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((template) => (
          <div
            key={template.id}
            className="card group hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  {template.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {template.description}
                </p>
              </div>
              <span className="pill pill-inactive !text-[10px]">
                {template.category}
              </span>
            </div>

            <div className="rounded-lg bg-zinc-800/50 p-4 mb-4">
              <pre className="whitespace-pre-wrap text-xs text-zinc-400 leading-relaxed font-sans max-h-[200px] overflow-y-auto">
                {template.template}
              </pre>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy(template.id, template.template)}
                className="btn-secondary !py-1.5 !px-3 !text-xs"
              >
                {copiedId === template.id ? (
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedId === template.id ? "Copied!" : "Copy Template"}
              </button>

              <Link
                href="/app"
                className="btn-primary !py-1.5 !px-3 !text-xs"
              >
                Customize with AI
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
