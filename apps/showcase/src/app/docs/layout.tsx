import React from 'react';
import { DocsSidebar } from '@/components/layout/DocsSidebar';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className='container-fluid min-h-screen'>
			<div className='flex flex-col gap-8 py-6 md:flex-row'>
				<DocsSidebar />
				<main className='min-w-0 flex-1 py-2'>{children}</main>
			</div>
		</div>
	);
}
