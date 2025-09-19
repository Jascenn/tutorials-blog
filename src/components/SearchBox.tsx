'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { PostMeta } from '@/lib/posts';

export default function SearchBox({ posts }: { posts: PostMeta[] }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PostMeta[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.excerpt.toLowerCase().includes(lowerQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
      setResults(filtered.slice(0, 5));
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, posts]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="search-box" ref={searchRef} style={{ position: 'relative' }}>
      <input
        type="text"
        placeholder="搜索教程..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query && setIsOpen(true)}
        style={{
          padding: '8px 12px',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          width: '200px',
          fontSize: '14px'
        }}
      />

      {isOpen && results.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 100
        }}>
          {results.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              onClick={() => {
                setQuery('');
                setIsOpen(false);
              }}
              style={{
                display: 'block',
                padding: '8px 12px',
                borderBottom: '1px solid var(--border)',
                color: 'var(--fg)',
                textDecoration: 'none'
              }}
            >
              <div style={{ fontWeight: 500, fontSize: '14px' }}>{post.title}</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>
                {post.tags.map(t => `#${t}`).join(' ')}
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '4px',
          padding: '12px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontSize: '14px',
          color: 'var(--muted)',
          zIndex: 100
        }}>
          未找到相关教程
        </div>
      )}
    </div>
  );
}