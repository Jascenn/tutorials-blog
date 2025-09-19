import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <div>
      <h1>全部教程</h1>
      <div className="list" style={{marginTop:16}}>
        {posts.map(p => (
          <article key={p.slug} className="post-card">
            <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
            <p className="muted">{p.date} · {p.tags.map(t=>`#${t}`).join(' ')}</p>
            <p>{p.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

