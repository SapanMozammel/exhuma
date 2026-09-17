import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { IconCalendar as Calendar, IconClock as Clock, IconArrowLeft as ArrowLeft, IconArrowRight as ArrowRight, IconShare as Share2, IconSparkles as Sparkles } from '@tabler/icons-react';
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

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
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
	const nextPost = currentIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[currentIndex + 1] : null;

	return (
		<div className='container py-10 sm:py-16'>
			<div className='flex gap-10'>
				{/* Main Article Content */}
				<article className='max-w-3xl min-w-0 flex-1 space-y-8'>
					{/* Back Link & Breadcrumb */}
					<div className='text-muted-foreground flex items-center gap-2 font-mono text-xs'>
						<Link href='/blog' className='hover:text-foreground inline-flex items-center gap-1 transition-colors'>
							<ArrowLeft className='h-3.5 w-3.5' />
							<span>Back to Journal</span>
						</Link>
						<span>/</span>
						<span className='text-foreground truncate font-semibold'>{post.title}</span>
					</div>

					{/* Title & Metadata */}
					<div className='border-border space-y-4 border-b pb-8'>
						<div className='flex flex-wrap gap-2'>
							{post.tags.map((tag) => (
								<Badge key={tag} variant='secondary' className='text-[10px]'>
									{tag}
								</Badge>
							))}
						</div>

						<h1 className='text-foreground text-3xl leading-[1.15] font-extrabold tracking-tight sm:text-4xl lg:text-5xl'>{post.title}</h1>

						<p className='text-muted-foreground text-base leading-relaxed sm:text-lg'>{post.description}</p>

						<div className='flex items-center justify-between pt-4 text-xs'>
							<div className='flex items-center gap-3'>
								<div className='bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold'>{post.author.avatar}</div>
								<div>
									<div className='text-foreground font-semibold'>{post.author.name}</div>
									<div className='text-muted-foreground text-[11px]'>{post.author.role}</div>
								</div>
							</div>

							<div className='text-muted-foreground flex items-center gap-2 font-mono text-[11px]'>
								<Calendar className='h-3.5 w-3.5' />
								<span>{post.publishedAt}</span>
								<span>·</span>
								<Clock className='h-3.5 w-3.5' />
								<span>{post.readTime}</span>
							</div>
						</div>
					</div>

					{/* Article Sections */}
					<div className='space-y-10'>
						{post.content.sections.map((section) => (
							<section key={section.id} id={section.id} className='space-y-4 pt-2'>
								<h2 className='text-foreground text-xl font-bold tracking-tight sm:text-2xl'>{section.title}</h2>

								<p className='text-muted-foreground text-sm leading-relaxed sm:text-base'>{section.content}</p>

								{section.callout && (
									<Callout type={section.callout.type} title={section.callout.title}>
										{section.callout.message}
									</Callout>
								)}

								{section.codeSnippet && (
									<div className='pt-2'>
										<CodeBlock code={section.codeSnippet.code} language={section.codeSnippet.language} filename={section.codeSnippet.filename} />
									</div>
								)}
							</section>
						))}
					</div>

					{/* Previous / Next Article Footer */}
					<div className='border-border mt-12 flex flex-col items-stretch justify-between gap-4 border-t pt-10 sm:flex-row sm:items-center'>
						{prevPost ? (
							<Link href={`/blog/${prevPost.slug}`} className='border-border hover:bg-muted/50 flex flex-1 items-center gap-3 rounded-xl border p-4 transition-colors'>
								<ArrowLeft className='text-muted-foreground h-4 w-4 shrink-0' />
								<div className='text-left'>
									<div className='text-muted-foreground font-mono text-[10px] uppercase'>Previous Article</div>
									<div className='text-foreground line-clamp-1 text-xs font-bold'>{prevPost.title}</div>
								</div>
							</Link>
						) : (
							<div className='flex-1' />
						)}

						{nextPost && (
							<Link href={`/blog/${nextPost.slug}`} className='border-border hover:bg-muted/50 flex flex-1 items-center justify-end gap-3 rounded-xl border p-4 transition-colors'>
								<div className='text-right'>
									<div className='text-muted-foreground font-mono text-[10px] uppercase'>Next Article</div>
									<div className='text-foreground line-clamp-1 text-xs font-bold'>{nextPost.title}</div>
								</div>
								<ArrowRight className='text-muted-foreground h-4 w-4 shrink-0' />
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
