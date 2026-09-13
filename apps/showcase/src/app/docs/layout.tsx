import React from 'react';
import { DocsSidebar } from '@/components/layout/DocsSidebar';

export default function DocsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="container-fluid min-h-screen">
			<div className="flex flex-col md:flex-row gap-8 py-6">
				<DocsSidebar />
				<main className="flex-1 min-w-0 py-2">{children}</main>
			</div>
		</div>
	);
}
