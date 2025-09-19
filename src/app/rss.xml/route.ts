import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import { site } from '@/config/site';

export const dynamic = 'force-static';
export const revalidate = 3600; // 1h

function escapeXml(s: string){
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

export async function GET() {
  const posts = await getAllPosts();
  const items = posts.map(p => `\n    <item>\n      <title>${escapeXml(p.title)}</title>\n      <link>${site.url}/blog/${encodeURIComponent(p.slug)}</link>\n      <guid>${site.url}/blog/${encodeURIComponent(p.slug)}</guid>\n      <pubDate>${new Date(p.date||Date.now()).toUTCString()}</pubDate>\n      <description>${escapeXml(p.excerpt||'')}</description>\n    </item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>${escapeXml(site.title)}</title>\n    <link>${site.url}</link>\n    <description>${escapeXml(site.description)}</description>${items}\n  </channel>\n</rss>\n`;
  return new NextResponse(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }});
}

