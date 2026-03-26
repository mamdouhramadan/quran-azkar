"use client";

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/core/hooks/useTranslation';
import { SelectionBackground, Hash } from '@phosphor-icons/react';

interface DivisionListProps {
  type: 'juz' | 'hizb';
}

export const DivisionList = ({ type }: DivisionListProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const count = type === 'juz' ? 30 : 60;
  
  const handleClick = (num: number) => {
    router.push(`/?${type}=${num}`);
  };

  const Icon = type === 'juz' ? SelectionBackground : Hash;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pb-12">
      {Array.from({ length: count }).map((_, i) => {
        const num = i + 1;
        const textLabel = type === 'juz' 
          ? t('juzNumber').replace('{{number}}', num.toString()) 
          : t('hizbNumber').replace('{{number}}', num.toString());
          
        return (
          <button
            key={i}
            onClick={() => handleClick(num)}
            className="flex flex-col items-center justify-center p-6 rounded-2xl border border-primary/10 bg-card hover:border-primary/30 hover:shadow-md transition-all gap-3"
          >
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Icon weight="fill" className="text-2xl" />
            </div>
            <h3 className="font-bold text-center">{textLabel}</h3>
          </button>
        );
      })}
    </div>
  );
};
