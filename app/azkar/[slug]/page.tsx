import { AzkarCategoryPage } from '@/components/azkar/AzkarCategoryPage';
import { notFound } from 'next/navigation';

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
export default function AzkarPage({ params }: { params: { slug: string } }) {
  const normalizedSlug = normalizeSlug(params.slug);

  if (!AZKAR_CATEGORY_SLUGS.includes(normalizedSlug as (typeof AZKAR_CATEGORY_SLUGS)[number])) {
    notFound();
  }

  return <AzkarCategoryPage slug={normalizedSlug} />;
}
