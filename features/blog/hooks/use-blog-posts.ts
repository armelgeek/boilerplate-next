import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  BlogPostWithRelations, 
  BlogPostsResponse, 
  BlogPostFilter, 
  BlogPostSort, 
  PaginationParams,
  BlogPost 
} from '../config/blog.types';
import { BLOG_API_ENDPOINTS } from '../config/blog.constants';
import qs from 'qs';

// Hook for fetching blog posts with filters, sorting, and pagination
export function useBlogPosts(
  filter: BlogPostFilter = {},
  sort: BlogPostSort = { field: 'createdAt', direction: 'desc' },
  pagination: PaginationParams = { page: 1, limit: 10 }
) {
  const queryString = qs.stringify({
    ...filter,
    ...sort,
    ...pagination,
  });

  return useQuery<BlogPostsResponse>({
    queryKey: ['blog', 'posts', filter, sort, pagination],
    queryFn: async () => {
      const response = await fetch(BLOG_API_ENDPOINTS.posts.list(`?${queryString}`));
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// Hook for fetching a single blog post
export function useBlogPost(id: string) {
  return useQuery<BlogPostWithRelations>({
    queryKey: ['blog', 'posts', id],
    queryFn: async () => {
      const response = await fetch(BLOG_API_ENDPOINTS.posts.detail(id));
      if (!response.ok) {
        throw new Error('Failed to fetch blog post');
      }
      return response.json();
    },
    enabled: !!id,
  });
}

// Hook for creating a new blog post
export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Omit<BlogPost, 'id'>) => {
      const response = await fetch(BLOG_API_ENDPOINTS.posts.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create blog post');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch blog posts
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'statistics'] });
    },
  });
}

// Hook for updating a blog post
export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BlogPost> }) => {
      const response = await fetch(BLOG_API_ENDPOINTS.posts.update(id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update blog post');
      }

      return response.json();
    },
    onSuccess: (_, { id }) => {
      // Invalidate and refetch affected queries
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts', id] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'statistics'] });
    },
  });
}

// Hook for deleting a blog post
export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(BLOG_API_ENDPOINTS.posts.delete(id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete blog post');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch blog posts
      queryClient.invalidateQueries({ queryKey: ['blog', 'posts'] });
      queryClient.invalidateQueries({ queryKey: ['blog', 'statistics'] });
    },
  });
}