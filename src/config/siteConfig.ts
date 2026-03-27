interface SiteLink {
  label: string;
  href: string;
}

export interface SocialConfigLink extends SiteLink {
  icon: 'twitter' | 'github' | 'facebook';
}

// SITE_CONFIG keeps site-wide editable brand copy and urls in one server-safe place.
export const SITE_CONFIG = {
  siteName: 'Quran Kareem',
  shortName: 'Quran Kareem',
  headerTagline: 'Quran, Azkar, prayer times & tasbih in one place',
  description:
    'Holy Quran with Azkar, prayer times, and digital tasbih — a calm spiritual companion for your reading and dhikr.',
  copyright: {
    year: 2026,
    ownerName: 'Quran Kareem',
    ownerUrl: '#',
    rightsText: 'All rights reserved.',
  },
  socialLinks: [
    { label: 'Twitter', href: '#', icon: 'twitter' },
    { label: 'GitHub', href: '#', icon: 'github' },
    { label: 'Facebook', href: '#', icon: 'facebook' },
  ] satisfies SocialConfigLink[],
} as const;
