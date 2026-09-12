import React from "react";
import Link from "next/link";
import { Sliders, Layers, Terminal, ArrowRight } from "lucide-react";
import { ALL_COMPONENTS } from "../../registry";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Radiant background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent pointer-events-none blur-3xl" />

      {/* Hero */}
      <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-20 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400 mb-8 backdrop-blur-md">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Universal Component Registry & Platform across 13 Ecosystems</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
          Tactile Interactions.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400">
            Universal To Every Ecosystem.
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          One headless architectural engine powering 13 production-grade implementations: React, Next.js 15, Vue 3, Svelte 5, Angular 18+, SolidJS, Astro, Laravel Blade, Raw Vanilla JS, WordPress Gutenberg, Universal Web Components, React Native, and Flutter.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white hover:from-indigo-500 hover:to-violet-500 transition-all shadow-xl shadow-indigo-500/25 active:scale-95"
          >
            <Sliders className="w-4 h-4" />
            <span>Open Studio Workbench</span>
          </Link>
          <Link
            href="/components/cards/stacking-cards"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-all shadow-md"
          >
            <Layers className="w-4 h-4" />
            <span>Browse Components</span>
          </Link>
        </div>

        {/* CLI Quickstart */}
        <div className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/90 px-5 py-3 font-mono text-xs sm:text-sm text-slate-300 shadow-2xl backdrop-blur-md">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <span className="text-slate-500">$</span>
          <span>npx exhuma add stacking-cards</span>
          <span className="text-slate-600">--flavor=nextjs</span>
        </div>
      </section>

      {/* The 13 Ecosystems Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            The 13 Production-Grade Ecosystem Contracts
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Zero code fragmentation. Pure native conventions for your exact stack, from Web to iOS, Android, and Desktop.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { title: "React 18/19", desc: "forwardRef, cn()", badge: "shadcn/ui parity" },
            { title: "Next.js 15", desc: "RSC + Island safe", badge: "App Router" },
            { title: "Vue.js 3 / Nuxt", desc: "Composition API", badge: "<script setup>" },
            { title: "Svelte 5 / SvelteKit", desc: "Runes ($props, $state)", badge: ".svelte native" },
            { title: "Angular 18+", desc: "Standalone + Signals", badge: "input() API" },
            { title: "SolidJS", desc: "Fine-grained reactivity", badge: "createSignal" },
            { title: "Astro", desc: "Zero client JS", badge: ".astro native" },
            { title: "Laravel Blade", desc: "TALL stack ready", badge: "@props" },
            { title: "Vanilla JS & CSS", desc: "destroy() cleanup", badge: "Zero dependencies" },
            { title: "WordPress", desc: "Block API v3 + PHP", badge: "Gutenberg" },
            { title: "Web Components", desc: "<exhuma-*>", badge: "Custom Element v1" },
            { title: "React Native / Expo", desc: "iOS & Android ready", badge: "NativeWind" },
            { title: "Flutter (Dart)", desc: "Canvas / Widget Tree", badge: "Multiplatform" },
          ].map((eco) => (
            <div
              key={eco.title}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 hover:border-indigo-500/40 transition-all group"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {eco.badge}
              </span>
              <h3 className="text-base font-bold text-white mt-3 mb-1">{eco.title}</h3>
              <p className="text-xs text-slate-400">{eco.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Component Catalog Preview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Featured Universal Components
            </h2>
            <p className="text-sm text-slate-400">
              Copy-paste runnable code blocks tested against real compiler suites.
            </p>
          </div>
          <Link
            href="/studio"
            className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Open in Studio Workbench</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ALL_COMPONENTS.map((comp) => (
            <Link
              key={comp.slug}
              href={"/components/" + comp.category + "/" + comp.slug}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-indigo-500/50 hover:bg-slate-900 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 px-2.5 py-0.5 rounded bg-indigo-950/60 border border-indigo-800/40">
                    {comp.category}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">v{comp.version}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
                  {comp.name}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {comp.description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs font-semibold text-slate-400">
                <span>13 flavors ready</span>
                <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                  View &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
