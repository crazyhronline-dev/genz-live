// GenZ Live — Centralized Type Definitions

export interface ArticleTagItem {
  slug: string;
  name: string;
}

export interface ArticleSourceItem {
  name: string;
  url?: string;
}

export interface Article {
  id: string;
  slug?: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  category: string;
  categoryName: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  publishedAt: string;        // Human-readable date string for display
  publishedAtRaw?: string;    // ISO 8601 date string for feeds & structured data
  updatedAtRaw?: string;      // ISO 8601 modified date for structured data
  readTime: string;
  views: string;
  likes: number;
  image: string;
  imageAlt?: string;
  imageCaption?: string;
  imageCredit?: string;
  isFeatured?: boolean;
  isDemo?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  youtubeUrl?: string;
  source?: ArticleSourceItem;
  tags?: ArticleTagItem[];
}

export interface Category {
  id: string;
  slug?: string;
  name: string;
  icon: string;
}

export interface BreakingHeadline {
  id: string;
  text: string;
  category: string;
  time: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  duration: string;
  views: string;
  thumbnail: string;
  embedId: string;
  isLive: boolean;
  published: string;
}

export interface Comment {
  id: number;
  user: string;
  time: string;
  text: string;
}

export interface SocialLinks {
  youtube: string;
  instagram: string;
  facebook: string;
  domain: string;
  handle: string;
}

export interface NavbarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenLiveStream: () => void;
  savedCount: number;
}

export interface ArticleModalProps {
  article: Article;
  onClose: () => void;
  isSaved: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectRelated: (article: Article) => void;
  relatedArticles?: Article[];
}

export interface CategoryHubProps {
  articles: Article[];
  activeCategory: string;
  setActiveCategory?: (cat: string) => void;
  searchQuery?: string;
  onSelectStory?: (article: Article) => void;
  savedIds?: string[];
  onToggleBookmark?: (id: string) => void;
}

export interface HeroSectionProps {
  featuredStory: Article;
  secondaryStories: Article[];
  onSelectStory?: (article: Article) => void;
}
