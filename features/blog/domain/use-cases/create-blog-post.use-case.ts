import { BlogService } from '../service';
import { createBlogPostSchema } from '../../config/blog.schema';
import { BlogPost } from '../../config/blog.types';

export async function createBlogPostUseCase(
  data: unknown
): Promise<BlogPost> {
  // Validate input data
  const validatedData = createBlogPostSchema.parse(data);
  
  const blogService = new BlogService();
  
  // Create the blog post
  const post = await blogService.createPost(validatedData);
  
  return post;
}