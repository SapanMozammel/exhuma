import { NextResponse } from 'next/server';
import { ALL_COMPONENTS } from '../../../../registry';

export async function GET() {
  const index = ALL_COMPONENTS.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    category: c.category,
    description: c.description,
    version: c.version,
    flavors: [
      'react',
      'nextjs',
      'vue',
      'astro',
      'blade',
      'vanilla',
      'wordpress',
      'webcomponent',
    ],
  }));

  return NextResponse.json(index, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
