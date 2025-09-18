import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BlogStatistics } from '../config/blog.types';
import { BLOG_API_ENDPOINTS } from '../config/blog.constants';

// Hook for fetching blog statistics
export function useBlogStatistics() {
  return useQuery<BlogStatistics>({
    queryKey: ['blog', 'statistics'],
    queryFn: async () => {
      const response = await fetch(BLOG_API_ENDPOINTS.statistics.dashboard);
      if (!response.ok) {
        throw new Error('Failed to fetch blog statistics');
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}