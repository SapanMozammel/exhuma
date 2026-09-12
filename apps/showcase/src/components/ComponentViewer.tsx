'use client';

import React, { useState } from 'react';
import { getComponentBySlug } from '../registry';
import { UniversalComponent, EcosystemFlavor, ECOSYSTEM_LABELS } from '../registry/schema';
import { DeviceFrame } from './DeviceFrame';
import { CodeBlock } from './CodeBlock';
import { Layers, FileCode, Sliders } from 'lucide-react';
import Link from 'next/link';

interface ComponentViewerProps {
  slug: string;
  previewElement?: React.ReactNode;
}

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

export function ComponentViewer({ slug, previewElement }: ComponentViewerProps) {
  const component = getComponentBySlug(slug);
  const [selectedFlavor, setSelectedFlavor] = useState<EcosystemFlavor>('react');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);

  if (!component) return null;

  const files = component.generateCode(selectedFlavor, component.defaultProps);
  const currentFile = files[selectedFileIndex] || files[0];

  return (
    <div className="w-full space-y-8">
      {/* Component Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {component.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
              v{component.version}
            </span>
          </div>
          <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            {component.description}
          </p>
        </div>

        <Link
          href={`/studio?component=${component.slug}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md hover:shadow-indigo-500/25 transition-all self-start md:self-auto active:scale-95"
        >
          <Sliders className="w-4 h-4" />
          <span>Open in Studio</span>
        </Link>
      </div>

      {/* Live Canvas Preview */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span>Interactive Preview</span>
        </div>
        <DeviceFrame>
          {previewElement ? (
            previewElement
          ) : (
            <div className="p-8 text-center text-slate-500 text-sm">
              Live preview rendered inside Studio.
            </div>
          )}
        </DeviceFrame>
      </div>

      {/* 8-Ecosystem Code Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <FileCode className="w-4 h-4 text-violet-500" />
            <span>Universal Implementation Code</span>
          </div>
        </div>

        {/* Ecosystem Tab Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200 dark:border-slate-800">
          {FLAVORS.map((flavor) => {
            const isSelected = selectedFlavor === flavor;
            return (
              <button
                key={flavor}
                onClick={() => {
                  setSelectedFlavor(flavor);
                  setSelectedFileIndex(0);
                }}
                className={`whitespace-nowrap px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {ECOSYSTEM_LABELS[flavor]}
              </button>
            );
          })}
        </div>

        {/* Multi-File Switcher if flavor produces multiple files */}
        {files.length > 1 && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-medium text-slate-500">Files:</span>
            {files.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFileIndex(idx)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  selectedFileIndex === idx
                    ? 'bg-slate-800 text-indigo-400 border border-indigo-500/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                {file.filename}
              </button>
            ))}
          </div>
        )}

        {/* Code Viewer */}
        {currentFile && (
          <CodeBlock
            code={currentFile.code}
            language={currentFile.language}
            filename={currentFile.filename}
          />
        )}
      </div>

      {/* Component Props API Specification */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
          Component API & Props
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-100 dark:bg-slate-900/80 text-xs uppercase font-semibold text-slate-700 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3">Prop</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Default</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950 font-mono text-xs">
              {component.props.map((p) => (
                <tr key={p.name} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                  <td className="px-4 py-3 font-bold text-indigo-600 dark:text-indigo-400">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{p.type}</td>
                  <td className="px-4 py-3 text-amber-600 dark:text-amber-400">
                    {String(p.defaultValue)}
                  </td>
                  <td className="px-4 py-3 font-sans text-slate-600 dark:text-slate-400">
                    {p.description || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
