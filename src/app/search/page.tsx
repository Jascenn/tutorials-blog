import { getAllPosts } from '@/lib/posts';
import SearchClient from './SearchClient';

export const dynamic = 'force-static';

export default async function SearchPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1>搜索教程</h1>
      <SearchClient posts={posts} />
    </div>
  );
}