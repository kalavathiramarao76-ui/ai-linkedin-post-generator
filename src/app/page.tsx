"use client";

import Link from "next/link";
import {
  Sparkles,
  PenLine,
  Lightbulb,
  Hash,
  LayoutTemplate,
  RefreshCw,
  ArrowRight,
  Zap,
  BarChart3,
  Eye,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: PenLine,
    title: "Post Generator",
    description:
      "Enter any topic and get a polished LinkedIn post in your chosen style — thought leadership, storytelling, how-to, and more.",
  },
  {
    icon: Sparkles,
    title: "Post Optimizer",
    description:
      "Paste an existing post and AI rewrites it with better hooks, formatting, CTAs, and hashtags for maximum engagement.",
  },
  {
    icon: Lightbulb,
    title: "Hook Generator",
    description:
      "Generate 10 attention-grabbing opening lines for any topic. The first line decides if people click 'see more'.",
  },
  {
    icon: Hash,
    title: "Hashtag Suggester",
    description:
      "AI suggests relevant hashtags based on your content — a perfect mix of high-reach and niche tags.",
  },
  {
    icon: LayoutTemplate,
    title: "Post Templates",
    description:
      "Pre-built templates for career updates, achievements, insights, questions, and more. Ready to customize.",
  },
  {
    icon: RefreshCw,
    title: "Tone Adjuster",
    description:
      "Rewrite posts in different tones — professional, casual, inspirational, humorous — to match your brand voice.",
  },
];

const stats = [
  { value: "6", label: "Writing Styles" },
  { value: "8+", label: "Post Templates" },
  { value: "3000", label: "Character Tracking" },
  { value: "Free", label: "No Signup" },
];

const examplePost = `I've hired 200+ engineers in 10 years.

Here's the #1 mistake I see in interviews:

Candidates try to prove they're smart.

Instead of showing they can solve problems.

There's a huge difference.

Smart people talk about what they KNOW.
Problem solvers talk about what they've DONE.

Next time you interview, try this:

→ Start with the problem, not the tech stack
→ Explain your decision-making process
→ Share what you'd do differently
→ Ask questions that show you think in systems

The best hire I ever made couldn't solve the algorithm question.

But she asked 3 questions that completely reframed the problem.

That's the difference.

#Hiring #Engineering #CareerAdvice #Interviews`;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Nav */}
      <nav className="fixed top-0 z-50 w-full border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Zap className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              PostCraft
            </span>
          </div>
          <Link href="/app" className="btn-primary !text-sm">
            Open App
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-600/10 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered LinkedIn Content Creation
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
            Write LinkedIn posts
            <br />
            <span className="text-gradient">that go viral</span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Generate high-engagement LinkedIn posts in seconds. Choose your style,
            optimize for engagement, and preview before publishing.
            Free, no signup required.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/app" className="btn-primary !px-8 !py-3 !text-base glow">
              Start Creating
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/app/templates"
              className="btn-secondary !px-6 !py-3 !text-base"
            >
              View Templates
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Post Preview */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">
              See what AI can create
            </h2>
            <p className="text-zinc-400 mt-2">
              Generated in under 10 seconds. Ready to copy-paste.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-2xl overflow-hidden">
              {/* LinkedIn Card Header */}
              <div className="flex items-start gap-3 p-4 pb-2">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  J
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-zinc-100">
                    Jane Smith
                  </p>
                  <p className="text-xs text-zinc-400">VP of Engineering | Tech Leader</p>
                  <p className="text-xs text-zinc-500 mt-0.5">2h ago</p>
                </div>
              </div>

              <div className="px-4 pb-4">
                <p className="text-sm text-zinc-200 whitespace-pre-line leading-relaxed">
                  {examplePost}
                </p>
              </div>

              <div className="px-4 py-2 flex items-center justify-between border-t border-zinc-800 text-xs text-zinc-500">
                <span>2,847 reactions</span>
                <span>198 comments</span>
              </div>
            </div>

            <p className="text-center text-xs text-zinc-600 mt-4">
              Generated with PostCraft AI in the "Thought Leader" style
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6" id="features">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">
              Everything you need to dominate LinkedIn
            </h2>
            <p className="text-zinc-400 mt-3 max-w-xl mx-auto">
              A complete toolkit for creating, optimizing, and managing your
              LinkedIn content strategy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card hover:border-zinc-700 transition-all group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 mb-4 group-hover:bg-indigo-600/20 transition-colors">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-zinc-100">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-zinc-800/50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">
              Three steps to viral content
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: PenLine,
                title: "Enter your topic",
                desc: "Type any topic, idea, or paste an existing post you want to improve.",
              },
              {
                step: "02",
                icon: Sparkles,
                title: "Choose your style",
                desc: "Pick from 6 writing styles and 6 tones. AI crafts the perfect post.",
              },
              {
                step: "03",
                icon: Eye,
                title: "Preview & publish",
                desc: "Preview how it looks on LinkedIn, tweak if needed, copy and publish.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-indigo-400 mb-4">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-indigo-500 mb-2">
                  STEP {item.step}
                </p>
                <h3 className="text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="card !p-12 glow-lg border-indigo-500/20">
            <h2 className="text-3xl font-bold text-white">
              Ready to level up your LinkedIn game?
            </h2>
            <p className="mt-3 text-zinc-400">
              Start creating viral-worthy posts in seconds. No signup, no credit
              card, completely free.
            </p>
            <Link
              href="/app"
              className="btn-primary !px-10 !py-3.5 !text-base mt-8 inline-flex glow"
            >
              Start Creating Now
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-8 px-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-600">
              <Zap className="h-3 w-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-zinc-400">PostCraft AI</span>
          </div>
          <p className="text-xs text-zinc-600">
            Free & open source. Built with Next.js & AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
