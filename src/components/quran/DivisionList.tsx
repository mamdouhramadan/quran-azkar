"use client";

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/core/hooks/useTranslation';
import { SelectionBackground, Hash } from '@phosphor-icons/react';
import { cn } from '@/core/utils/cn';

interface DivisionListProps {
  type: 'juz' | 'hizb';
}

// DivisionList renders a grid of juz (30) or hizb (60) navigation tiles.
export const DivisionList = ({ type }: DivisionListProps) => {
  const { t, lang } = useTranslation();
  const router = useRouter();
  const count = type === 'juz' ? 30 : 60;

  const handleClick = (num: number) => {
    router.push(`/?${type}=${num}`);
  };

  const Icon = type === 'juz' ? SelectionBackground : Hash;
  const title = type === 'juz' ? t('juz') : t('hizb');

  const toArabicNumeral = (num: number): string => {
    if (lang !== 'ar') return String(num);
    const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num
      .toString()
      .split('')
      .map((d) => digits[parseInt(d, 10)])
      .join('');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h2>
        <span className="rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-bold tabular-nums text-muted-foreground">
          1–{count}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4 pb-8">
        {Array.from({ length: count }).map((_, i) => {
          const num = i + 1;
          const textLabel =
            type === 'juz'
              ? t('juzNumber').replace('{{number}}', String(num))
              : t('hizbNumber').replace('{{number}}', String(num));
          const numLabel = toArabicNumeral(num);

          return (
            <button
              key={num}
              type="button"
              onClick={() => handleClick(num)}
              className={cn(
                'group flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/70 bg-card p-4 text-center shadow-sm',
                'transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-gradient-to-br hover:from-primary/[0.06] hover:to-card hover:shadow-md',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 sm:gap-3 sm:p-5'
              )}
            >
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15 transition-colors group-hover:bg-primary/15 sm:size-14">
                <Icon weight="fill" className="text-xl sm:text-2xl" />
              </div>
              <span className="text-[11px] font-black tabular-nums text-primary/90 sm:text-xs">{numLabel}</span>
              <h3 className="text-xs font-bold leading-tight text-foreground sm:text-sm">{textLabel}</h3>
            </button>
          );
        })}
      </div>
    </div>
  );
};
