export { AutoGrid, AutoGridItem } from './AutoGrid/AutoGrid';
export { useMacy } from './hooks/useMacy';
export type { UseMacyOptions } from './hooks/useMacy';
export { CssMasonry, CssMasonryItem } from './Masonry/CssMasonry';
export { MacyMasonry } from './Masonry/MacyMasonry';

// Wave 2: Responsive Layout Engines & Momentum
export { InfiniteMarquee, MarqueeRoot, MarqueeTrack, MarqueeItem } from './InfiniteMarquee/InfiniteMarquee';
export { BentoGrid, BentoCard, BentoHeader, BentoContent, BentoVisual } from './BentoGrid/BentoGrid';
export { DiamondGrid, DiamondColumn, DiamondItem } from './DiamondGrid/DiamondGrid';
export { ScrollTimeline, TimelineRoot, TimelineTrack, TimelineItem, TimelinePoint, TimelineContent } from './ScrollTimeline/ScrollTimeline';
export { StickyParallaxScroll, ParallaxRoot, ParallaxSticky, ParallaxLayer, ParallaxContent } from './StickyParallax/StickyParallax';
export { InteractiveGridPattern } from './InteractiveGrid/InteractiveGridPattern';

// Mathematical Kernels
export { calculateMarqueeOffset, dampFactor } from './InfiniteMarquee/marquee-math';
export { getDiamondLayoutConfig, partitionDiamondItems } from './DiamondGrid/diamond-layout';
export { generateTimelinePath, checkTimelineDirection } from './ScrollTimeline/timeline-path';

export type {
	AutoGridProps,
	AutoGridItemProps,
	CssMasonryProps,
	CssMasonryItemProps,
	MacyMasonryProps,
	InfiniteMarqueeProps,
	BentoGridProps,
	BentoCardProps,
	DiamondGridProps,
	ScrollTimelineProps,
	ScrollTimelineItemData,
	StickyParallaxProps,
	StickyParallaxLayerProps,
	InteractiveGridPatternProps,
} from './types';
