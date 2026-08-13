// ================================================================
// GenZ Live — Provider-Agnostic AI Service Abstraction
// Server-side AI intelligence engine for story analysis, fact extraction,
// headline generation, SEO metadata, and editorial article drafting.
// Key Protection: API Keys remain strictly server-side.
// ================================================================

import { stripHtml } from '@/lib/sanitizer';

export interface AIAnalysisResult {
  summary: string;
  keyFacts: string[];
  entities: {
    people: string[];
    organizations: string[];
    locations: string[];
    dates: string[];
    numbers: string[];
  };
  claims: Array<{
    claim: string;
    sourceSupport: string;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  suggestedHeadline: string;
  suggestedHeadlines: string[];
  suggestedCategory: string;
  suggestedTags: string[];
  riskFlags: string[];
}

export interface AIDraftResult {
  title: string;
  subtitle: string;
  excerpt: string;
  content: string; // Editorial HTML body
  suggestedCategory: string;
  suggestedTags: string[];
  seoTitle: string;
  seoDescription: string;
  readTime: string;
}

export interface AIProvider {
  name: string;
  analyzeStory(title: string, description?: string): Promise<AIAnalysisResult>;
  generateDraft(title: string, description?: string, category?: string): Promise<AIDraftResult>;
  suggestHeadlines(title: string, description?: string): Promise<string[]>;
  generateSEO(title: string, content: string): Promise<{ seoTitle: string; seoDescription: string }>;
  suggestKeywords(title: string, description?: string, content?: string): Promise<string[]>;
}

// ----------------------------------------------------------------
// 1. Mock / Deterministic Provider (Offline & Fallback Mode)
// ----------------------------------------------------------------
class MockAIProvider implements AIProvider {
  name = 'Mock AI Engine (Offline / Fallback)';

  async analyzeStory(title: string, description: string = ''): Promise<AIAnalysisResult> {
    const cleanTitle = stripHtml(title);
    const cleanDesc = stripHtml(description);
    const text = `${cleanTitle} ${cleanDesc}`;

    // Extract numbers if present
    const numbersMatch = text.match(/\b\d+(?:\.\d+)?%?\b/g) || [];
    const uniqueNumbers = Array.from(new Set(numbersMatch)).slice(0, 5);

    // Simple category detector
    let category = 'world';
    const lower = text.toLowerCase();
    if (lower.includes('ai') || lower.includes('gpt') || lower.includes('llm') || lower.includes('model') || lower.includes('openai')) category = 'ai';
    else if (lower.includes('tech') || lower.includes('apple') || lower.includes('google') || lower.includes('software') || lower.includes('chip')) category = 'technology';
    else if (lower.includes('india') || lower.includes('delhi') || lower.includes('mumbai') || lower.includes('rupee')) category = 'india';
    else if (lower.includes('market') || lower.includes('stock') || lower.includes('invest') || lower.includes('crypto')) category = 'markets';
    else if (lower.includes('business') || lower.includes('ceo') || lower.includes('company') || lower.includes('revenue')) category = 'business';

    return {
      summary: cleanDesc || `Editorially ingested story covering "${cleanTitle}".`,
      keyFacts: [
        `Primary development: ${cleanTitle}`,
        `Reporting context: ${cleanDesc.slice(0, 120)}...`,
        `Source attribution: Verified incoming external wire feed.`,
      ],
      entities: {
        people: ['Industry Spokesperson', 'Lead Representative'],
        organizations: ['GenZ Live Intelligence Desk', 'Industry Observers'],
        locations: ['Global Hubs'],
        dates: [new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })],
        numbers: uniqueNumbers.length > 0 ? uniqueNumbers : ['100%', '2026'],
      },
      claims: [
        {
          claim: cleanTitle,
          sourceSupport: 'Explicitly stated in source wire headline.',
          confidence: 'HIGH',
        },
      ],
      suggestedHeadline: cleanTitle,
      suggestedHeadlines: [
        cleanTitle,
        `Breakdown: ${cleanTitle}`,
        `What GenZ Needs to Know About ${cleanTitle}`,
      ],
      suggestedCategory: category,
      suggestedTags: [category, 'breaking-news', 'analysis'],
      riskFlags: [
        'AI-generated analysis — verify quotes, dates, and statistics before publication.',
      ],
    };
  }

  async generateDraft(title: string, description: string = '', category: string = 'technology'): Promise<AIDraftResult> {
    const cleanTitle = stripHtml(title);
    const cleanDesc = stripHtml(description);

    return {
      title: cleanTitle,
      subtitle: `An in-depth editorial breakdown of recent developments concerning ${cleanTitle}.`,
      excerpt: cleanDesc ? cleanDesc.slice(0, 160) : `Key insights and breakdown regarding ${cleanTitle}.`,
      content: `
<p class="lead text-lg text-slate-200 font-medium leading-relaxed mb-6">
  In a significant shift reported today, <strong>${cleanTitle}</strong> has emerged as a central focal point for global observers and digital natives alike.
</p>

<h2 class="text-xl font-bold text-white font-heading mt-8 mb-4">Key Background & Context</h2>
<p className="text-slate-300 leading-relaxed mb-4">
  ${cleanDesc || `The story highlights rapid developments within the industry, prompting reactions across markets and youth culture.`}
</p>

<blockquote class="border-l-4 border-brand-purple pl-4 my-6 italic text-slate-300">
  "Maintaining accuracy, source attribution, and verification remains central to modern youth journalism."
</blockquote>

<h2 class="text-xl font-bold text-white font-heading mt-8 mb-4">What Comes Next</h2>
<p class="text-slate-300 leading-relaxed mb-4">
  As further details unfold, editorial teams continue monitoring official channels for subsequent updates.
</p>
      `.trim(),
      suggestedCategory: category,
      suggestedTags: [category, 'news', 'update'],
      seoTitle: `${cleanTitle} — GenZ Live`,
      seoDescription: cleanDesc ? cleanDesc.slice(0, 155) : `Read the latest report on ${cleanTitle} on GenZ Live.`,
      readTime: '3 min read',
    };
  }

  async suggestHeadlines(title: string): Promise<string[]> {
    const clean = stripHtml(title);
    return [
      clean,
      `Explained: ${clean}`,
      `${clean}: Inside the Developments`,
    ];
  }

  async generateSEO(title: string, content: string): Promise<{ seoTitle: string; seoDescription: string }> {
    const cleanT = stripHtml(title);
    const cleanC = stripHtml(content);
    return {
      seoTitle: `${cleanT} | GenZ Live`,
      seoDescription: cleanC.slice(0, 155),
    };
  }

  async suggestKeywords(title: string, description: string = '', content: string = ''): Promise<string[]> {
    const cleanTitle = stripHtml(title);
    const cleanDesc = stripHtml(description);
    const cleanContent = stripHtml(content);
    const combined = `${cleanTitle} ${cleanDesc} ${cleanContent}`.trim();

    const words = combined
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 3 && !['with', 'from', 'that', 'this', 'have', 'were', 'their', 'there', 'about', 'would', 'could', 'should', 'more'].includes(w));

    const freq: Record<string, number> = {};
    for (const w of words) {
      freq[w] = (freq[w] || 0) + 1;
    }

    const topWords = Object.keys(freq)
      .sort((a, b) => freq[b] - freq[a])
      .slice(0, 6);

    const year = new Date().getFullYear();
    const suggested: string[] = [];

    if (cleanTitle) {
      suggested.push(cleanTitle.slice(0, 45).trim());
      suggested.push(`${cleanTitle.slice(0, 30).trim()} ${year}`);
      suggested.push(`${cleanTitle.slice(0, 35).trim()} latest updates`);
      suggested.push(`${cleanTitle.slice(0, 35).trim()} news`);
    }

    for (const tw of topWords) {
      const cap = tw.charAt(0).toUpperCase() + tw.slice(1);
      suggested.push(`${cap} latest news`);
      suggested.push(`${cap} ${year} updates`);
      suggested.push(`${cap} key facts`);
    }

    return Array.from(new Set(suggested)).slice(0, 12);
  }
}

// ----------------------------------------------------------------
// 2. OpenAI Structured Completions Provider
// ----------------------------------------------------------------
class OpenAIProvider implements AIProvider {
  name = 'OpenAI GPT-4o-mini';
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4o-mini') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async analyzeStory(title: string, description: string = ''): Promise<AIAnalysisResult> {
    const prompt = `You are a professional newsroom AI assistant for GenZ Live. Analyze this news wire story. Do NOT invent facts or quotes.
TITLE: ${title}
DESCRIPTION: ${description}

Return JSON with keys:
summary (string), keyFacts (string array), entities (object with people, organizations, locations, dates, numbers arrays), claims (array of objects with claim, sourceSupport, confidence), suggestedHeadline (string), suggestedHeadlines (string array), suggestedCategory (one of: world, india, technology, ai, business, markets, entertainment, sports, culture, trending), suggestedTags (string array), riskFlags (string array).`;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.2,
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenAI API returned status ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from OpenAI');

      const parsed = JSON.parse(content);
      return {
        summary: parsed.summary ?? title,
        keyFacts: Array.isArray(parsed.keyFacts) ? parsed.keyFacts : [title],
        entities: {
          people: Array.isArray(parsed.entities?.people) ? parsed.entities.people : [],
          organizations: Array.isArray(parsed.entities?.organizations) ? parsed.entities.organizations : [],
          locations: Array.isArray(parsed.entities?.locations) ? parsed.entities.locations : [],
          dates: Array.isArray(parsed.entities?.dates) ? parsed.entities.dates : [],
          numbers: Array.isArray(parsed.entities?.numbers) ? parsed.entities.numbers : [],
        },
        claims: Array.isArray(parsed.claims) ? parsed.claims : [],
        suggestedHeadline: parsed.suggestedHeadline ?? title,
        suggestedHeadlines: Array.isArray(parsed.suggestedHeadlines) ? parsed.suggestedHeadlines : [title],
        suggestedCategory: parsed.suggestedCategory ?? 'world',
        suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags : ['news'],
        riskFlags: Array.isArray(parsed.riskFlags) ? parsed.riskFlags : ['AI-generated analysis — verify facts before publication.'],
      };
    } catch {
      // Fallback to Mock provider if live call fails
      const fallback = new MockAIProvider();
      return fallback.analyzeStory(title, description);
    }
  }

  async generateDraft(title: string, description: string = '', category: string = 'technology'): Promise<AIDraftResult> {
    const prompt = `You are an editorial writer for GenZ Live (Voice of GenZ). Create an original news article draft based ONLY on the source information provided.
Do NOT invent quotes, facts, or numbers. Maintain a clear, objective, modern youth newsroom tone.

TITLE: ${title}
SOURCE DESCRIPTION: ${description}
CATEGORY: ${category}

Return JSON with keys:
title (string), subtitle (string), excerpt (string), content (clean HTML string with <p>, <h2>, <blockquote> tags), suggestedCategory (string), suggestedTags (string array), seoTitle (string), seoDescription (string), readTime (string).`;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.4,
        }),
      });

      if (!res.ok) {
        throw new Error(`OpenAI API returned status ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('Empty response from OpenAI');

      const parsed = JSON.parse(content);
      return {
        title: parsed.title ?? title,
        subtitle: parsed.subtitle ?? '',
        excerpt: parsed.excerpt ?? title,
        content: parsed.content ?? `<p>${description || title}</p>`,
        suggestedCategory: parsed.suggestedCategory ?? category,
        suggestedTags: Array.isArray(parsed.suggestedTags) ? parsed.suggestedTags : [category],
        seoTitle: parsed.seoTitle ?? `${title} — GenZ Live`,
        seoDescription: parsed.seoDescription ?? description.slice(0, 155),
        readTime: parsed.readTime ?? '3 min read',
      };
    } catch {
      const fallback = new MockAIProvider();
      return fallback.generateDraft(title, description, category);
    }
  }

  async suggestHeadlines(title: string, description?: string): Promise<string[]> {
    const analysis = await this.analyzeStory(title, description);
    return analysis.suggestedHeadlines;
  }

  async generateSEO(title: string, content: string): Promise<{ seoTitle: string; seoDescription: string }> {
    const cleanT = stripHtml(title);
    const cleanC = stripHtml(content);
    return {
      seoTitle: `${cleanT} | GenZ Live`,
      seoDescription: cleanC.slice(0, 155),
    };
  }

  async suggestKeywords(title: string, description: string = '', content: string = ''): Promise<string[]> {
    const prompt = `You are a Search Engine Optimization (SEO) & SERP Ranking Specialist for GenZ Live digital news.
Analyze the following news story headline, description, and body content thoroughly:

TITLE: ${title}
DESCRIPTION: ${description}
CONTENT BODY: ${content.slice(0, 1500)}

INSTRUCTION: Analyze entity relationships, primary search intent, trending news queries, LSI (Latent Semantic Indexing) keywords, and long-tail SERP search phrases.
Suggest 8 to 14 high-ranking, real SERP keywords that will rank this article at the top of Google Search and Google News.
Return JSON object: { "keywords": ["keyword 1", "keyword 2", ...] }`;

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.3,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed.keywords) && parsed.keywords.length > 0) {
            return parsed.keywords;
          }
        }
      }
    } catch {
      // Fallback
    }

    const fallback = new MockAIProvider();
    return fallback.suggestKeywords(title, description, content);
  }
}

// ----------------------------------------------------------------
// 3. Factory function to instantiate configured AI Provider
// ----------------------------------------------------------------
export function getAIProvider(): AIProvider {
  const providerName = (process.env.AI_PROVIDER || 'mock').toLowerCase();
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL || 'gpt-4o-mini';

  if ((providerName === 'openai' || providerName === 'gpt') && apiKey) {
    return new OpenAIProvider(apiKey, model);
  }

  return new MockAIProvider();
}
