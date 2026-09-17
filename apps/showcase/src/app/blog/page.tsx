import React from 'react';
import Link from 'next/link';
import { IconSparkles as Sparkles, IconCalendar as Calendar, IconClock as Clock, IconArrowRight as ArrowRight, IconBook2 as BookOpen, IconStack2 as Layers } from '@tabler/icons-react';
import { BLOG_POSTS } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Blog — Exhuma Engineering & Architecture',
	description: 'Technical deep dives on kinetic interaction physics, multi-framework design contracts, and the future of copy-paste component architecture.',
};

export default function BlogIndexPage() {
	const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
	const regularPosts = BLOG_POSTS.filter((p) => p.slug !== featuredPost.slug);

	return (
		<div className='container space-y-12 py-12 sm:py-16'>
			{/* Page Header */}
			<div className='max-w-3xl space-y-4'>
				<div className='border-border bg-muted/60 text-foreground inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-semibold backdrop-blur-md'>
					<Sparkles className='text-primary h-3.5 w-3.5 shrink-0' />
					<span>Engineering & Architecture</span>
				</div>
				<h1 className='text-heading-xlarge text-foreground tracking-tight'>Exhuma Journal</h1>
				<p className='text-muted-foreground text-base leading-relaxed sm:text-lg'>
					Deep dives into kinetic interaction physics, memory-safe component lifecycles, and the future of headless multi-framework development.
				</p>
			</div>

			{/* Featured Article Card */}
			{featuredPost && (
				<Link
					href={`/blog/${featuredPost.slug}`}
					className='group border-border bg-card hover:border-primary/50 relative block overflow-hidden rounded-3xl border p-6 shadow-lg transition-all hover:shadow-xl sm:p-10'
				>
					<div className='bg-primary/5 group-hover:bg-primary/10 pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full blur-3xl transition-colors' />
					<div className='max-w-3xl space-y-4'>
						<div className='flex flex-wrap items-center gap-2'>
							<Badge variant='default' className='text-3xs'>
								Featured
							</Badge>
							{featuredPost.tags.map((tag) => (
								<Badge key={tag} variant='outline' className='text-3xs'>
									{tag}
								</Badge>
							))}
							<div className='text-muted-foreground ml-auto flex items-center gap-1.5 font-mono text-xs'>
								<Calendar className='h-3.5 w-3.5 shrink-0' />
								<span>{featuredPost.publishedAt}</span>
								<span>·</span>
								<Clock className='h-3.5 w-3.5' />
								<span>{featuredPost.readTime}</span>
							</div>
						</div>

						<h2 className='text-foreground group-hover:text-primary text-2xl font-extrabold tracking-tight transition-colors sm:text-3xl'>{featuredPost.title}</h2>

						<p className='text-muted-foreground text-sm leading-relaxed sm:text-base'>{featuredPost.description}</p>

						<div className='flex items-center justify-between pt-2 text-xs'>
							<div className='flex items-center gap-2'>
								<div className='bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold'>{featuredPost.author.avatar}</div>
								<div>
									<div className='text-foreground font-semibold'>{featuredPost.author.name}</div>
									<div className='text-muted-foreground text-2xs'>{featuredPost.author.role}</div>
								</div>
							</div>

							<div className='text-primary flex items-center gap-1 font-semibold transition-transform group-hover:translate-x-1'>
								<span>Read Article</span>
								<ArrowRight className='h-3.5 w-3.5' />
							</div>
						</div>
					</div>
				</Link>
			)}

			{/* Article Grid */}
			<div className='border-border space-y-6 border-t pt-6'>
				<h3 className='text-muted-foreground font-mono text-xs font-bold tracking-wider uppercase'>All Articles</h3>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
					{regularPosts.map((post) => (
						<Link
							key={post.slug}
							href={`/blog/${post.slug}`}
							className='group border-border bg-card hover:border-primary/50 flex flex-col justify-between rounded-2xl border p-6 shadow-xs transition-all hover:shadow-md'
						>
							<div className='space-y-3'>
								<div className='flex items-center justify-between gap-2'>
									<div className='flex flex-wrap gap-1.5'>
										{post.tags.map((tag) => (
											<Badge key={tag} variant='outline' className='text-3xs'>
												{tag}
											</Badge>
										))}
									</div>
									<div className='text-muted-foreground text-2xs flex items-center gap-1 font-mono'>
										<Clock className='h-3 w-3 shrink-0' />
										<span>{post.readTime}</span>
									</div>
								</div>

								<h4 className='text-foreground group-hover:text-primary text-lg font-bold tracking-tight transition-colors'>{post.title}</h4>

								<p className='text-muted-foreground line-clamp-3 text-xs leading-relaxed'>{post.description}</p>
							</div>

							<div className='border-border mt-6 flex items-center justify-between border-t pt-6 text-xs'>
								<div className='flex items-center gap-2'>
									<div className='bg-primary/10 text-primary text-3xs flex h-6 w-6 items-center justify-center rounded-full font-bold'>{post.author.avatar}</div>
									<span className='text-muted-foreground text-2xs font-medium'>{post.author.name}</span>
								</div>
								<span className='text-muted-foreground text-2xs font-mono'>{post.publishedAt}</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
