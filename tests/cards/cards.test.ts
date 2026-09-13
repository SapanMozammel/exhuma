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

