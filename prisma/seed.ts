/**
 * GenZ Live — Development Seed Script
 * ------------------------------------
 * Purpose: Establish the foundational database structure for development.
 * This seed creates ONLY structural/configuration data — no fake articles.
 *
 * Run: npm run prisma:seed
 */

import { PrismaClient, UserRole } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Simple dev-only password hash (use bcrypt in production auth)
function devHash(plain: string): string {
  return crypto.createHash('sha256').update(plain).digest('hex');
}

// ----------------------------------------------------------------
// CATEGORIES — Mirrors NAV_CATEGORIES in config/site.ts
// ----------------------------------------------------------------
const CATEGORIES = [
  { slug: 'trending',      name: '🔥 Trending',      icon: '🔥', color: '#f97316', sortOrder: 1 },
  { slug: 'tech',          name: '💻 Technology',     icon: '💻', color: '#3b82f6', sortOrder: 2 },
  { slug: 'ai',            name: '🤖 AI',             icon: '🤖', color: '#8b5cf6', sortOrder: 3 },
  { slug: 'india',         name: '🇮🇳 India',         icon: '🇮🇳', color: '#f59e0b', sortOrder: 4 },
  { slug: 'world',         name: '🌍 World',           icon: '🌍', color: '#06b6d4', sortOrder: 5 },
  { slug: 'business',      name: '💼 Business',       icon: '💼', color: '#10b981', sortOrder: 6 },
  { slug: 'markets',       name: '📈 Markets',         icon: '📈', color: '#22c55e', sortOrder: 7 },
  { slug: 'entertainment', name: '🎬 Entertainment',  icon: '🎬', color: '#ec4899', sortOrder: 8 },
  { slug: 'sports',        name: '⚽ Sports',          icon: '⚽', color: '#ef4444', sortOrder: 9 },
  { slug: 'culture',       name: '🎨 Culture',         icon: '🎨', color: '#a78bfa', sortOrder: 10 },
];

// ----------------------------------------------------------------
// DEFAULT SITE SETTINGS
// ----------------------------------------------------------------
const SITE_SETTINGS = [
  // General
  { key: 'site.name',            value: 'GenZ Live',                                group: 'general',  description: 'Site display name' },
  { key: 'site.tagline',         value: 'The Voice of GenZ',                        group: 'general',  description: 'Site tagline' },
  { key: 'site.domain',          value: 'https://genz-live.com',                    group: 'general',  description: 'Primary domain URL' },
  { key: 'site.contact_email',   value: 'hello@genz-live.com',                      group: 'general',  description: 'Public contact email' },
  // SEO
  { key: 'seo.meta_description', value: 'GenZ Live is a global digital news and media platform covering World, India, Technology, AI, Business, Markets, Entertainment, Sports, Culture and Trending news.', group: 'seo', description: 'Default meta description' },
  { key: 'seo.og_image',         value: '/brand/MASTER_SQUARE_2000x2000.png',       group: 'seo',      description: 'Default OpenGraph image' },
  { key: 'seo.twitter_handle',   value: '@genzliveofficial',                        group: 'seo',      description: 'Twitter/X handle' },
  // Social
  { key: 'social.youtube',       value: 'https://youtube.com/@genz-live-official',  group: 'social',   description: 'YouTube channel URL' },
  { key: 'social.instagram',     value: 'https://instagram.com/genzliveofficial',   group: 'social',   description: 'Instagram URL' },
  { key: 'social.facebook',      value: 'https://facebook.com/genzliveofficial',    group: 'social',   description: 'Facebook URL' },
  // Ads
  { key: 'ads.adsense_id',       value: '',                                         group: 'ads',      description: 'Google AdSense publisher ID' },
  { key: 'ads.enabled',          value: 'false',                                    group: 'ads',      description: 'Enable/disable all ad slots' },
  // Newsletter
  { key: 'newsletter.enabled',   value: 'true',                                     group: 'newsletter', description: 'Enable newsletter subscription' },
  // Breaking News
  { key: 'breaking.enabled',     value: 'true',                                     group: 'breaking', description: 'Show breaking news ticker' },
];

// ----------------------------------------------------------------
// SEED TAGS — Common news tags
// ----------------------------------------------------------------
const TAGS = [
  { slug: 'artificial-intelligence', name: 'Artificial Intelligence' },
  { slug: 'machine-learning',        name: 'Machine Learning' },
  { slug: 'startups',                name: 'Startups' },
  { slug: 'crypto',                  name: 'Crypto' },
  { slug: 'climate',                 name: 'Climate' },
  { slug: 'elections',               name: 'Elections' },
  { slug: 'economy',                 name: 'Economy' },
  { slug: 'social-media',            name: 'Social Media' },
  { slug: 'gaming',                  name: 'Gaming' },
  { slug: 'cinema',                  name: 'Cinema' },
  { slug: 'space',                   name: 'Space' },
  { slug: 'health',                  name: 'Health' },
  { slug: 'cybersecurity',           name: 'Cybersecurity' },
  { slug: 'india-economy',           name: 'India Economy' },
  { slug: 'geopolitics',             name: 'Geopolitics' },
];

async function main() {
  console.log('🌱 Starting GenZ Live database seed...\n');

  // ---------------------------------------------------------------
  // 1. Seed Categories
  // ---------------------------------------------------------------
  console.log('📁 Seeding categories...');
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, color: cat.color, sortOrder: cat.sortOrder },
      create: {
        slug:        cat.slug,
        name:        cat.name,
        icon:        cat.icon,
        color:       cat.color,
        sortOrder:   cat.sortOrder,
        isActive:    true,
      },
    });
  }
  console.log(`   ✓ ${CATEGORIES.length} categories seeded\n`);

  // ---------------------------------------------------------------
  // 2. Seed Tags
  // ---------------------------------------------------------------
  console.log('🏷️  Seeding tags...');
  for (const tag of TAGS) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: { slug: tag.slug, name: tag.name },
    });
  }
  console.log(`   ✓ ${TAGS.length} tags seeded\n`);

  // ---------------------------------------------------------------
  // 3. Seed Default Admin User (development only)
  // ---------------------------------------------------------------
  console.log('👤 Seeding dev admin user...');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@genz-live.com' },
    update: {},
    create: {
      email:    'admin@genz-live.com',
      password: devHash('dev-admin-2026'),  // CHANGE before production
      name:     'GenZ Live Admin',
      role:     UserRole.SUPER_ADMIN,
      isActive: true,
    },
  });
  console.log(`   ✓ Admin: ${adminUser.email} (role: ${adminUser.role})`);
  console.log('   ⚠️  IMPORTANT: Change admin password before connecting to production DB\n');

  // ---------------------------------------------------------------
  // 4. Seed Dev Editor User
  // ---------------------------------------------------------------
  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@genz-live.com' },
    update: {},
    create: {
      email:    'editor@genz-live.com',
      password: devHash('dev-editor-2026'), // CHANGE before production
      name:     'GenZ Live Editor',
      role:     UserRole.EDITOR,
      isActive: true,
    },
  });
  console.log(`   ✓ Editor: ${editorUser.email} (role: ${editorUser.role})\n`);

  // ---------------------------------------------------------------
  // 5. Seed Dev Author Profile
  // ---------------------------------------------------------------
  console.log('✍️  Seeding dev author...');
  await prisma.author.upsert({
    where: { slug: 'genzlive-desk' },
    update: {},
    create: {
      slug:     'genzlive-desk',
      name:     'GenZ Live Desk',
      bio:      'The GenZ Live editorial team. Breaking news, live updates, and in-depth coverage.',
      email:    'desk@genz-live.com',
      isActive: true,
      userId:   editorUser.id,
    },
  });
  console.log('   ✓ Author: GenZ Live Desk\n');

  // ---------------------------------------------------------------
  // 6. Seed Default Site Settings
  // ---------------------------------------------------------------
  console.log('⚙️  Seeding site settings...');
  for (const setting of SITE_SETTINGS) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { description: setting.description, group: setting.group },
      create: {
        key:         setting.key,
        value:       setting.value,
        description: setting.description,
        group:       setting.group,
        updatedById: adminUser.id,
      },
    });
  }
  console.log(`   ✓ ${SITE_SETTINGS.length} settings seeded\n`);

  // ---------------------------------------------------------------
  // 7. Seed Sample Breaking News Items (dev only)
  // ---------------------------------------------------------------
  console.log('🔴 Seeding breaking news placeholders...');
  await prisma.breakingNews.upsert({
    where: { id: 'breaking-dev-1' },
    update: {},
    create: {
      id:       'breaking-dev-1',
      text:     'Welcome to GenZ Live — Your development seed is running correctly.',
      category: 'System',
      isActive: true,
      sortOrder: 1,
    },
  });
  console.log('   ✓ Breaking news placeholder seeded\n');

  // ---------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------
  const counts = await Promise.all([
    prisma.category.count(),
    prisma.tag.count(),
    prisma.user.count(),
    prisma.author.count(),
    prisma.siteSetting.count(),
    prisma.article.count(),
  ]);

  console.log('═══════════════════════════════════════');
  console.log('✅ Seed complete! Database summary:');
  console.log(`   Categories:       ${counts[0]}`);
  console.log(`   Tags:             ${counts[1]}`);
  console.log(`   Users:            ${counts[2]}`);
  console.log(`   Authors:          ${counts[3]}`);
  console.log(`   Site Settings:    ${counts[4]}`);
  console.log(`   Articles:         ${counts[5]} (none — publish via CMS)`);
  console.log('═══════════════════════════════════════\n');
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
