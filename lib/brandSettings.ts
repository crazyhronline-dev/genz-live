import prisma from '@/lib/prisma';

export interface BrandSettings {
  headerLogoUrl: string;
  headerLogoHeight: number; // in pixels
  headerLogoWidth: number; // in pixels (0 = auto)
  headerHeight: number; // custom header bar height in pixels (0 = auto)
  headerTemplate: 'classic' | 'slim' | 'newsroom' | 'minimal';
  adminLogoUrl: string;
  adminLogoHeight: number;
  adminLogoWidth: number;
  faviconUrl: string;
}

export const DEFAULT_BRAND_SETTINGS: BrandSettings = {
  headerLogoUrl: '/brand/06_Website_Logo_1200x400.png',
  headerLogoHeight: 52,
  headerLogoWidth: 0, // auto
  headerHeight: 56, // default 56px height
  headerTemplate: 'classic',
  adminLogoUrl: '/brand/06_Website_Logo_1200x400.png',
  adminLogoHeight: 56,
  adminLogoWidth: 0,
  faviconUrl: '/brand/logo_square.png',
};

export async function getBrandSettings(): Promise<BrandSettings> {
  const isDbEnabled = process.env.ENABLE_DB_PRISMA === 'true' || Boolean(process.env.DATABASE_URL);
  if (!isDbEnabled) return DEFAULT_BRAND_SETTINGS;

  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            'brand.header_logo_url',
            'brand.header_logo_height',
            'brand.header_logo_width',
            'brand.header_height',
            'brand.header_template',
            'brand.admin_logo_url',
            'brand.admin_logo_height',
            'brand.admin_logo_width',
            'brand.favicon_url',
          ],
        },
      },
    });

    const map = new Map(settings.map(s => [s.key, s.value]));

    const rawTemplate = map.get('brand.header_template') || DEFAULT_BRAND_SETTINGS.headerTemplate;
    const validTemplates = ['classic', 'slim', 'newsroom', 'minimal'];
    const headerTemplate = (validTemplates.includes(rawTemplate) ? rawTemplate : 'classic') as BrandSettings['headerTemplate'];

    return {
      headerLogoUrl: map.get('brand.header_logo_url') || DEFAULT_BRAND_SETTINGS.headerLogoUrl,
      headerLogoHeight: Math.min(Math.max(parseInt(map.get('brand.header_logo_height') || String(DEFAULT_BRAND_SETTINGS.headerLogoHeight), 10) || 52, 24), 56),
      headerLogoWidth: parseInt(map.get('brand.header_logo_width') || String(DEFAULT_BRAND_SETTINGS.headerLogoWidth), 10),
      headerHeight: Math.min(Math.max(parseInt(map.get('brand.header_height') || String(DEFAULT_BRAND_SETTINGS.headerHeight), 10) || 56, 40), 72),
      headerTemplate,
      adminLogoUrl: map.get('brand.admin_logo_url') || DEFAULT_BRAND_SETTINGS.adminLogoUrl,
      adminLogoHeight: Math.min(Math.max(parseInt(map.get('brand.admin_logo_height') || String(DEFAULT_BRAND_SETTINGS.adminLogoHeight), 10) || 56, 24), 80),
      adminLogoWidth: parseInt(map.get('brand.admin_logo_width') || String(DEFAULT_BRAND_SETTINGS.adminLogoWidth), 10),
      faviconUrl: map.get('brand.favicon_url') || DEFAULT_BRAND_SETTINGS.faviconUrl,
    };
  } catch {
    return DEFAULT_BRAND_SETTINGS;
  }
}
