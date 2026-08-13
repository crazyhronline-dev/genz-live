// ================================================================
// GenZ Live — Social Distribution Formatting Engine
// Prepares copy-ready social posts with campaign UTM parameters.
// ================================================================

import { SITE_CONFIG } from '@/config/site';

export interface SocialDistributionPackage {
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  platforms: {
    x: { copy: string; utmUrl: string; charCount: number };
    facebook: { copy: string; utmUrl: string; charCount: number };
    instagram: { copy: string; utmUrl: string; charCount: number };
    telegram: { copy: string; utmUrl: string; charCount: number };
    whatsapp: { copy: string; utmUrl: string; charCount: number };
  };
}

export function generateSocialDistributionPackage(article: {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  category: { name: string; slug: string };
}): SocialDistributionPackage {
  const baseUrl = `${SITE_CONFIG.domain}/${article.category.slug}/${article.slug}`;
  const excerptText = article.excerpt || article.title;

  // Build platform UTM links
  const xUtm = `${baseUrl}?utm_source=x&utm_medium=social&utm_campaign=article`;
  const fbUtm = `${baseUrl}?utm_source=facebook&utm_medium=social&utm_campaign=article`;
  const igUtm = `${baseUrl}?utm_source=instagram&utm_medium=social&utm_campaign=article`;
  const tgUtm = `${baseUrl}?utm_source=telegram&utm_medium=social&utm_campaign=article`;
  const waUtm = `${baseUrl}?utm_source=whatsapp&utm_medium=social&utm_campaign=article`;

  const categoryHashtag = `#${article.category.name.replace(/\s+/g, '')}`;

  const xCopy = `⚡ JUST IN: ${article.title}\n\nRead the full report on GenZ Live:\n👉 ${xUtm}\n\n${categoryHashtag} #GenZLive #News`;
  const fbCopy = `📰 ${article.title}\n\n${excerptText}\n\nRead more at GenZ Live:\n${fbUtm}\n\n${categoryHashtag} #TheVoiceOfGenZ`;
  const igCopy = `🔥 ${article.title}\n\n${excerptText}\n\nTap link in bio to read the full story on GenZ Live!\n\n${categoryHashtag} #GenZLive #Newsroom`;
  const tgCopy = `📣 **${article.title}**\n\n${excerptText}\n\n🔗 Read story: ${tgUtm}`;
  const waCopy = `*${article.title}*\n\n${excerptText}\n\nRead on GenZ Live: ${waUtm}`;

  return {
    articleId: article.id,
    articleTitle: article.title,
    articleUrl: baseUrl,
    platforms: {
      x: { copy: xCopy, utmUrl: xUtm, charCount: xCopy.length },
      facebook: { copy: fbCopy, utmUrl: fbUtm, charCount: fbCopy.length },
      instagram: { copy: igCopy, utmUrl: igUtm, charCount: igCopy.length },
      telegram: { copy: tgCopy, utmUrl: tgUtm, charCount: tgCopy.length },
      whatsapp: { copy: waCopy, utmUrl: waUtm, charCount: waCopy.length },
    },
  };
}
