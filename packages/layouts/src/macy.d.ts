declare module 'macy' {
	export interface MacyOptions {
		container: HTMLElement | string;
		margin?: number;
		columns?: number;
		breakAt?: Record<number, number>;
		waitForImages?: boolean;
		[key: string]: unknown;
	}

	export interface MacyInstance {
		reInit: () => void;
		remove: () => void;
		recalculate: (waitForImages?: boolean, callOnComplete?: boolean) => void;
		runOnImageLoad: (cb: () => void) => void;
	}

	function Macy(options: MacyOptions): MacyInstance;
	export default Macy;
}
