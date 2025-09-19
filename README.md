# Tutorials Blog

基于 Next.js 的静态教程博客；内容在 `content/`，适配 GitHub Pages。

## 本地运行

```bash
npm install
npm run dev
```

## 构建与预览

```bash
npm run build
npm run preview
```

## 部署到 GitHub Pages

- Pages 分支：`gh-pages`
- 如果仓库名是 `yourname/tutorials-blog`，需设置环境变量：

```bash
NEXT_BASE_PATH=/tutorials-blog npm run build
```

### 本地一键发布（跳过 Actions）

```bash
# 项目仓库（例如 Jascenn/tutorials-blog）：
npm run deploy:gh

# 用户主页仓库（Jascenn/Jascenn.github.io）时：
npm run deploy:gh -- --user-site

# 指定自定义 basePath（覆盖默认）
npm run deploy:gh -- --base /docs

# 若已手动 build，则可跳过构建：
npm run deploy:gh -- --no-build
```

## 快速新建文章

```bash
npm run new:post -- "我的第一篇教程" --tags=前端,工具 --date=2025-09-21
```

- 生成文件位于 `content/` 目录，文件名根据标题自动生成 slug（重复会自动加后缀）
- frontmatter 字段：`title`、`date`、`tags`、`excerpt`

## RSS 订阅

- 访问 `/rss.xml` 获取订阅源
- 请在 `src/config/site.ts` 将 `url` 修改为你的实际站点地址（例如 `https://yourname.github.io/tutorials-blog`），用于生成绝对链接
