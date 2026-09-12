'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ALL_COMPONENTS, CATEGORIES } from '../registry';
import { Search, Sliders, Layers, Sparkles, BookOpen } from 'lucide-react';

export function DocsSidebar() {
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  const filteredComponents = ALL_COMPONENTS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-6 md:sticky md:top-20 h-fit py-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter components..."
          className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
        />
      </div>

      {/* Main Navigation */}
      <div className="space-y-1">
        <Link
          href="/studio"
          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            pathname === '/studio'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Studio Workbench</span>
          <span className="ml-auto text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/20 text-white">
            Live
          </span>
        </Link>
      </div>

      {/* Categorized Component List */}
      <div className="space-y-6">
        {CATEGORIES.map((category) => {
          const categoryComponents = filteredComponents.filter((c) => c.category === category.id);
          if (categoryComponents.length === 0) return null;

          return (
            <div key={category.id} className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3">
                {category.label}
              </h4>
              <div className="space-y-0.5">
                {categoryComponents.map((comp) => {
                  const href = `/components/${comp.category}/${comp.slug}`;
                  const isActive = pathname === href;

                  return (
                    <Link
                      key={comp.slug}
                      href={href}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/60 dark:border-indigo-800/60 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <span>{comp.name}</span>
                      <span className="text-[10px] text-slate-400 opacity-60">8 flavors</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
