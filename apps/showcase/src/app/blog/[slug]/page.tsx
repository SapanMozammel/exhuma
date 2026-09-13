import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
	Calendar,
	Clock,
	ArrowLeft,
	ArrowRight,
	Share2,
	Sparkles,
} from 'lucide-react';
import { BLOG_POSTS, getBlogPostBySlug } from '@/lib/blog-data';
import { CodeBlock } from '@/components/showcase/CodeBlock';
import { Callout } from '@/components/layout/Callout';
import { DocsToc } from '@/components/layout/DocsToc';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

interface BlogPostPageProps {
	params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
	return BLOG_POSTS.map((p) => ({
		slug: p.slug,
	}));
}

export async function generateMetadata({
	params,
}: BlogPostPageProps): Promise<Metadata> {
	const { slug } = await params;
	const post = getBlogPostBySlug(slug);
	if (!post) return { title: 'Post Not Found | Exhuma Blog' };

	return {
		title: `${post.title} — Exhuma Journal`,
		description: post.description,
	};
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
	const { slug } = await params;
	const post = getBlogPostBySlug(slug);

	if (!post) {
		notFound();
	}

	const currentIndex = BLOG_POSTS.findIndex((p) => p.slug === post.slug);
	const prevPost = currentIndex > 0 ? BLOG_POSTS[currentIndex - 1] : null;
	const nextPost =
		currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

	return (
		<div className="container py-10 sm:py-16">
			<div className="flex gap-10">
				{/* Main Article Content */}
				<article className="flex-1 min-w-0 max-w-3xl space-y-8">
					{/* Back Link & Breadcrumb */}
					<div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
						<Link
							href="/blog"
							className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
						>
							<ArrowLeft className="h-3.5 w-3.5" />
							<span>Back to Journal</span>
						</Link>
						<span>/</span>
						<span className="text-foreground font-semibold truncate">{post.title}</span>
					</div>

					{/* Title & Metadata */}
					<div className="space-y-4 border-b border-border pb-8">
						<div className="flex flex-wrap gap-2">
							{post.tags.map((tag) => (
								<Badge key={tag} variant="secondary" className="text-[10px]">
									{tag}
								</Badge>
							))}
						</div>

						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
							{post.title}
						</h1>

						<p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
							{post.description}
						</p>

						<div className="flex items-center justify-between pt-4 text-xs">
							<div className="flex items-center gap-3">
								<div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
									{post.author.avatar}
								</div>
								<div>
									<div className="font-semibold text-foreground">{post.author.name}</div>
									<div className="text-[11px] text-muted-foreground">{post.author.role}</div>
								</div>
							</div>

							<div className="flex items-center gap-2 text-muted-foreground font-mono text-[11px]">
								<Calendar className="h-3.5 w-3.5" />
								<span>{post.publishedAt}</span>
								<span>·</span>
								<Clock className="h-3.5 w-3.5" />
								<span>{post.readTime}</span>
							</div>
						</div>
					</div>

					{/* Article Sections */}
					<div className="space-y-10">
						{post.content.sections.map((section) => (
							<section key={section.id} id={section.id} className="space-y-4 pt-2">
								<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
									{section.title}
								</h2>

								<p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
									{section.content}
								</p>

								{section.callout && (
									<Callout type={section.callout.type} title={section.callout.title}>
										{section.callout.message}
									</Callout>
								)}

								{section.codeSnippet && (
									<div className="pt-2">
										<CodeBlock
											code={section.codeSnippet.code}
											language={section.codeSnippet.language}
											filename={section.codeSnippet.filename}
										/>
									</div>
								)}
							</section>
						))}
					</div>

					{/* Previous / Next Article Footer */}
					<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-10 border-t border-border mt-12">
						{prevPost ? (
							<Link
								href={`/blog/${prevPost.slug}`}
								className="flex items-center gap-3 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors flex-1"
							>
								<ArrowLeft className="h-4 w-4 text-muted-foreground shrink-0" />
								<div className="text-left">
									<div className="text-[10px] uppercase font-mono text-muted-foreground">
										Previous Article
									</div>
									<div className="text-xs font-bold text-foreground line-clamp-1">
										{prevPost.title}
									</div>
								</div>
							</Link>
						) : (
							<div className="flex-1" />
						)}

						{nextPost && (
							<Link
								href={`/blog/${nextPost.slug}`}
								className="flex items-center justify-end gap-3 rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors flex-1"
							>
								<div className="text-right">
									<div className="text-[10px] uppercase font-mono text-muted-foreground">
										Next Article
									</div>
									<div className="text-xs font-bold text-foreground line-clamp-1">
										{nextPost.title}
									</div>
								</div>
								<ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
							</Link>
						)}
					</div>
				</article>

				{/* On-This-Page Table of Contents */}
				<DocsToc items={post.content.headings} />
			</div>
		</div>
	);
}
