import React, { Suspense } from 'react';
import { StudioWorkbench } from '@/components/showcase/StudioWorkbench';

export const metadata = {
	title: 'Studio Workbench — Exhuma',
	description: 'Xcode and Figma-grade visual parameter IDE and real-time multi-ecosystem code synchronizer across 13 frontend frameworks.',
};

export default function StudioPage() {
	return (
		<div className='container-fluid min-h-[calc(100vh-8rem)] py-8'>
			<Suspense fallback={<div className='text-muted-foreground flex h-96 items-center justify-center font-mono text-sm'>Initializing Studio Workbench...</div>}>
				<StudioWorkbench />
			</Suspense>
		</div>
	);
}
