import prisma from '@/lib/prisma';

export interface AdSettings {
  // Leaderboard (Top Header Ad)
  leaderboardEnabled: boolean;
  leaderboardType: 'image' | 'script';
  leaderboardImage: string;
  leaderboardLink: string;
  leaderboardTitle: string;
  leaderboardScript: string;

  // Sidebar Ad
  sidebarEnabled: boolean;
  sidebarType: 'image' | 'script';
  sidebarImage: string;
  sidebarLink: string;
  sidebarTitle: string;
  sidebarScript: string;

  // Mid Banner Ad
  midBannerEnabled: boolean;
  midBannerType: 'image' | 'script';
  midBannerImage: string;
  midBannerLink: string;
  midBannerTitle: string;
  midBannerScript: string;

  // In-Article Body Content Ad
  inArticleEnabled: boolean;
  inArticleType: 'image' | 'script';
  inArticleImage: string;
  inArticleLink: string;
  inArticleTitle: string;
  inArticleScript: string;

  // Left Outer Skyscraper Ad
  leftSkyscraperEnabled: boolean;
  leftSkyscraperType: 'image' | 'script';
  leftSkyscraperImage: string;
  leftSkyscraperLink: string;
  leftSkyscraperTitle: string;
  leftSkyscraperScript: string;

  // Right Outer Skyscraper Ad
  rightSkyscraperEnabled: boolean;
  rightSkyscraperType: 'image' | 'script';
  rightSkyscraperImage: string;
  rightSkyscraperLink: string;
  rightSkyscraperTitle: string;
  rightSkyscraperScript: string;

  // Before-Footer Pre-Footer Banner Ad (Slot 7)
  footerBannerEnabled: boolean;
  footerBannerType: 'image' | 'script';
  footerBannerImage: string;
  footerBannerLink: string;
  footerBannerTitle: string;
  footerBannerScript: string;

  // Google AdSense
  adsenseId: string;
}

export const DEFAULT_AD_SETTINGS: AdSettings = {
  leaderboardEnabled: false,
  leaderboardType: 'image',
  leaderboardImage: '',
  leaderboardLink: '',
  leaderboardTitle: 'Sponsored Partner',
  leaderboardScript: '',

  sidebarEnabled: false,
  sidebarType: 'image',
  sidebarImage: '',
  sidebarLink: '',
  sidebarTitle: 'Sponsored Partner',
  sidebarScript: '',

  midBannerEnabled: false,
  midBannerType: 'image',
  midBannerImage: '',
  midBannerLink: '',
  midBannerTitle: 'Sponsored Partner',
  midBannerScript: '',

  inArticleEnabled: false,
  inArticleType: 'image',
  inArticleImage: '',
  inArticleLink: '',
  inArticleTitle: 'Sponsored Partner',
  inArticleScript: '',

  leftSkyscraperEnabled: false,
  leftSkyscraperType: 'image',
  leftSkyscraperImage: '',
  leftSkyscraperLink: '',
  leftSkyscraperTitle: 'Sponsored Partner',
  leftSkyscraperScript: '',

  rightSkyscraperEnabled: false,
  rightSkyscraperType: 'image',
  rightSkyscraperImage: '',
  rightSkyscraperLink: '',
  rightSkyscraperTitle: 'Sponsored Partner',
  rightSkyscraperScript: '',

  footerBannerEnabled: false,
  footerBannerType: 'image',
  footerBannerImage: '',
  footerBannerLink: '',
  footerBannerTitle: 'Sponsored Pre-Footer Partner',
  footerBannerScript: '',

  adsenseId: '',
};

// Fast In-Memory Cache (Eliminates redundant DB roundtrips on every request)
let cachedSettings: AdSettings | null = null;
let cacheExpiry: number = 0;
const CACHE_TTL_MS = 15000; // 15 seconds TTL

export function invalidateAdSettingsCache() {
  cachedSettings = null;
  cacheExpiry = 0;
}

export async function getAdSettings(): Promise<AdSettings> {
  const now = Date.now();
  if (cachedSettings && now < cacheExpiry) {
    return cachedSettings;
  }

  const isDbEnabled = process.env.ENABLE_DB_PRISMA === 'true' || Boolean(process.env.DATABASE_URL);

  if (!isDbEnabled) return DEFAULT_AD_SETTINGS;

  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          startsWith: 'ads.',
        },
      },
    });

    const kv: Record<string, string> = {};
    for (const s of settings) {
      kv[s.key] = s.value;
    }

    const result: AdSettings = {
      leaderboardEnabled: kv['ads.leaderboard_enabled'] === 'true',
      leaderboardType: (kv['ads.leaderboard_type'] as 'image' | 'script') || 'image',
      leaderboardImage: kv['ads.leaderboard_image'] || '',
      leaderboardLink: kv['ads.leaderboard_link'] || '',
      leaderboardTitle: kv['ads.leaderboard_title'] || 'Sponsored Partner',
      leaderboardScript: kv['ads.leaderboard_script'] || '',

      sidebarEnabled: kv['ads.sidebar_enabled'] === 'true',
      sidebarType: (kv['ads.sidebar_type'] as 'image' | 'script') || 'image',
      sidebarImage: kv['ads.sidebar_image'] || '',
      sidebarLink: kv['ads.sidebar_link'] || '',
      sidebarTitle: kv['ads.sidebar_title'] || 'Sponsored Partner',
      sidebarScript: kv['ads.sidebar_script'] || '',

      midBannerEnabled: kv['ads.mid_banner_enabled'] === 'true',
      midBannerType: (kv['ads.mid_banner_type'] as 'image' | 'script') || 'image',
      midBannerImage: kv['ads.mid_banner_image'] || '',
      midBannerLink: kv['ads.mid_banner_link'] || '',
      midBannerTitle: kv['ads.mid_banner_title'] || 'Sponsored Partner',
      midBannerScript: kv['ads.mid_banner_script'] || '',

      inArticleEnabled: kv['ads.in_article_enabled'] === 'true',
      inArticleType: (kv['ads.in_article_type'] as 'image' | 'script') || 'image',
      inArticleImage: kv['ads.in_article_image'] || '',
      inArticleLink: kv['ads.in_article_link'] || '',
      inArticleTitle: kv['ads.in_article_title'] || 'Sponsored Partner',
      inArticleScript: kv['ads.in_article_script'] || '',

      leftSkyscraperEnabled: kv['ads.left_skyscraper_enabled'] === 'true',
      leftSkyscraperType: (kv['ads.left_skyscraper_type'] as 'image' | 'script') || 'image',
      leftSkyscraperImage: kv['ads.left_skyscraper_image'] || '',
      leftSkyscraperLink: kv['ads.left_skyscraper_link'] || '',
      leftSkyscraperTitle: kv['ads.left_skyscraper_title'] || 'Sponsored Partner',
      leftSkyscraperScript: kv['ads.left_skyscraper_script'] || '',

      rightSkyscraperEnabled: kv['ads.right_skyscraper_enabled'] === 'true',
      rightSkyscraperType: (kv['ads.right_skyscraper_type'] as 'image' | 'script') || 'image',
      rightSkyscraperImage: kv['ads.right_skyscraper_image'] || '',
      rightSkyscraperLink: kv['ads.right_skyscraper_link'] || '',
      rightSkyscraperTitle: kv['ads.right_skyscraper_title'] || 'Sponsored Partner',
      rightSkyscraperScript: kv['ads.right_skyscraper_script'] || '',

      footerBannerEnabled: kv['ads.footer_banner_enabled'] === 'true',
      footerBannerType: (kv['ads.footer_banner_type'] as 'image' | 'script') || 'image',
      footerBannerImage: kv['ads.footer_banner_image'] || '',
      footerBannerLink: kv['ads.footer_banner_link'] || '',
      footerBannerTitle: kv['ads.footer_banner_title'] || 'Sponsored Pre-Footer Partner',
      footerBannerScript: kv['ads.footer_banner_script'] || '',

      adsenseId: kv['ads.adsense_id'] || '',
    };

    cachedSettings = result;
    cacheExpiry = now + CACHE_TTL_MS;
    return result;
  } catch {
    return DEFAULT_AD_SETTINGS;
  }
}
