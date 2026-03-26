import { useTranslation } from '@/core/hooks/useTranslation';
import { useTasbihStore } from '@/core/store/tasbihStore';
import { ArrowsClockwise } from '@phosphor-icons/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const CYCLE_LENGTH = 33;

const toArabicNumeral = (num: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicDigits[parseInt(d)]).join('');
};

export const Tasbih = () => {
  const { count, increment, reset } = useTasbihStore();
  const { t, lang } = useTranslation();

  const displayCount = lang === 'ar' ? toArabicNumeral(count) : count.toString();
  const progress = (count % CYCLE_LENGTH) / CYCLE_LENGTH;
  const circumference = 2 * Math.PI * 58;
  const strokeDashoffset = circumference - progress * circumference;
  const remaining = CYCLE_LENGTH - (count % CYCLE_LENGTH);

  return (
    <section className="h-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-primary/5 border border-primary/10 p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 h-full">
        
        {/* Right side (RTL context) - Content */}
        <div className="flex-1 flex flex-col items-start text-right">
          <h3 className="mb-3 text-2xl font-black text-foreground">{t('electronicTasbih')}</h3>
          <p className="mb-6 text-muted-foreground">{t('tasbihDesc')}</p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={increment}
              className="rounded-xl bg-primary px-8 py-3.5 font-bold text-primary-foreground transition-transform active:scale-95 shadow-md shadow-primary/20"
            >
              {t('tasbihButton')}
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors hover:bg-muted/80">
                  <ArrowsClockwise weight="bold" className="text-xl" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-right">{t('resetCounter')}</AlertDialogTitle>
                  <AlertDialogDescription className="text-right">
                    {t('resetConfirmMsg')} {t('resetConfirmCount')} ({displayCount}) {t('willBeDeleted')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex gap-2 sm:justify-start">
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={reset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {t('reset')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {count > 0 && (
             <p className="mt-4 text-sm font-medium text-primary">
               {count % CYCLE_LENGTH === 0 ? t('completedCycle') : `${remaining} ${t('toCompleteCycle')}`}
             </p>
          )}
        </div>

        {/* Left side (RTL context) - Counter */}
        <div className="relative flex size-40 shrink-0 items-center justify-center rounded-full bg-primary/10 shadow-inner">
          <svg className="absolute inset-0 -rotate-90 size-full" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="6" className="text-primary/10" />
            <circle
              cx="64" cy="64" r="58" fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300 drop-shadow-sm"
            />
          </svg>
          <span className="text-5xl font-black text-primary drop-shadow-sm">{displayCount}</span>
        </div>
        
      </div>
    </section>
  );
};
