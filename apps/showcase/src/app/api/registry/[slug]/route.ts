import { NextRequest, NextResponse } from "next/server";
import { getComponentBySlug, EcosystemFlavor } from "../../../../registry";

const FLAVORS: EcosystemFlavor[] = [
  "react",
  "nextjs",
  "vue",
  "astro",
  "blade",
  "vanilla",
  "wordpress",
  "webcomponent",
];

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const component = getComponentBySlug(slug);

  if (!component) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }

  const payload: Record<string, unknown> = {
    name: component.name,
    slug: component.slug,
    version: component.version,
    category: component.category,
    description: component.description,
    props: component.props,
    defaultProps: component.defaultProps,
    flavors: {} as Record<string, unknown>,
  };

  for (const flavor of FLAVORS) {
    (payload.flavors as Record<string, unknown>)[flavor] = {
      files: component.generateCode(flavor, component.defaultProps),
    };
  }

  return NextResponse.json(payload, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
