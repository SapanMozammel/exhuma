import React, { Suspense } from 'react';
import { StudioWorkbench } from '@/components/showcase/StudioWorkbench';

export const metadata = {
	title: 'Studio Workbench — Exhuma',
	description:
		'Xcode and Figma-grade visual parameter IDE and real-time multi-ecosystem code synchronizer across 13 frontend frameworks.',
};

export default function StudioPage() {
	return (
		<div className="container-fluid py-8 min-h-[calc(100vh-8rem)]">
			<Suspense
				fallback={
					<div className="flex h-96 items-center justify-center text-sm font-mono text-muted-foreground">
						Initializing Studio Workbench...
					</div>
				}
			>
				<StudioWorkbench />
			</Suspense>
		</div>
	);
}
