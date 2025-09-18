import type { Metadata } from 'next';
import { BlogPostsTable } from '@/features/blog/components/organisms/blog-posts-table';

export const metadata: Metadata = {
  title: 'Blog Management',
  description: 'Manage your blog posts, categories, and content',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto py-6">
      <BlogPostsTable />
    </div>
  );
}