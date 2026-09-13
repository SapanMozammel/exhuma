import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import {
	ALL_COMPONENTS,
	EcosystemFlavor,
	EcosystemFlavorSchema,
} from '@exhuma/registry';

const FLAVORS: EcosystemFlavor[] = EcosystemFlavorSchema.options;

export function buildRegistry(rootDir: string = process.cwd()): void {
  console.log('Compiling Exhuma Universal Registry...');

  const showcasePublicDir = resolve(rootDir, 'apps/showcase/public/registry');
  const cliRegistryDir = resolve(rootDir, 'packages/cli/src/registry');

  for (const dir of [showcasePublicDir, cliRegistryDir]) {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  }

  // 1. Index Manifest
  const indexManifest = {
    $schema: 'https://exhuma.dev/schema/registry-index.json',
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    components: ALL_COMPONENTS.map((comp) => ({
      name: comp.name,
      slug: comp.slug,
      category: comp.category,
      description: comp.description,
      version: comp.version,
      props: comp.props,
      flavors: FLAVORS,
    })),
  };

  writeFileSync(
    resolve(showcasePublicDir, 'index.json'),
    JSON.stringify(indexManifest, null, 2) + '\n',
    'utf8'
  );

  // 2. Canonical Full Dictionary
  const canonicalDictionary: Record<string, Record<EcosystemFlavor, any[]>> = {};

  for (const comp of ALL_COMPONENTS) {
    canonicalDictionary[comp.slug] = {} as Record<EcosystemFlavor, any[]>;

    const componentPayload = {
      name: comp.name,
      slug: comp.slug,
      category: comp.category,
      description: comp.description,
      version: comp.version,
      props: comp.props,
      flavors: {} as Record<EcosystemFlavor, any[]>,
    };

    for (const flavor of FLAVORS) {
      const files = comp.generateCode(flavor, comp.defaultProps);
      componentPayload.flavors[flavor] = files;
      canonicalDictionary[comp.slug][flavor] = files;
    }

    // Write individual public registry endpoint for Vercel
    writeFileSync(
      resolve(showcasePublicDir, `${comp.slug}.json`),
      JSON.stringify(componentPayload, null, 2) + '\n',
      'utf8'
    );
  }

  // Write embedded canonical registry for CLI
  writeFileSync(
    resolve(cliRegistryDir, 'canonical.json'),
    JSON.stringify(canonicalDictionary, null, 2) + '\n',
    'utf8'
  );

  console.log(`Successfully compiled registry:`);
  console.log(`  - Vercel Static CDN: apps/showcase/public/registry/ (${ALL_COMPONENTS.length} components)`);
  console.log(`  - CLI Embedded: packages/cli/src/registry/canonical.json`);
}

buildRegistry();
