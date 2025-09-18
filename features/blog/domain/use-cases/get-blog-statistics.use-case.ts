import { BlogService } from '../service';
import { BlogStatistics } from '../../config/blog.types';

export async function getBlogStatisticsUseCase(): Promise<BlogStatistics> {
  const blogService = new BlogService();
  
  // Get comprehensive blog statistics for dashboard
  const statistics = await blogService.getBlogStatistics();
  
  return statistics;
}