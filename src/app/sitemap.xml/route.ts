import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import { site } from '@/config/site';

export const dynamic = 'force-static';
export const revalidate = 3600;

export async function GET() {
  const posts = await getAllPosts();

  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily', lastmod: undefined },
    { url: '/blog', priority: '0.8', changefreq: 'daily', lastmod: undefined },
    { url: '/tags', priority: '0.6', changefreq: 'weekly', lastmod: undefined },
  ];

  // Blog post pages
  const blogPages = posts.map(post => ({
    url: `/blog/${post.slug}`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: post.date || undefined,
  }));

  // Get unique tags
  const tags = [...new Set(posts.flatMap(p => p.tags))];
  const tagPages = tags.map(tag => ({
    url: `/tags/${encodeURIComponent(tag)}`,
    priority: '0.5',
    changefreq: 'weekly',
    lastmod: undefined,
  }));

  const allPages = [...staticPages, ...blogPages, ...tagPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${site.url}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${new Date(page.lastmod).toISOString()}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}