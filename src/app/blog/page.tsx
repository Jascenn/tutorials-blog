import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export const dynamic = 'force-static';

export default async function BlogIndex() {
  const allPosts = await getAllPosts();
  const posts = allPosts;

  return (
    <div>
      <h1>全部教程</h1>
      <p className="muted">共 {allPosts.length} 篇教程</p>

      <div className="list" style={{marginTop:16}}>
        {posts.map(p => (
          <article key={p.slug} className="post-card">
            <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
            <p className="muted">{p.date} · {p.tags.map(t=>`#${t}`).join(' ')}</p>
            <p>{p.excerpt}</p>
          </article>
        ))}
      </div>

      {/* 静态导出环境下移除查询参数分页，保持纯静态 */}
    </div>
  );
}
