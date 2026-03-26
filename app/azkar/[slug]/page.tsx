import { AzkarCategoryPage } from '@/components/azkar/AzkarCategoryPage';

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

// generateStaticParams pre-renders every azkar category route for static hosting.
export function generateStaticParams() {
  return AZKAR_CATEGORY_SLUGS.map((slug) => ({ slug }));
}

// AzkarPage renders one static azkar category route through a client component.
export default function AzkarPage({ params }: { params: { slug: string } }) {
  return <AzkarCategoryPage slug={params.slug} />;
}
