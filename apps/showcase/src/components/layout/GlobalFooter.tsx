import * as React from 'react';
import Link from 'next/link';
import { Sparkles, Terminal, ShieldCheck, Cpu, Layers } from 'lucide-react';
import { ALL_COMPONENTS, ECOSYSTEM_LABELS, EcosystemFlavor } from '@/registry';

export function GlobalFooter() {
	const flavors = Object.keys(ECOSYSTEM_LABELS) as EcosystemFlavor[];

	return (
		<footer className="w-full border-t border-border bg-background py-14 text-xs transition-colors">
			<div className="container-fluid space-y-12">
				{/* 5-Column Grid */}
				<div className="grid grid-cols-2 md:grid-cols-5 gap-8">
					{/* Col 1: Brand & Purpose */}
					<div className="col-span-2 md:col-span-1 space-y-3">
						<div className="flex items-center gap-2">
							<div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
								<Sparkles className="h-3.5 w-3.5" />
							</div>
							<span className="font-extrabold tracking-tight text-foreground text-sm">
								Exhuma
							</span>
						</div>
						<p className="text-muted-foreground leading-relaxed text-[11px]">
							Universal tactile interaction engines and layout architecture adapted natively across 13 frontend ecosystems. Free, open-source under MIT.
						</p>
						<div className="pt-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono text-[10px]">
							<ShieldCheck className="h-3.5 w-3.5 shrink-0" />
							<span>Auterix WI Verified · 100% Offline CLI</span>
						</div>
					</div>

					{/* Col 2: Documentation */}
					<div className="space-y-3">
						<div className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">
							Documentation
						</div>
						<ul className="space-y-2 text-muted-foreground text-[11px]">
							<li>
								<Link href="/docs" className="hover:text-foreground transition-colors">
									Overview & Philosophy
								</Link>
							</li>
							<li>
								<Link href="/docs/installation" className="hover:text-foreground transition-colors">
									Installation & Wizard
								</Link>
							</li>
							<li>
								<Link href="/docs/theming" className="hover:text-foreground transition-colors">
									Theming & Dark Mode
								</Link>
							</li>
							<li>
								<Link href="/docs/cli" className="hover:text-foreground transition-colors">
									CLI Reference Manual
								</Link>
							</li>
							<li>
								<Link href="/docs/ecosystems" className="hover:text-foreground transition-colors">
									13 Ecosystem Contracts
								</Link>
							</li>
							<li>
								<Link href="/docs/lifecycle" className="hover:text-foreground transition-colors">
									Lifecycle & Memory Safety
								</Link>
							</li>
							<li>
								<Link href="/docs/components" className="hover:text-foreground transition-colors">
									Component Catalog
								</Link>
							</li>
						</ul>
					</div>

					{/* Col 3: Canonical Components */}
					<div className="space-y-3">
						<div className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">
							Components
						</div>
						<ul className="space-y-2 text-muted-foreground text-[11px]">
							{ALL_COMPONENTS.map((comp) => (
								<li key={comp.slug}>
									<Link
										href={`/docs/components/${comp.slug}`}
										className="hover:text-foreground transition-colors"
									>
										{comp.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Col 4: Ecosystems */}
					<div className="space-y-3">
						<div className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">
							13 Frameworks
						</div>
						<ul className="space-y-1.5 text-muted-foreground text-[11px] max-h-48 overflow-y-auto">
							{flavors.slice(0, 7).map((f) => (
								<li key={f}>
									<Link
										href={`/docs/ecosystems#${f}`}
										className="hover:text-foreground transition-colors font-mono"
									>
										{ECOSYSTEM_LABELS[f]}
									</Link>
								</li>
							))}
							<li>
								<Link
									href="/docs/ecosystems"
									className="text-primary font-semibold hover:underline"
								>
									+6 more platforms →
								</Link>
							</li>
						</ul>
					</div>

					{/* Col 5: Community & Tools */}
					<div className="space-y-3">
						<div className="font-semibold text-foreground text-xs uppercase tracking-wider font-mono">
							Platform & Tools
						</div>
						<ul className="space-y-2 text-muted-foreground text-[11px]">
							<li>
								<Link href="/showcase" className="hover:text-foreground transition-colors">
									Community Showcase
								</Link>
							</li>
							<li>
								<Link href="/blog" className="hover:text-foreground transition-colors">
									Engineering Journal
								</Link>
							</li>
							<li>
								<Link href="/studio" className="hover:text-foreground transition-colors">
									Studio Workbench IDE
								</Link>
							</li>
							<li>
								<Link
									href="https://npmjs.com/package/exhuma"
									target="_blank"
									rel="noreferrer"
									className="hover:text-foreground transition-colors"
								>
									npm: exhuma (v0.1.1)
								</Link>
							</li>
							<li>
								<Link
									href="https://npmjs.com/package/create-exhuma"
									target="_blank"
									rel="noreferrer"
									className="hover:text-foreground transition-colors"
								>
									npm: create-exhuma
								</Link>
							</li>
							<li>
								<Link
									href="https://github.com/SapanMozammel/exhuma"
									target="_blank"
									rel="noreferrer"
									className="hover:text-foreground transition-colors flex items-center gap-1.5"
								>
									<svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
										<path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
									</svg>
									<span>GitHub Repository</span>
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar: Operational Status & Shortcuts */}
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border text-muted-foreground text-[11px]">
					<div className="flex items-center gap-3">
						<span className="flex h-2 w-2 rounded-full bg-emerald-500" />
						<span>All 13 Framework Contracts Operational</span>
						<span>·</span>
						<span>MIT License © {new Date().getFullYear()} Exhuma Authors</span>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1">
							<span className="kbd text-[9px]">⌘K</span>
							<span>Search</span>
						</div>
						<div className="flex items-center gap-1">
							<span className="kbd text-[9px]">⌘⌥T</span>
							<span>Theme</span>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export default GlobalFooter;
