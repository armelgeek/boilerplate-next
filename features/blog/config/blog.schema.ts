import { z } from 'zod';

// Blog Category Schema
export const blogCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  description: z.string().optional(),
});

// Blog Post Schema
export const blogPostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(200),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional(),
  featuredImage: z.string().url('Must be a valid URL').optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  publishedAt: z.date().optional(),
  categoryId: z.string().optional(),
  authorId: z.string(),
  tagIds: z.array(z.string()).optional(),
});

// Blog Comment Schema
export const blogCommentSchema = z.object({
  id: z.string().optional(),
  content: z.string().min(1, 'Comment content is required').max(1000),
  postId: z.string(),
  authorId: z.string(),
  parentId: z.string().optional(),
  isApproved: z.boolean().default(false),
});

// Blog Tag Schema
export const blogTagSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Tag name is required').max(50),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
});

// Create schemas for API operations
export const createBlogPostSchema = blogPostSchema.omit({ id: true });
export const updateBlogPostSchema = blogPostSchema.partial().required({ id: true });

export const createBlogCategorySchema = blogCategorySchema.omit({ id: true }).partial({ slug: true });
export const updateBlogCategorySchema = blogCategorySchema.partial().required({ id: true });

export const createBlogTagSchema = blogTagSchema.omit({ id: true });
export const updateBlogTagSchema = blogTagSchema.partial().required({ id: true });

export const createBlogCommentSchema = blogCommentSchema.omit({ id: true });
export const updateBlogCommentSchema = blogCommentSchema.partial().required({ id: true });