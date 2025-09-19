import './globals.css';
import type { Metadata } from 'next';
import { site } from '@/config/site';
import Link from 'next/link';

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  alternates: {
    types: { 'application/rss+xml': '/rss.xml' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <header style={{padding:'16px 0', borderBottom:'1px solid #eee'}}>
          <div className="container">
            <Link href="/" className="logo">教程博客</Link>
            <nav>
              <Link href="/blog">教程</Link>
              <Link href="/tags">标签</Link>
              <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="footer">© {new Date().getFullYear()} Tutorials</footer>
      </body>
    </html>
  );
}
