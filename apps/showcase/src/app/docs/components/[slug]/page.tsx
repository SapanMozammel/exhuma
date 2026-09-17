import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ALL_COMPONENTS, COMPONENT_REGISTRY } from '@/registry';
import { ComponentDocView } from '@/components/showcase/ComponentDocView';
import { DocsToc } from '@/components/layout/DocsToc';
import type { Metadata } from 'next';

interface ComponentPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return ALL_COMPONENTS.map((comp) => ({
		slug: comp.slug,
	}));
}

export async function generateMetadata({ params }: ComponentPageProps): Promise<Metadata> {
	const { slug } = await params;
	const comp = COMPONENT_REGISTRY[slug];
	if (!comp) return { title: 'Component Not Found | Exhuma' };

	return {
		title: `${comp.name} — Exhuma Component Architecture`,
		description: comp.description,
	};
}

const tocItems = [
	{ id: 'interactive-stage', title: 'Interactive Specification' },
	{ id: 'props-api', title: 'Props & Configuration' },
	{ id: 'lifecycle-safety', title: 'Lifecycle Safety' },
	{ id: 'accessibility', title: 'Accessibility (a11y)' },
];

export default async function ComponentDocPage({ params }: ComponentPageProps) {
	const { slug } = await params;
	const component = COMPONENT_REGISTRY[slug];

	if (!component) {
		notFound();
	}

	return (
		<div className='flex gap-10'>
			<div className='max-w-4xl min-w-0 flex-1'>
				{/* Breadcrumb */}
				<div className='text-muted-foreground mb-4 flex items-center gap-2 font-mono text-xs'>
					<Link href='/docs' className='hover:text-foreground transition-colors'>
						Documentation
					</Link>
					<span>/</span>
					<Link href='/docs/components' className='hover:text-foreground transition-colors'>
						Components
					</Link>
					<span>/</span>
					<span className='text-foreground font-semibold'>{component.name}</span>
				</div>

				{/* Component Doc View */}
				<ComponentDocView slug={slug} />
			</div>

			{/* On-This-Page Table of Contents */}
			<DocsToc items={tocItems} />
		</div>
	);
}
