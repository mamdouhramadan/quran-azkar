"use client";

import Link from 'next/link';
import { azkarCategories } from '@/core/data/azkarData';
import { useTranslation } from '@/core/hooks/useTranslation';

export const MainCategories = () => {
  const { t } = useTranslation();

  if (!azkarCategories || azkarCategories.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black tracking-tight">{t('mainCategories')}</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {azkarCategories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/azkar/${cat.slug}/`}
            className="flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-card to-primary/5 border border-primary/10 shadow-sm p-6 !text-center transition-all hover:shadow-md hover:border-primary/30 cursor-pointer group"
          >
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <cat.icon className="text-3xl" weight="fill" />
            </div>
            <h4 className="text-base font-bold">{t(cat.titleKey)}</h4>
            <p className="mt-1 text-xs text-muted-foreground">{t(cat.descKey)}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};
