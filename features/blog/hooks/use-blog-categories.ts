import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  BlogCategoryWithStats, 
  BlogCategoriesResponse, 
  BlogCategory 
} from '../config/blog.types';
import { createBlogCategorySchema } from '../config/blog.schema';
import { z } from 'zod';
import { BLOG_API_ENDPOINTS } from '../config/blog.constants';

type CreateBlogCategoryData = z.infer<typeof createBlogCategorySchema>;

// Hook for fetching all blog categories
export function useBlogCategories() {
  return useQuery<BlogCategoriesResponse>({
    queryKey: ['blog', 'categories'],
    queryFn: async () => {
      const response = await fetch(BLOG_API_ENDPOINTS.categories.base);
      if (!response.ok) {
        throw new Error('Failed to fetch blog categories');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for fetching a single blog category
export function useBlogCategory(id: string) {
  return useQuery<BlogCategoryWithStats>({
    queryKey: ['blog', 'categories', id],
    queryFn: async () => {
      const response = await fetch(BLOG_API_ENDPOINTS.categories.detail(id));
      if (!response.ok) {
        throw new Error('Failed to fetch blog category');
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// Hook for creating a new blog category
export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBlogCategoryData) => {
      const response = await fetch(BLOG_API_ENDPOINTS.categories.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create blog category');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['blog', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'statistics'] });
    },
  });
}

// Hook for updating a blog category
export function useUpdateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogCategory> }) => {
      const response = await fetch(BLOG_API_ENDPOINTS.categories.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update blog category');
      }

      return response.json();
    },
    onSuccess: (_, { id }) => {
      // Invalidate and refetch affected queries
      queryClient.invalidateQueries({ queryKey: ['blog', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'categories', id] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'statistics'] });
    },
  });
}

// Hook for deleting a blog category
export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(BLOG_API_ENDPOINTS.categories.delete(id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete blog category');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch categories
      queryClient.invalidateQueries({ queryKey: ['blog', 'categories'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'statistics'] });
    },
  });
}