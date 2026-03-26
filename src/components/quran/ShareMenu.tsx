import { useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@/core/hooks/useTranslation';
import { ShareNetwork, Export, Copy, WhatsappLogo, TelegramLogo, XLogo } from '@phosphor-icons/react';

interface ShareMenuProps {
  text: string;
  surahName: string;
  ayahNumber: number;
}

export const ShareMenu = ({ text, surahName, ayahNumber }: ShareMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const shareText = `${text}\n\n— ${surahName} • ${t('ayahLabel')} ${ayahNumber}`;
  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator;

  // handleNativeShare uses the browser share sheet when the platform supports it.
  const handleNativeShare = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({ text: shareText });
      } catch {
        // user cancelled
      }
    }
    setIsOpen(false);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    setIsOpen(false);
  };

  const handleTelegram = () => {
    window.open(`https://t.me/share/url?text=${encodeURIComponent(shareText)}`, '_blank');
    setIsOpen(false);
  };

  const handleX = () => {
    window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
    setIsOpen(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    toast.success(t('copied'));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-muted-foreground hover:text-primary transition-colors"
      >
        <ShareNetwork className="text-xl" weight="regular" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-popover border border-primary/10 rounded-2xl shadow-lg p-2 flex gap-1 min-w-max animate-in fade-in zoom-in-95 duration-200">
            {canNativeShare && (
              <button
                onClick={(e) => { e.stopPropagation(); handleNativeShare(); }}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors min-w-[56px]"
              >
                <Export className="text-xl text-primary" weight="regular" />
                <span className="text-[10px] text-muted-foreground">{t('share')}</span>
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); handleWhatsApp(); }}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors min-w-[56px]"
            >
              <WhatsappLogo className="size-5 text-[#25D366]" weight="fill" />
              <span className="text-[10px] text-muted-foreground">WhatsApp</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleTelegram(); }}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors min-w-[56px]"
            >
              <TelegramLogo className="size-5 text-[#0088cc]" weight="fill" />
              <span className="text-[10px] text-muted-foreground">Telegram</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleX(); }}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors min-w-[56px]"
            >
              <XLogo className="size-5 text-foreground" weight="fill" />
              <span className="text-[10px] text-muted-foreground">X</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy(); }}
              className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-accent transition-colors min-w-[56px]"
            >
              <Copy className="text-xl text-muted-foreground" weight="regular" />
              <span className="text-[10px] text-muted-foreground">{t('copy')}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
