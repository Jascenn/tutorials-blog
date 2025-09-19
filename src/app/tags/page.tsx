import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default async function TagsIndex(){
  const posts = await getAllPosts();
  const tagMap = new Map<string, number>();
  posts.forEach(p => p.tags?.forEach(t => tagMap.set(t, (tagMap.get(t)||0)+1)));
  const tags = Array.from(tagMap.entries()).sort((a,b)=>b[1]-a[1]);
  return (
    <div>
      <h1>标签</h1>
      <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:12}}>
        {tags.map(([t,c]) => (
          <Link key={t} className="tag" href={`/tags/${encodeURIComponent(t)}`}>{t} ({c})</Link>
        ))}
      </div>
    </div>
  );
}

