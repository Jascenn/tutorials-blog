import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export async function generateStaticParams(){
  const posts = await getAllPosts();
  const set = new Set<string>();
  posts.forEach(p=>p.tags?.forEach(t=>set.add(t)));
  return Array.from(set).map(t=>({ tag: t }));
}

export default async function TagPage({ params }: { params: { tag: string }}){
  const posts = await getAllPosts();
  const list = posts.filter(p => p.tags?.includes(params.tag));
  return (
    <div>
      <h1>标签：{params.tag}</h1>
      <p className="muted">共 {list.length} 篇</p>
      <div className="list" style={{marginTop:16}}>
        {list.map(p => (
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

