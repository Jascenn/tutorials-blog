import { getAllPosts, getPostBySlug } from './posts';
import { site } from '@/config/site';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function generateRssFeed(): Promise<string> {
  const posts = await getAllPosts();
  const items: string[] = [];

  // Get full content for each post
  for (const postMeta of posts.slice(0, 20)) { // Limit to 20 latest posts
    const post = await getPostBySlug(postMeta.slug);
    if (!post) continue;

    const pubDate = new Date(post.date).toUTCString();
    const url = `${site.url}/blog/${post.slug}`;

    items.push(`
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      ${post.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`);
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
    ${items.join('\n')}
  </channel>
</rss>`;

  return rss;
}