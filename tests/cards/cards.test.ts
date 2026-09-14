import { describe, it, expect } from 'vitest';
import { TiltCard, HorizontalScroller, StackingCards } from '@exhuma/cards';
import { AutoGrid, CssMasonry, MacyMasonry, useMacy } from '@exhuma/layouts';
import { ProtectedRoute, AuthLayout, DashboardLayout, LandingLayout, Header, Footer } from '@exhuma/router';
import * as core from '@exhuma/core';

describe('@exhuma Package Ecosystem — Complete Library Parity Gate', () => {
  it('exports all tactile card components from @exhuma/cards', () => {
    expect(TiltCard).toBeDefined();
    expect(HorizontalScroller).toBeDefined();
    expect(StackingCards).toBeDefined();
  });

  it('exports all responsive layout engines from @exhuma/layouts', () => {
    expect(AutoGrid).toBeDefined();
    expect(CssMasonry).toBeDefined();
    expect(MacyMasonry).toBeDefined();
    expect(useMacy).toBeDefined();
  });

  it('exports all routing architectures from @exhuma/router', () => {
    expect(ProtectedRoute).toBeDefined();
    expect(AuthLayout).toBeDefined();
    expect(DashboardLayout).toBeDefined();
    expect(LandingLayout).toBeDefined();
    expect(Header).toBeDefined();
    expect(Footer).toBeDefined();
  });

  it('re-exports all cards, layouts, and router modules through @exhuma/core', () => {
    expect(core.TiltCard).toBeDefined();
    expect(core.HorizontalScroller).toBeDefined();
    expect(core.StackingCards).toBeDefined();
    expect(core.AutoGrid).toBeDefined();
    expect(core.CssMasonry).toBeDefined();
    expect(core.MacyMasonry).toBeDefined();
    expect(core.ProtectedRoute).toBeDefined();
    expect(core.AuthLayout).toBeDefined();
    expect(core.DashboardLayout).toBeDefined();
    expect(core.LandingLayout).toBeDefined();
  });
});

describe('@exhuma Dynamic Primitive Physics & Geometry Gate', () => {
  it('calculates progressive scaling accurately across stack layers', () => {
    // 4 cards stack with default minScale = 0.94
    const scales = core.generateDefaultScaleValues(4, 0.94);
    expect(scales.length).toBe(4);
    expect(scales[0]).toBeCloseTo(0.94, 2); // First/deepest card scales down to minScale
    expect(scales[1]).toBeGreaterThan(scales[0]);
    expect(scales[2]).toBeGreaterThan(scales[1]);
    expect(scales[3]).toBe(1.0); // Last card crowns at 1.0

    // 1 or 2 cards
    expect(core.generateDefaultScaleValues(1)).toEqual([1.0]);
    expect(core.generateDefaultScaleValues(2)).toEqual([1.0, 1.0]);
  });

  it('calculates dynamic horizontal travel distance and virtual section height', () => {
    // Track width 2400px, container width 1200px, extraPadding 60px
    const distance = core.calculateHorizontalDistance(2400, 1200, 60);
    expect(distance).toBe(1260);

    // Section height for viewport 900px, speed 0.85
    const height = core.calculateSectionHeight(900, distance, 0.85);
    expect(height).toBe(900 + Math.round(1260 / 0.85));
    expect(height).toBeGreaterThan(900);
  });
});


