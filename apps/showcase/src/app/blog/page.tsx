import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Clock, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { BLOG_POSTS } from '@/lib/blog-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Blog — Exhuma Engineering & Architecture',
	description:
		'Technical deep dives on kinetic interaction physics, multi-framework design contracts, and the future of copy-paste component architecture.',
};

export default function BlogIndexPage() {
	const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];
	const regularPosts = BLOG_POSTS.filter((p) => p.slug !== featuredPost.slug);

	return (
		<div className="container py-12 sm:py-16 space-y-12">
			{/* Page Header */}
			<div className="max-w-3xl space-y-4">
				<div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-semibold text-foreground backdrop-blur-md">
					<Sparkles className="h-3.5 w-3.5 text-primary" />
					<span>Engineering & Architecture</span>
				</div>
				<h1 className="text-heading-xlarge text-foreground tracking-tight">
					Exhuma Journal
				</h1>
				<p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
					Deep dives into kinetic interaction physics, memory-safe component lifecycles, and the future of headless multi-framework development.
				</p>
			</div>

			{/* Featured Article Card */}
			{featuredPost && (
				<Link
					href={`/blog/${featuredPost.slug}`}
					className="group block rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lg hover:border-primary/50 transition-all hover:shadow-xl relative overflow-hidden"
				>
					<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
					<div className="space-y-4 max-w-3xl">
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="default" className="text-[10px]">
								Featured
							</Badge>
							{featuredPost.tags.map((tag) => (
								<Badge key={tag} variant="outline" className="text-[10px]">
									{tag}
								</Badge>
							))}
							<div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto font-mono">
								<Calendar className="h-3.5 w-3.5" />
								<span>{featuredPost.publishedAt}</span>
								<span>·</span>
								<Clock className="h-3.5 w-3.5" />
								<span>{featuredPost.readTime}</span>
							</div>
						</div>

						<h2 className="text-2xl sm:text-3xl font-extrabold text-foreground group-hover:text-primary transition-colors tracking-tight">
							{featuredPost.title}
						</h2>

						<p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
							{featuredPost.description}
						</p>

						<div className="pt-2 flex items-center justify-between text-xs">
							<div className="flex items-center gap-2">
								<div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
									{featuredPost.author.avatar}
								</div>
								<div>
									<div className="font-semibold text-foreground">{featuredPost.author.name}</div>
									<div className="text-[11px] text-muted-foreground">{featuredPost.author.role}</div>
								</div>
							</div>

							<div className="flex items-center gap-1 font-semibold text-primary group-hover:translate-x-1 transition-transform">
								<span>Read Article</span>
								<ArrowRight className="h-3.5 w-3.5" />
							</div>
						</div>
					</div>
				</Link>
			)}

			{/* Article Grid */}
			<div className="space-y-6 pt-6 border-t border-border">
				<h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono">
					All Articles
				</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{regularPosts.map((post) => (
						<Link
							key={post.slug}
							href={`/blog/${post.slug}`}
							className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-xs hover:border-primary/50 transition-all hover:shadow-md"
						>
							<div className="space-y-3">
								<div className="flex items-center justify-between gap-2">
									<div className="flex flex-wrap gap-1.5">
										{post.tags.map((tag) => (
											<Badge key={tag} variant="outline" className="text-[10px]">
												{tag}
											</Badge>
										))}
									</div>
									<div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground">
										<Clock className="h-3 w-3" />
										<span>{post.readTime}</span>
									</div>
								</div>

								<h4 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">
									{post.title}
								</h4>

								<p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
									{post.description}
								</p>
							</div>

							<div className="pt-6 mt-6 border-t border-border flex items-center justify-between text-xs">
								<div className="flex items-center gap-2">
									<div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
										{post.author.avatar}
									</div>
									<span className="text-muted-foreground text-[11px] font-medium">
										{post.author.name}
									</span>
								</div>
								<span className="text-[11px] font-mono text-muted-foreground">
									{post.publishedAt}
								</span>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
