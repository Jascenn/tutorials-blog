import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import { site } from '@/config/site';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1h

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const posts = await getAllPosts();
  const items = posts.slice(0, 20).map(p => {
    const pubDate = new Date(p.date || Date.now()).toUTCString();
    const tags = p.tags.map(tag => `\n      <category>${escapeXml(tag)}</category>`).join('');
    return `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site.url}/blog/${encodeURIComponent(p.slug)}</link>
      <guid isPermaLink="true">${site.url}/blog/${encodeURIComponent(p.slug)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(p.excerpt || '')}</description>${tags}
    </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

