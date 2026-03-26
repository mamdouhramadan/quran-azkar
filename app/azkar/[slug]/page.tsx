import { AzkarCategoryPage } from '@/components/azkar/AzkarCategoryPage';
import { notFound } from 'next/navigation';

// Keep in sync with `slug` on each entry in `@/core/data/azkarData` (no Phosphor import here — server-safe).
const AZKAR_CATEGORY_SLUGS = [
  'morning',
  'evening',
  'after-prayer',
  'sleep',
  'home-mosque',
  'ruqyah',
  'travel',
  'misc',
] as const;

const VALID_SLUGS = new Set<string>(AZKAR_CATEGORY_SLUGS);

export const dynamicParams = false;

// normalizeSlug trims slashes and normalizes dynamic route values before lookup.
function normalizeSlug(slug: string) {
  return decodeURIComponent(slug).replace(/^\/+|\/+$/g, '').toLowerCase();
}

// generateStaticParams pre-renders every azkar category route for static hosting.
export function generateStaticParams() {
  return AZKAR_CATEGORY_SLUGS.map((slug) => ({ slug }));
}

// AzkarPage renders one static azkar category route through a client component.
export default async function AzkarPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const normalizedSlug = normalizeSlug(slug);

  if (!VALID_SLUGS.has(normalizedSlug)) {
    notFound();
  }

  return <AzkarCategoryPage slug={normalizedSlug} />;
}
