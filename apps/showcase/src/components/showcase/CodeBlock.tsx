'use client';

import React, { useState, useEffect } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
	code: string;
	language?: string;
	filename?: string;
	showLineNumbers?: boolean;
	className?: string;
}

// Global highlight cache to prevent redundant re-renders
const htmlCache = new Map<string, string>();

export function CodeBlock({
	code,
	language = 'tsx',
	filename,
	showLineNumbers = true,
	className,
}: CodeBlockProps) {
	const [copied, setCopied] = useState(false);
	const [highlightedHtml, setHighlightedHtml] = useState<string>(() => {
		const cacheKey = `${language}:${code}`;
		return htmlCache.get(cacheKey) || '';
	});

	useEffect(() => {
		let isMounted = true;
		const cacheKey = `${language}:${code}`;
		if (htmlCache.has(cacheKey)) {
			setHighlightedHtml(htmlCache.get(cacheKey)!);
			return;
		}

		// Dynamically import shiki for client-side rendering
		import('shiki')
			.then(async ({ codeToHtml }) => {
				const supportedLangs = [
					'tsx',
					'ts',
					'jsx',
					'js',
					'vue',
					'svelte',
					'astro',
					'php',
					'dart',
					'html',
					'css',
					'json',
					'bash',
					'sh',
				];
				const lang = supportedLangs.includes(language.toLowerCase())
					? language.toLowerCase()
					: 'tsx';

				const html = await codeToHtml(code, {
					lang,
					themes: {
						light: 'github-light',
						dark: 'github-dark',
					},
				});

				if (isMounted) {
					htmlCache.set(cacheKey, html);
					setHighlightedHtml(html);
				}
			})
			.catch(() => {
				// Fallback to plain text on any bundle limitation
			});

		return () => {
			isMounted = false;
		};
	}, [code, language]);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	};

	return (
		<div
			className={cn(
				'relative overflow-hidden rounded-xl border border-border bg-card font-mono text-xs shadow-sm transition-colors',
				className
			)}
		>
			{/* Code Header Bar */}
			<div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2 text-xs">
				<div className="flex items-center gap-2">
					<div className="flex gap-1.5 opacity-70">
						<div className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
						<div className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
						<div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
					</div>
					{filename ? (
						<span className="ml-1.5 font-sans font-medium text-foreground text-[12px] tracking-tight">
							{filename}
						</span>
					) : (
						<span className="ml-1.5 flex items-center gap-1.5 text-muted-foreground text-[11px]">
							<Terminal className="h-3 w-3" />
							<span>Snippet</span>
						</span>
					)}
				</div>

				<div className="flex items-center gap-2">
					<span className="kbd text-[10px] uppercase font-semibold">
						{language}
					</span>
					<button
						type="button"
						onClick={copyToClipboard}
						className={cn(
							'flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-[11px] font-medium text-foreground transition-all hover:bg-accent active:scale-95'
						)}
						title="Copy code to clipboard"
					>
						{copied ? (
							<>
								<Check className="h-3.5 w-3.5 text-emerald-500" />
								<span className="text-emerald-500 font-semibold">Copied</span>
							</>
						) : (
							<>
								<Copy className="h-3.5 w-3.5 text-muted-foreground" />
								<span>Copy</span>
							</>
						)}
					</button>
				</div>
			</div>

			{/* Code Content Viewport */}
			<div className="max-h-[500px] overflow-auto p-4 text-[12px] leading-relaxed">
				{highlightedHtml ? (
					<div
						dangerouslySetInnerHTML={{ __html: highlightedHtml }}
						className="shiki-container"
					/>
				) : (
					<pre className="text-foreground">
						<code>{code}</code>
					</pre>
				)}
			</div>
		</div>
	);
}

export default CodeBlock;
