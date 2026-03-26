"use client";

import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { useTranslation } from '@/core/hooks/useTranslation';
import { BookOpen } from '@phosphor-icons/react';
import { Breadcrumb } from '@/components/Breadcrumb';

const duas = [
  {
    id: 1,
    title: 'دعاء ختم القرآن الكريم',
    text: 'اللَّهُمَّ ارْحَمْنِي بِالقُرْآنِ وَاجْعَلْهُ لِي إِمَامًا وَنُورًا وَهُدًى وَرَحْمَةً، اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نَسِيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ وَارْزُقْنِي تِلَاوَتَهُ آنَاءَ اللَّيْلِ وَأَطْرَافَ النَّهَارِ وَاجْعَلْهُ لِي حُجَّةً يَا رَبَّ العَالَمِينَ.',
  },
  {
    id: 2,
    title: 'دعاء الانتفاع بالقرآن',
    text: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي، وَعَلِّمْنِي مَا يَنْفَعُنِي، وَزِدْنِي عِلْمًا، الحَمْدُ لِلَّهِ عَلَى كُلِّ حَالٍ، وَأَعُوذُ بِاللَّهِ مِنْ حَالِ أَهْلِ النَّارِ.',
  },
  {
    id: 3,
    title: 'دعاء جعل القرآن ربيع القلب',
    text: 'اللَّهُمَّ اجْعَلِ القُرْآنَ رَبِيعَ قَلْبِي، وَنُورَ صَدْرِي، وَجَلَاءَ حُزْنِي، وَذَهَابَ هَمِّي وَغَمِّي.',
  },
  {
    id: 4,
    title: 'دعاء حفظ القرآن والعمل به',
    text: 'اللَّهُمَّ اجْعَلْنِي مِمَّنْ يَقْرَأُ القُرْآنَ فَيَرْقَى، وَلَا تَجْعَلْنِي مِمَّنْ يَقْرَأُ القُرْآنَ فَيُشْقَى، اللَّهُمَّ اجْعَلِ القُرْآنَ شَافِعًا لَنَا، وَاجْعَلْهُ لَنَا نُورًا وَهُدًى وَرَحْمَةً.',
  },
  {
    id: 5,
    title: 'دعاء الشفاعة بالقرآن',
    text: 'اللَّهُمَّ اجْعَلِ القُرْآنَ العَظِيمَ شَفِيعًا لَنَا يَوْمَ القِيَامَةِ، وَاجْعَلْهُ لَنَا سَائِقًا إِلَى الجَنَّةِ، وَاجْعَلْهُ لَنَا حِرْزًا مِنَ النَّارِ.',
  },
  {
    id: 6,
    title: 'دعاء رفع الدرجات بالقرآن',
    text: 'اللَّهُمَّ ارْفَعْ دَرَجَاتِنَا بِالقُرْآنِ، وَأَنْقِذْنَا بِهِ مِنَ النَّارِ، وَأَدْخِلْنَا بِهِ الجَنَّةَ، اللَّهُمَّ اجْعَلِ القُرْآنَ لَنَا فِي الدُّنْيَا قَرِينًا وَفِي القَبْرِ مُونِسًا وَعَلَى الصِّرَاطِ نُورًا.',
  },
  {
    id: 7,
    title: 'دعاء ختم عام',
    text: 'صَدَقَ اللَّهُ العَظِيمُ، اللَّهُمَّ لَكَ الحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ وَعَظِيمِ سُلْطَانِكَ، اللَّهُمَّ تَقَبَّلْ مِنَّا خَتْمَ القُرْآنِ، وَاجْعَلْهُ خَالِصًا لِوَجْهِكَ الكَرِيمِ، وَاغْفِرْ لَنَا مَا أَخْطَأْنَا فِيهِ وَمَا قَصَّرْنَا.',
  },
];

// DuaKhatmPage presents a curated set of duas for completing Quran recitation.
export default function DuaKhatmPage() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <TopBar
        selectedSurah={null}
        onSurahChange={() => {}}
        showSurahSelector={false}
        onBackClick={() => router.push('/quran')}
      />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8 w-full border-b border-border pb-4">
          <h1 className="text-xl font-bold tracking-tight">{t('duaKhatmTitle')}</h1>
          <Breadcrumb items={[{ label: t('duaKhatmTitle') }]} />
        </div>

        <div className="flex items-center gap-3 mb-8">
          <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen className="text-3xl" weight="regular" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">{t('duaKhatmDesc')}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {duas.map((dua) => (
            <div
              key={dua.id}
              className="relative rounded-2xl bg-card border border-border p-6 flex flex-col gap-4 hover:ring-2 ring-primary/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                  {dua.id}
                </div>
                <h3 className="text-base font-bold">{dua.title}</h3>
              </div>
              <p className="text-lg leading-loose font-arabic text-foreground" style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif" }}>
                {dua.text}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
