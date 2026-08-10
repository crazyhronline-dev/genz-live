// GenZ Live — Site Configuration

export const SITE_CONFIG = {
  name: 'GenZ Live',
  tagline: 'The Voice of GenZ',
  domain: 'https://genz-live.com',
  description:
    'GenZ Live is a global digital news and media platform covering World, India, Technology, AI, Business, Markets, Entertainment, Sports, Culture and Trending news.',
  youtube: {
    channel: 'GenZ Live',
    handle: '@genz-live-official',
    url: 'https://youtube.com/@genz-live-official',
    subscribers: '148K',
  },
  social: {
    instagram: 'https://instagram.com/genzliveofficial',
    facebook: 'https://facebook.com/genzliveofficial',
  },
} as const;

export const NAV_CATEGORIES = [
  { id: 'all',           name: 'All Feed',      icon: 'Sparkles'   },
  { id: 'trending',      name: '🔥 Trending',    icon: 'Flame'      },
  { id: 'tech',          name: '💻 Tech',         icon: 'Cpu'        },
  { id: 'ai',            name: '🤖 AI',           icon: 'Bot'        },
  { id: 'india',         name: '🇮🇳 India',       icon: 'Globe'      },
  { id: 'world',         name: '🌍 World',        icon: 'Globe2'     },
  { id: 'business',      name: '💼 Business',     icon: 'Briefcase'  },
  { id: 'markets',       name: '📈 Markets',      icon: 'TrendingUp' },
  { id: 'entertainment', name: '🎬 Entertainment', icon: 'Film'      },
  { id: 'sports',        name: '⚽ Sports',        icon: 'Trophy'     },
  { id: 'culture',       name: '🎨 Culture',       icon: 'Palette'   },
] as const;

export const BRAND_ASSETS = {
  logoLarge:   '/brand/06_Website_Logo_1200x400.png',
  logoMedium:  '/brand/07_Website_Logo_600x200.png',
  logoSmall:   '/brand/08_Website_Logo_300x100.png',
  masterSq:    '/brand/logo_square.png',
  ytBanner:    '/brand/02_YouTube_Banner_2560x1440.png',
  ytProfile:   '/brand/logo_square.png',
  igProfile:   '/brand/logo_square.png',
  fbProfile:   '/brand/logo_square.png',
  fbCover:     '/brand/05_Facebook_Cover_1640x856.png',
} as const;
