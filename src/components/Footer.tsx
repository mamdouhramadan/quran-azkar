"use client";

import { APP_BRAND } from '@/components/config/appBrand';
import { useTranslation } from '@/core/hooks/useTranslation';
import { cn } from '@/core/utils/cn';

// Footer renders the app's brand links, social links, and legal metadata.
export const Footer = () => {
  const { t, lang } = useTranslation();
  const brandFont = lang === 'ar' ? 'font-brand-ar' : 'font-brand-en';

  return (
    <footer className="mt-10 w-full rounded-t-[2.5rem] border-t border-primary/10 bg-card pb-32 pt-12">
      <div className="container flex flex-col items-center justify-between gap-10 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <div className="flex items-center gap-3 text-primary">
            <APP_BRAND.LogoIcon weight="fill" className="text-4xl drop-shadow-sm" />
            <span
              className={cn(brandFont, 'text-2xl font-bold tracking-tight md:text-3xl', lang === 'ar' && 'leading-tight')}
            >
              {t('brandWordmark')}
            </span>
          </div>
          <p className="max-w-sm text-center text-sm leading-relaxed text-muted-foreground md:text-start">
            {t('brandDescription')}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 md:items-end">
          <div className="flex items-center gap-3">
            {APP_BRAND.socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all hover:bg-primary hover:text-primary-foreground"
              >
                <social.icon weight="fill" className="text-2xl" />
                <span className="sr-only">{social.label}</span>
              </a>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground md:items-end">
            <p className="text-center md:text-end">
               © {APP_BRAND.copyright.year}{' '}
              <a
                href={APP_BRAND.copyright.ownerUrl}
                className={cn(brandFont, 'font-semibold hover:text-primary transition-colors')}
              >
                {t('brandCopyrightOwner')}
              </a>
              . {t('footerRights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
