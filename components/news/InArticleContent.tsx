import AdSlot from '@/components/ui/AdSlot';

interface InArticleContentProps {
  content: string;
}

export default async function InArticleContent({ content }: InArticleContentProps) {
  if (!content) return null;

  // Split content by closing paragraph tags </p>
  const parts = content.split('</p>');

  // If article has 3 or more paragraphs, insert ad after paragraph 2
  if (parts.length >= 3) {
    const firstHalf = parts.slice(0, 2).join('</p>') + '</p>';
    const secondHalf = parts.slice(2).join('</p>');

    return (
      <div className="space-y-6">
        <div
          className="prose-genz"
          dangerouslySetInnerHTML={{ __html: firstHalf }}
        />

        {/* High-engagement In-Article Sponsored Banner */}
        <AdSlot size="in-article" slotId="article-body-mid" />

        <div
          className="prose-genz"
          dangerouslySetInnerHTML={{ __html: secondHalf }}
        />
      </div>
    );
  }

  // Fallback for short articles: render content then in-article ad
  return (
    <div className="space-y-6">
      <div
        className="prose-genz"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <AdSlot size="in-article" slotId="article-body-bottom" />
    </div>
  );
}
