import { getAllPosts, getPostBySlug } from '@/lib/posts';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map(p => ({ slug: p.slug }));
}

export default async function PostPage({ params }: any) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();
  return (
    <article>
      <h1 className="title">{post.title}</h1>
      <p className="muted">{post.date} · {post.tags.map(t=>`#${t}`).join(' ')}</p>
      {post.toc?.length ? (
        <div className="toc">
          <strong>目录</strong>
          <ul>
            {post.toc.map(i=> (
              <li key={i.id} style={{marginLeft:(i.level-1)*12}}>
                <a href={`#${i.id}`}>{i.text}</a>
              </li>
            ))}
          </ul>
        </div>
      ): null}
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  );
}
