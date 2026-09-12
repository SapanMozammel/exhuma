'use client';

import React, { useState } from 'react';
import { Laptop, Tablet, Smartphone, RotateCcw } from 'lucide-react';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

interface DeviceFrameProps {
  children: React.ReactNode;
  initialMode?: ViewportMode;
  className?: string;
}

export function DeviceFrame({ children, initialMode = 'desktop', className = '' }: DeviceFrameProps) {
  const [mode, setMode] = useState<ViewportMode>(initialMode);
  const [key, setKey] = useState(0);

  const resetFrame = () => {
    setKey((prev) => prev + 1);
  };

  const getFrameWidth = () => {
    switch (mode) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'max-w-full';
    }
  };

  return (
    <div className={`w-full flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden shadow-lg ${className}`}>
      {/* Device Toolbar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2.5">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === 'desktop'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setMode('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === 'tablet'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet (768px)</span>
          </button>
          <button
            onClick={() => setMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === 'mobile'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile (375px)</span>
          </button>
        </div>

        <button
          onClick={resetFrame}
          className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          title="Reset component state"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Frame Canvas */}
      <div className="flex-1 w-full flex items-center justify-center p-4 md:p-8 bg-grid-pattern overflow-x-auto min-h-[420px]">
        <div
          key={key}
          className={`w-full ${getFrameWidth()} transition-all duration-300 ease-in-out ${
            mode !== 'desktop'
              ? 'rounded-3xl border-4 border-slate-300 dark:border-slate-800 shadow-2xl overflow-hidden bg-white dark:bg-slate-900'
              : ''
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
