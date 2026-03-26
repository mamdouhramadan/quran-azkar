interface SiteLink {
  label: string;
  href: string;
}

export interface SocialConfigLink extends SiteLink {
  icon: 'twitter' | 'github' | 'facebook';
}

// SITE_CONFIG keeps site-wide editable brand copy and urls in one server-safe place.
export const SITE_CONFIG = {
  siteName: 'quran kareem',
  shortName: 'quran kareem',
  headerTagline: 'Quran, Azkar, and prayer times',
  description:
    'Quran Kareem with Azkar, prayer times, and tasbih in one calm spiritual companion.',
  copyright: {
    year: 2026,
    ownerName: 'quran kareem',
    ownerUrl: '#',
    rightsText: 'All rights reserved.',
  },
  socialLinks: [
    { label: 'Twitter', href: '#', icon: 'twitter' },
    { label: 'GitHub', href: '#', icon: 'github' },
    { label: 'Facebook', href: '#', icon: 'facebook' },
  ] satisfies SocialConfigLink[],
} as const;
