import { BookOpen, FacebookLogo, GithubLogo, TwitterLogo } from '@phosphor-icons/react';
import { SITE_CONFIG } from '@/config/siteConfig';

type BrandIcon = typeof BookOpen;

const SOCIAL_ICONS: Record<(typeof SITE_CONFIG.socialLinks)[number]['icon'], BrandIcon> = {
  twitter: TwitterLogo,
  github: GithubLogo,
  facebook: FacebookLogo,
};

// APP_BRAND combines editable site content with UI-only icon choices.
export const APP_BRAND = {
  ...SITE_CONFIG,
  LogoIcon: BookOpen,
  socialLinks: SITE_CONFIG.socialLinks.map((social) => ({
    ...social,
    icon: SOCIAL_ICONS[social.icon],
  })),
} as const;
