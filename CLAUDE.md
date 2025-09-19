# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 static blog with TypeScript, featuring markdown-based content management and automatic GitHub Pages deployment. The site is primarily in Chinese (zh-CN) and focuses on educational tutorials.

## Essential Commands

### Development
```bash
npm run dev        # Start development server at http://localhost:3000
npm run build      # Build static site for production (includes next export)
npm run preview    # Preview built static site locally
npm run lint       # Run ESLint
```

### Content Management
- Create new blog posts by adding `.md` files to `/content/` directory
- Required frontmatter fields: `title`, `date`, `tags` (array), `excerpt`
- Filename becomes the URL slug (e.g., `my-post.md` → `/blog/my-post`)

## Architecture

### Core Processing Pipeline
The blog uses a markdown processing pipeline defined in `src/lib/posts.ts`:
1. **Gray Matter** parses frontmatter and content
2. **Remark** processes markdown with GFM support
3. **Rehype** converts to HTML with:
   - Auto-generated heading IDs and links
   - Syntax highlighting via Shiki (GitHub Dark theme)
   - Table of contents extraction from H1-H3 headings

### Static Generation Strategy
- All pages are statically generated at build time
- Blog posts are sorted by date (newest first)
- Tags are extracted and pages generated for each unique tag
- Homepage shows latest 6 posts, individual tag pages show all tagged posts

### Deployment Architecture
- GitHub Actions workflow triggers on push to main/master
- Builds with Node.js 20 and exports static files
- Deploys to `gh-pages` branch for GitHub Pages hosting
- Supports custom base path via `NEXT_BASE_PATH` environment variable

## Key Technical Decisions

1. **Static Export Only**: No server-side features; all content must be pre-renderable
2. **CSS Custom Properties**: Styling uses CSS variables for theming without a framework
3. **No Testing Framework**: Currently no tests; consider adding when implementing new features
4. **Chinese-First**: UI and content optimized for Chinese language users

## Common Development Tasks

### Adding a New Blog Post
1. Create a markdown file in `/content/` with frontmatter
2. The system automatically generates slug from filename
3. Tags create automatic category pages at `/tags/[tag]`

### Modifying Site Structure
- Page components are in `src/app/` following Next.js App Router conventions
- Shared layout in `src/app/layout.tsx` includes header and footer
- Global styles in `src/app/globals.css`

### Updating Markdown Processing
- All markdown logic is centralized in `src/lib/posts.ts`
- Modify remark/rehype plugins there for new markdown features
- Table of contents extraction happens during markdown processing