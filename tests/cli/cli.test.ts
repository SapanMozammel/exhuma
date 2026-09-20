import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const CLI_BIN = resolve(__dirname, '../../packages/cli/dist/index.js');
const CREATE_BIN = resolve(__dirname, '../../packages/create-exhuma/dist/index.js');
const TEST_DIR = resolve(__dirname, '../../scratch/cli-vitest');

describe('Exhuma CLI Suite — Automated End-to-End Test Gate', () => {
  beforeAll(() => {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true, force: true });
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterAll(() => {
    if (existsSync(TEST_DIR)) rmSync(TEST_DIR, { recursive: true, force: true });
  });

  it('outputs help information and valid command list', () => {
    const stdout = execSync(`node "${CLI_BIN}" --help`).toString();
    expect(stdout).toContain('exhuma [options] [command]');
    expect(stdout).toContain('init');
    expect(stdout).toContain('add');
    expect(stdout).toContain('list');
    expect(stdout).toContain('build');
  });

  it('outputs version number matching 0.1.1', () => {
    const stdout = execSync(`node "${CLI_BIN}" --version`).toString();
    expect(stdout.trim()).toBe('0.1.1');
  });

  it('lists all canonical components and all 13 ecosystems', () => {
    const stdout = execSync(`node "${CLI_BIN}" list`).toString();
    expect(stdout).toContain('stacking-cards');
    expect(stdout).toContain('horizontal-scroller');
    expect(stdout).toContain('css-masonry');
    expect(stdout).toContain('auto-grid');
    expect(stdout).toContain('tilt-card');
    expect(stdout).toContain('spotlight-card');
    expect(stdout).toContain('react • nextjs • vue • svelte • angular • solid • astro • blade • vanilla • wordpress • webcomponent • react-native • flutter');
  });

  it('executes exhuma init and creates valid exhuma.json', () => {
    execSync(`node "${CLI_BIN}" init --yes --flavor=svelte`, { cwd: TEST_DIR });
    const configPath = resolve(TEST_DIR, 'exhuma.json');
    expect(existsSync(configPath)).toBe(true);

    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    expect(config.flavor).toBe('svelte');
    expect(config.path).toBe('src/lib/components');
  });

  it('installs real production Svelte 5 component with Runes via exhuma add', () => {
    execSync(`node "${CLI_BIN}" add stacking-cards --flavor=svelte --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/StackingCards.svelte');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('$props()');
    expect(code).toContain('onMount');
    expect(code).toContain('reverseScale');
  });

  it('installs real React component via exhuma add with custom path', () => {
    execSync(`node "${CLI_BIN}" add auto-grid --flavor=react --path=custom/ui --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'custom/ui/AutoGrid.tsx');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('AutoGrid');
    expect(code).toContain('@exhuma/core');
    expect(code).toContain('AutoGridPrimitive');
  });

  it('installs real Spotlight Card component via exhuma add', () => {
    execSync(`node "${CLI_BIN}" add spotlight-card --flavor=svelte --yes`, { cwd: TEST_DIR });
    const componentPath = resolve(TEST_DIR, 'src/lib/components/SpotlightCard.svelte');
    expect(existsSync(componentPath)).toBe(true);

    const code = readFileSync(componentPath, 'utf8');
    expect(code).toContain('exhuma-spotlight-card');
    expect(code).toContain('updateFrame');
  });

  it('executes exhuma build to generate static registry JSON', () => {
    const buildOut = resolve(TEST_DIR, 'dist-registry');
    execSync(`node "${CLI_BIN}" build --output="${buildOut}"`, { cwd: TEST_DIR });

    expect(existsSync(resolve(buildOut, 'index.json'))).toBe(true);
    expect(existsSync(resolve(buildOut, 'stacking-cards.json'))).toBe(true);
    expect(existsSync(resolve(buildOut, 'tilt-card.json'))).toBe(true);
    expect(existsSync(resolve(buildOut, 'spotlight-card.json'))).toBe(true);

    const indexJson = JSON.parse(readFileSync(resolve(buildOut, 'index.json'), 'utf8'));
    expect(indexJson.components.length).toBeGreaterThanOrEqual(5);
  });

  it('verifies create-exhuma binary help output', () => {
    const stdout = execSync(`node "${CREATE_BIN}" --help`).toString();
    expect(stdout).toBeDefined();
  });
});
