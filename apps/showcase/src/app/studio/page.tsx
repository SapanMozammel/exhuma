import { redirect } from 'next/navigation';

export const metadata = {
	title: 'Studio Workbench — Exhuma',
	description: 'Xcode and Figma-grade visual parameter IDE and real-time multi-ecosystem code synchronizer across 13 frontend frameworks.',
};

// Studio has been consolidated into the component doc pages.
// Redirect /studio?slug=xyz → /docs/components/xyz
// Redirect /studio → /docs/components
export default async function StudioPage({ searchParams }: { searchParams: Promise<{ slug?: string }> }) {
	const { slug } = await searchParams;
	if (slug) {
		redirect(`/docs/components/${slug}`);
	}
	redirect('/docs/components');
}
