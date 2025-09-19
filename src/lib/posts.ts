import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';

export interface PostMeta {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
}

export interface Post extends PostMeta {
  html: string;
  toc: { id: string; text: string; level: number }[];
}

const contentDir = path.join(process.cwd(), 'content');

function normalizeDate(input: unknown): string {
  if (!input) return '';
  try {
    if (typeof input === 'string') {
      // already string; try to format as YYYY-MM-DD if parseable
      const d = new Date(input);
      if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
      return input;
    }
    if (input instanceof Date) {
      if (!isNaN(input.getTime())) return input.toISOString().slice(0, 10);
      return '';
    }
    return String(input);
  } catch {
    return '';
  }
}

async function mdToHtml(md: string): Promise<{ html: string; toc: { id: string; text: string; level: number }[] }> {
  const toc: { id: string; text: string; level: number }[] = [];
  const collectToc = () => (tree: any) => {
    const visit = (node: any) => {
      if (node.type === 'element' && ['h1','h2','h3'].includes(node.tagName)){
        const id = node.properties?.id;
        const text = (node.children||[]).filter((c:any)=>c.type==='text').map((c:any)=>c.value).join('');
        const level = Number(node.tagName.slice(1));
        if (id && text) toc.push({ id, text, level });
      }
      (node.children||[]).forEach(visit);
    };
    visit(tree);
  };
  const file = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypePrettyCode as any, { theme: 'github-dark' })
    .use(collectToc)
    .use(rehypeStringify)
    .process(md);
  return { html: String(file), toc };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const files = await fs.readdir(contentDir);
  const posts: PostMeta[] = [];
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    const raw = await fs.readFile(path.join(contentDir, file), 'utf8');
    const { data, content } = matter(raw);
    posts.push({
      title: data.title || slug,
      slug,
      date: normalizeDate(data.date),
      tags: data.tags || [],
      excerpt: data.excerpt || content.replace(/\r?\n/g, ' ').slice(0, 120) + '…',
    });
  }
  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(contentDir, `${slug}.md`);
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(raw);
    const parsed = await mdToHtml(content);
    return {
      title: data.title || slug,
      slug,
      date: normalizeDate(data.date),
      tags: data.tags || [],
      excerpt: data.excerpt || '',
      html: parsed.html,
      toc: parsed.toc,
    };
  } catch {
    return null;
  }
}
