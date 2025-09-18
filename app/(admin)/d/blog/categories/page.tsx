import type { Metadata } from 'next';
import { EnhancedCategoryManagement } from '@/features/blog/components/organisms/enhanced-category-management';

export const metadata: Metadata = {
  title: 'Category Management',
  description: 'Manage blog categories and their associated posts',
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-6">
      <EnhancedCategoryManagement />
    </div>
  );
}