import React from 'react';
import { notFound } from 'next/navigation';
import { ALL_COMPONENTS, getComponentBySlug } from '../../../../registry';
import { ComponentViewer } from '../../../../components/ComponentViewer';
import { DocsSidebar } from '../../../../components/DocsSidebar';

export async function generateStaticParams() {
  return ALL_COMPONENTS.map((comp) => ({
    category: comp.category,
    slug: comp.slug,
  }));
}

export default async function ComponentDetailPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <DocsSidebar />
          <main className="flex-1 min-w-0">
            <ComponentViewer slug={slug} />
          </main>
        </div>
      </div>
    </div>
  );
}
