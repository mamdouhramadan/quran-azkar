import { useTranslation } from '@/core/hooks/useTranslation';
import { ArrowsClockwise, WarningCircle } from '@phosphor-icons/react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  icon?: React.ReactNode;
  compact?: boolean;
}

export const ErrorState = ({ message, onRetry, icon = <WarningCircle weight="regular" />, compact = false }: ErrorStateProps) => {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div className="flex items-center gap-2 !text-center justify-center py-4 text-destructive">
        <div className="text-lg flex items-center">{icon}</div>
        <span className="text-sm font-medium">{message || t('failedToLoad')}</span>
        {onRetry && (
          <button onClick={onRetry} className="text-primary text-sm font-bold hover:underline">
            {t('retry')}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-card border border-primary/10 p-8 !text-center">
      <div className="text-4xl text-destructive/50 mb-3 flex justify-center">{icon}</div>
      <p className="text-foreground font-bold text-sm mb-1">{message || t('failedToLoad')}</p>
      <p className="text-muted-foreground text-xs mb-4">{t('errorHint')}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-5 py-2 text-sm font-bold hover:bg-primary/90 transition-colors"
        >
          <ArrowsClockwise className="text-lg" weight="regular" />
          {t('retry')}
        </button>
      )}
    </div>
  );
};
