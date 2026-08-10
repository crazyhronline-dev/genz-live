import { NextResponse } from 'next/server';
import { ARTICLES } from '@/src/data/newsData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const query = searchParams.get('query');

  let filtered = ARTICLES;

  if (category && category !== 'all') {
    filtered = filtered.filter(a => a.category === category);
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      a =>
        a.title.toLowerCase().includes(q) ||
        a.categoryName.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({
    success: true,
    total: filtered.length,
    articles: filtered,
  });
}
