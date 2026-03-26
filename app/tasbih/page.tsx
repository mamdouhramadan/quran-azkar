"use client";

import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { Tasbih } from '@/components/home/Tasbih';
import { Breadcrumb } from '@/components/Breadcrumb';

// TasbihPage hosts the dedicated electronic tasbih experience.
export default function TasbihPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <TopBar
        selectedSurah={null}
        onSurahChange={() => {}}
        showSurahSelector={false}
        onBackClick={() => router.push('/')}
      />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8 w-full border-b border-border pb-4">
          <h1 className="text-xl font-bold tracking-tight">السبحة الإلكترونية</h1>
          <Breadcrumb items={[{ label: 'السبحة الإلكترونية' }]} />
        </div>
        <Tasbih />
      </main>
    </div>
  );
}
