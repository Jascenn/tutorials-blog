'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

export default function SearchClient({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState('');

  const results = query.trim()
    ? posts.filter(post => {
        const lowerQuery = query.toLowerCase();
        return (
          post.title.toLowerCase().includes(lowerQuery) ||
          post.excerpt.toLowerCase().includes(lowerQuery) ||
          post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
      })
    : [];

  return (
    <div>
      <input
        type="text"
        placeholder="输入关键词搜索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '16px',
          border: '2px solid var(--border)',
          borderRadius: '8px',
          marginBottom: '24px'
        }}
      />

      {query && (
        <p className="muted">
          找到 {results.length} 个相关教程
        </p>
      )}

      <div className="list" style={{ marginTop: 16 }}>
        {results.map((p) => (
          <article key={p.slug} className="post-card">
            <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
            <p className="muted">{p.date} · {p.tags.map(t => `#${t}`).join(' ')}</p>
            <p>{p.excerpt}</p>
          </article>
        ))}
      </div>

      {query && results.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--muted)'
        }}>
          <p>未找到包含 "{query}" 的教程</p>
          <p style={{ marginTop: '8px' }}>试试其他关键词</p>
        </div>
      )}
    </div>
  );
}