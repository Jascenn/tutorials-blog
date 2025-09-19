import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default async function HomePage() {
  const posts = await getAllPosts();
  return (
    <div>
      <h1 className="title">最新教程</h1>
      <p className="muted">专注于前端、工具与效率的实用教程</p>
      <div className="list" style={{marginTop:16}}>
        {posts.slice(0, 6).map(p => (
          <article key={p.slug} className="post-card">
            <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
            <p className="muted">{p.date} · {p.tags.map(t=>`#${t}`).join(' ')}</p>
            <p>{p.excerpt}</p>
          </article>
        ))}
      </div>
      <p style={{marginTop:16}}><Link href="/blog">查看全部教程 →</Link></p>
    </div>
  );
}

