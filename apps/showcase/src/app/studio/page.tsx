import React, { Suspense } from 'react';
import { StudioWorkbench } from '../../components/StudioWorkbench';
import { DocsSidebar } from '../../components/DocsSidebar';

export const metadata = {
  title: 'Studio Workbench — Exhuma',
  description: 'Visual prop customizer and real-time multi-ecosystem code synthesizer for Exhuma components.',
};

export default function StudioPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <DocsSidebar />
          <main className="flex-1 min-w-0">
            <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Studio...</div>}>
              <StudioWorkbench />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
