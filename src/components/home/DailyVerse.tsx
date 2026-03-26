import { useTranslation } from '@/core/hooks/useTranslation';
import { Quotes } from '@phosphor-icons/react';

export const DailyVerse = () => {
  const { t } = useTranslation();

  return (
    <section className="mt-4 mb-12 bg-primary/5 rounded-3xl p-8 border border-primary/10 !text-center">
      <Quotes className="text-primary text-4xl mb-4 block" weight="regular" />
      <p className="text-xl md:text-2xl font-medium leading-relaxed mb-6 font-arabic" dir="rtl">
        "وَاسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ وَإِنَّهَا لَكَبِيرَةٌ إِلَّا عَلَى الْخَاشِعِينَ"
      </p>
      <p className="text-primary font-bold text-sm">سورة البقرة • آية ٤٥</p>
    </section>
  );
};
