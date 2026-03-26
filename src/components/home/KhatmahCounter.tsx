import { useTranslation } from '@/core/hooks/useTranslation';
import { Progress } from '@/components/ui/progress';
import { useKhatmahStore, TOTAL_PAGES } from '@/core/store/khatmahStore';
import { BookOpen, Minus, Plus } from '@phosphor-icons/react';

export const KhatmahCounter = () => {
  const { t } = useTranslation();
  const { completedCount, currentPage, increment, decrement, resetCurrent } = useKhatmahStore();

  const progress = Math.round((currentPage / TOTAL_PAGES) * 100);

  return (
    <section className="h-full">
      <div className="rounded-3xl bg-card border border-primary/10 p-8 shadow-sm h-full flex flex-col justify-center">
        <h2 className="text-xl font-black tracking-tight mb-6">{t('khatmahTracker')}</h2>
        {/* Completed count */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <BookOpen className="text-2xl" weight="regular" />
          </div>
          <div className="!text-center">
            <p className="text-4xl font-black text-primary">{completedCount}</p>
            <p className="text-sm text-muted-foreground">{t('completedKhatmat')}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-muted-foreground">{t('currentProgress')}</span>
            <span className="font-bold">{currentPage} / {TOTAL_PAGES} {t('pages')}</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-xs text-muted-foreground mt-1 !text-center">{progress}%</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={decrement}
            disabled={currentPage === 0}
            className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-40"
          >
            <Minus className="text-xl" weight="regular" />
          </button>

          <button
            onClick={increment}
            className="flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-2.5 font-bold hover:bg-primary/90 transition-colors"
          >
            <Plus className="text-xl" weight="regular" />
            {t('addPage')}
          </button>

          <button
            onClick={decrement}
            disabled={currentPage === 0}
            className="flex size-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-40 invisible"
            aria-hidden="true"
          >
            <Minus className="text-xl" weight="regular" />
          </button>
        </div>

        {/* Reset */}
        {currentPage > 0 && (
          <button
            onClick={resetCurrent}
            className="mt-3 mx-auto block text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            {t('resetProgress')}
          </button>
        )}
      </div>
    </section>
  );
};
