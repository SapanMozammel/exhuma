'use client';

import React, { useState } from 'react';
import { ALL_COMPONENTS, COMPONENT_REGISTRY, EcosystemFlavor, ECOSYSTEM_LABELS } from '../registry';
import { DeviceFrame } from './DeviceFrame';
import { CodeBlock } from './CodeBlock';
import { Sliders, Sparkles, RefreshCw, Layers } from 'lucide-react';

const FLAVORS: EcosystemFlavor[] = [
  'react',
  'nextjs',
  'vue',
  'svelte',
  'angular',
  'solid',
  'astro',
  'blade',
  'vanilla',
  'wordpress',
  'webcomponent',
  'react-native',
  'flutter',
];

export function StudioWorkbench({ initialSlug = 'stacking-cards' }: { initialSlug?: string }) {
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const component = COMPONENT_REGISTRY[selectedSlug] || ALL_COMPONENTS[0];

  // Dynamic prop state
  const [propValues, setPropValues] = useState<Record<string, unknown>>(() => ({
    ...component.defaultProps,
  }));

  const [selectedFlavor, setSelectedFlavor] = useState<EcosystemFlavor>('react');
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);

  // Switch component
  const handleSelectComponent = (slug: string) => {
    setSelectedSlug(slug);
    const newComp = COMPONENT_REGISTRY[slug];
    if (newComp) {
      setPropValues({ ...newComp.defaultProps });
    }
  };

  const handlePropChange = (name: string, value: unknown) => {
    setPropValues((prev) => ({ ...prev, [name]: value }));
  };

  const resetProps = () => {
    setPropValues({ ...component.defaultProps });
  };

  // Re-synthesize code in real-time
  const generatedFiles = component.generateCode(selectedFlavor, propValues);
  const activeFile = generatedFiles[selectedFileIdx] || generatedFiles[0];

  return (
    <div className="w-full space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-500 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Studio Workbench</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Live Component Workbench
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Customize layout props visually. Watch code re-synthesize across all 8 ecosystems in real time.
          </p>
        </div>

        {/* Component Selector Dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="component-select" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Component:
          </label>
          <select
            id="component-select"
            value={selectedSlug}
            onChange={(e) => handleSelectComponent(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {ALL_COMPONENTS.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid: Canvas on Left / Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Device Frame Canvas */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>Live Visual Canvas</span>
            </div>
            <span className="text-[11px] text-emerald-500 font-semibold">60 FPS Hardware Accelerated</span>
          </div>

          <DeviceFrame>
            {/* Live Interactive Rendering according to selected component and props */}
            {selectedSlug === 'stacking-cards' && (
              <div className="w-full max-w-2xl mx-auto py-8 px-4">
                {Array.from({ length: Number(propValues.cardCount ?? 4) }).map((_, idx) => {
                  const cardGap = Number(propValues.cardGap ?? 24);
                  const scaleDecay = Number(propValues.scaleDecay ?? 0.04);
                  const count = Number(propValues.cardCount ?? 4);
                  const scale = 1 - (count - 1 - idx) * scaleDecay;

                  return (
                    <div
                      key={idx}
                      className="sticky rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 shadow-xl mb-6 transition-all duration-300"
                      style={{
                        top: `calc(8vh + ${idx * cardGap}px)`,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top center',
                      }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                        Card #{idx + 1}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2 mb-1">
                        Stack Level {idx + 1}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Dynamic sticky offset: {idx * cardGap}px | Scale depth: {scale.toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedSlug === 'horizontal-scroller' && (
              <div className="w-full py-8 px-4">
                <div
                  className="flex overflow-x-auto scroll-smooth py-4 scrollbar-none"
                  style={{ gap: `${Number(propValues.itemGap ?? 20)}px` }}
                >
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-56 shrink-0 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-md"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs mb-3">
                        {idx + 1}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        Rail Item {idx + 1}
                      </h4>
                      <p className="text-xs text-slate-500">Horizontal translation demo</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSlug === 'css-masonry' && (
              <div className="w-full py-8 px-4">
                <div
                  style={{
                    columnCount: Number(propValues.columns ?? 3),
                    columnGap: `${Number(propValues.gap ?? 16)}px`,
                  }}
                >
                  {[120, 180, 100, 220, 140, 160].map((h, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
                      style={{
                        height: `${h}px`,
                        breakInside: 'avoid',
                        marginBottom: `${Number(propValues.gap ?? 16)}px`,
                      }}
                    >
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Item {idx + 1} ({h}px)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSlug === 'auto-grid' && (
              <div className="w-full py-8 px-4">
                <div
                  className="grid w-full"
                  style={{
                    gridTemplateColumns: `repeat(auto-fit, minmax(${Number(propValues.minItemWidth ?? 280)}px, 1fr))`,
                    gap: `${Number(propValues.gap ?? 24)}px`,
                  }}
                >
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm"
                    >
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                        Auto Column {idx + 1}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Min width: {Number(propValues.minItemWidth ?? 280)}px
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedSlug === 'tilt-card' && (
              <div className="w-full flex items-center justify-center py-16 px-4">
                <div
                  className="w-80 h-96 rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-slate-900 p-8 shadow-2xl flex flex-col justify-between"
                  style={{
                    transform: `perspective(${Number(propValues.perspective ?? 1000)}px) rotateX(8deg) rotateY(-12deg)`,
                  }}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                    Interactive 3D Tilt
                  </span>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                      Tactile 3D
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Perspective: {Number(propValues.perspective ?? 1000)}px | Max Tilt: {Number(propValues.maxTilt ?? 15)}°
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DeviceFrame>
        </div>

        {/* Right: Prop Inspector & Controls */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Prop Inspector
              </h3>
            </div>
            <button
              onClick={resetProps}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Reset default values"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Dynamic Prop Controls */}
          <div className="space-y-5">
            {component.props.map((p) => {
              const currentVal = propValues[p.name] ?? p.defaultValue;

              if (p.type === 'number') {
                return (
                  <div key={p.name} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {p.label}
                      </label>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400">
                        {String(currentVal)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={p.min}
                      max={p.max}
                      step={p.step}
                      value={Number(currentVal)}
                      onChange={(e) => handlePropChange(p.name, parseFloat(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    {p.description && (
                      <p className="text-[11px] text-slate-400 leading-normal">{p.description}</p>
                    )}
                  </div>
                );
              }

              if (p.type === 'boolean') {
                return (
                  <div key={p.name} className="flex items-center justify-between py-1">
                    <div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {p.label}
                      </span>
                      {p.description && (
                        <p className="text-[11px] text-slate-400">{p.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePropChange(p.name, !currentVal)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                        currentVal ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out mt-0.5 ml-0.5 ${
                          currentVal ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              }

              return null;
            })}
          </div>
        </div>
      </div>

      {/* Bottom: Real-Time Multi-Ecosystem Code Synchronizer */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Dynamic Code Synchronizer
            </h3>
            <p className="text-xs text-slate-500">
              Live code synthesized with your customized props across all 8 ecosystems.
            </p>
          </div>
        </div>

        {/* 8 Flavor Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {FLAVORS.map((flavor) => (
            <button
              key={flavor}
              onClick={() => {
                setSelectedFlavor(flavor);
                setSelectedFileIdx(0);
              }}
              className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedFlavor === flavor
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {ECOSYSTEM_LABELS[flavor]}
            </button>
          ))}
        </div>

        {/* Files Switcher */}
        {generatedFiles.length > 1 && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-medium text-slate-500">Files:</span>
            {generatedFiles.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFileIdx(idx)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedFileIdx === idx
                    ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                {file.filename}
              </button>
            ))}
          </div>
        )}

        {/* Live Code Block */}
        {activeFile && (
          <CodeBlock
            code={activeFile.code}
            language={activeFile.language}
            filename={activeFile.filename}
          />
        )}
      </div>
    </div>
  );
}
