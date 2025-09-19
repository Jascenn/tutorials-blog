/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoBase = process.env.NEXT_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  // 仅生产使用 basePath，避免本地 dev 路径混淆
  basePath: isProd && repoBase ? repoBase : undefined,
  assetPrefix: isProd && repoBase ? `${repoBase}/` : undefined,
};

module.exports = nextConfig;
