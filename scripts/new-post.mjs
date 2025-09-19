#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

function usage() {
  console.log('Usage: npm run new:post -- "Title here" [--slug=my-slug] [--tags=tag1,tag2] [--date=YYYY-MM-DD]');
}

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const args = process.argv.slice(2);
if (args.length === 0) { usage(); process.exit(1); }

let title = '';
let slug = '';
let tags = [];
let date = '';

for (const a of args) {
  if (a.startsWith('--slug=')) slug = a.slice(7);
  else if (a.startsWith('--tags=')) tags = a.slice(7).split(',').map(s=>s.trim()).filter(Boolean);
  else if (a.startsWith('--date=')) date = a.slice(7);
  else if (!title) title = a.replace(/^"|"$/g, '');
}

if (!title) { console.error('Error: missing title'); usage(); process.exit(1); }
if (!slug) slug = slugify(title);
if (!slug) slug = `post-${Date.now()}`;
if (!date) {
  const d = new Date();
  date = d.toISOString().slice(0,10);
}

const contentDir = path.join(process.cwd(), 'content');
await fs.mkdir(contentDir, { recursive: true });

let file = path.join(contentDir, `${slug}.md`);
let suffix = 1;
while (true) {
  try { await fs.access(file); file = path.join(contentDir, `${slug}-${suffix}.md`); suffix++; }
  catch { break; }
}

const fmTags = tags.length ? `[${tags.map(t=>t.includes(' ') ? `"${t}"` : t).join(', ')}]` : '[]';
const body = `---\n`+
  `title: ${title}\n`+
  `date: "${date}"\n`+
  `tags: ${fmTags}\n`+
  `excerpt: 这里写一段不超过 120 字的摘要。\n`+
  `---\n\n`+
  `# ${title}\n\n`+
  `在这里开始你的教程内容。\n\n`+
  `## 小节标题\n\n`+
  `编写步骤、代码示例等。\n\n`+
  '```js\nconsole.log("Hello tutorials");\n```\n';

await fs.writeFile(file, body, 'utf8');
console.log(`Created: ${path.relative(process.cwd(), file)}`);

