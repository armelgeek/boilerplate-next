'use client';

import { useRouter } from 'next/navigation';
import { BlogPostForm } from '@/features/blog/components/organisms/blog-post-form';

export default function NewBlogPostPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/d/blog');
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="container mx-auto py-6">
      <BlogPostForm onSuccess={handleSuccess} onCancel={handleCancel} />
    </div>
  );
}