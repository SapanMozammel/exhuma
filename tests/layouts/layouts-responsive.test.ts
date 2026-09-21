import { describe, it, expect } from 'vitest';
import { CssMasonry, CssMasonryItem, AutoGrid, AutoGridItem } from '../../packages/layouts/src';
import { cssMasonryComponent } from '../../packages/registry/src/components/css-masonry';
import { autoGridComponent } from '../../packages/registry/src/components/auto-grid';

describe('Exhuma Layouts — CssMasonry Architecture & Registry', () => {
	it('exports CssMasonry and CssMasonryItem components', () => {
		expect(CssMasonry).toBeDefined();
		expect(typeof CssMasonry).toBe('function');
		expect(CssMasonryItem).toBeDefined();
		expect(typeof CssMasonryItem).toBe('function');
	});

	it('validates css-masonry registry schema with complete responsive parameters', () => {
		expect(cssMasonryComponent.id).toBe('css-masonry');
		expect(cssMasonryComponent.defaultProps.columns).toBe(1);
		expect(cssMasonryComponent.defaultProps.columnsSm).toBe(2);
		expect(cssMasonryComponent.defaultProps.columnsMd).toBe(2);
		expect(cssMasonryComponent.defaultProps.columnsLg).toBe(3);
		expect(cssMasonryComponent.defaultProps.columnsXl).toBe(4);
		expect(cssMasonryComponent.defaultProps.gap).toBe(16);
		expect(cssMasonryComponent.defaultProps.columnFill).toBe('balance');

		const columnsProp = cssMasonryComponent.props.find((p) => p.name === 'columns');
		const columnsSmProp = cssMasonryComponent.props.find((p) => p.name === 'columnsSm');
		const columnsMdProp = cssMasonryComponent.props.find((p) => p.name === 'columnsMd');
		const columnsLgProp = cssMasonryComponent.props.find((p) => p.name === 'columnsLg');
		const columnsXlProp = cssMasonryComponent.props.find((p) => p.name === 'columnsXl');
		const gapProp = cssMasonryComponent.props.find((p) => p.name === 'gap');
		const columnFillProp = cssMasonryComponent.props.find((p) => p.name === 'columnFill');

		expect(columnsProp?.type).toBe('number');
		expect(columnsProp?.defaultValue).toBe(1);
		expect(columnsProp?.min).toBe(1);
		expect(columnsProp?.max).toBe(8);

		expect(columnsSmProp?.type).toBe('number');
		expect(columnsSmProp?.defaultValue).toBe(2);

		expect(columnsMdProp?.type).toBe('number');
		expect(columnsMdProp?.defaultValue).toBe(2);

		expect(columnsLgProp?.type).toBe('number');
		expect(columnsLgProp?.defaultValue).toBe(3);

		expect(columnsXlProp?.type).toBe('number');
		expect(columnsXlProp?.defaultValue).toBe(4);

		expect(gapProp?.type).toBe('number');
		expect(gapProp?.min).toBe(4);
		expect(gapProp?.max).toBe(64);

		expect(columnFillProp?.type).toBe('select');
		expect(columnFillProp?.options?.length).toBe(2);
	});

	it('generates outer-layer payload without errors', () => {
		const payload = cssMasonryComponent.generateCode('react', {
			columns: 4,
			gap: 20,
			columnFill: 'balance',
		});
		expect(payload).toBeDefined();
		expect(payload.length).toBeGreaterThan(0);
	});
});

describe('Exhuma Layouts — AutoGrid Architecture & Registry', () => {
	it('exports AutoGrid and AutoGridItem components', () => {
		expect(AutoGrid).toBeDefined();
		expect(typeof AutoGrid).toBe('function');
		expect(AutoGridItem).toBeDefined();
		expect(typeof AutoGridItem).toBe('function');
	});

	it('validates auto-grid registry schema with responsive parameters and track modes', () => {
		expect(autoGridComponent.id).toBe('auto-grid');
		expect(autoGridComponent.defaultProps.minItemWidth).toBe(280);
		expect(autoGridComponent.defaultProps.gap).toBe(24);
		expect(autoGridComponent.defaultProps.mode).toBe('auto-fit');
		expect(autoGridComponent.defaultProps.maxColumns).toBe(4);
		expect(autoGridComponent.defaultProps.alignItems).toBe('stretch');

		const minItemWidthProp = autoGridComponent.props.find((p) => p.name === 'minItemWidth');
		const gapProp = autoGridComponent.props.find((p) => p.name === 'gap');
		const modeProp = autoGridComponent.props.find((p) => p.name === 'mode');
		const maxColumnsProp = autoGridComponent.props.find((p) => p.name === 'maxColumns');
		const alignItemsProp = autoGridComponent.props.find((p) => p.name === 'alignItems');

		expect(minItemWidthProp?.type).toBe('number');
		expect(minItemWidthProp?.min).toBe(120);
		expect(minItemWidthProp?.max).toBe(480);

		expect(gapProp?.type).toBe('number');
		expect(gapProp?.min).toBe(4);
		expect(gapProp?.max).toBe(64);

		expect(modeProp?.type).toBe('select');
		expect(modeProp?.options?.map((o) => o.value)).toContain('auto-fit');
		expect(modeProp?.options?.map((o) => o.value)).toContain('auto-fill');

		expect(maxColumnsProp?.type).toBe('number');
		expect(maxColumnsProp?.defaultValue).toBe(4);

		expect(alignItemsProp?.type).toBe('select');
		expect(alignItemsProp?.options?.map((o) => o.value)).toContain('stretch');
		expect(alignItemsProp?.options?.map((o) => o.value)).toContain('start');
	});

	it('generates outer-layer payload without errors', () => {
		const payload = autoGridComponent.generateCode('react', {
			minItemWidth: 320,
			gap: 24,
			mode: 'auto-fill',
		});
		expect(payload).toBeDefined();
		expect(payload.length).toBeGreaterThan(0);
	});
});
