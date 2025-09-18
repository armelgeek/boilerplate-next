import type { Metadata } from 'next';
import { EnhancedBlogPostsTable } from '@/features/blog/components/organisms/enhanced-blog-posts-table';

export const metadata: Metadata = {
  title: 'Blog Management',
  description: 'Manage your blog posts, categories, and content',
};

export default function BlogPage() {
  return (
    <div className="container mx-auto py-6">
      <EnhancedBlogPostsTable />
    </div>
  );
}