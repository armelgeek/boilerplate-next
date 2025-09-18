import { z } from 'zod';
import { 
  blogPostSchema, 
  blogCategorySchema, 
  blogCommentSchema, 
  blogTagSchema 
} from './blog.schema';

// TypeScript types derived from Zod schemas
export type BlogPost = z.infer<typeof blogPostSchema>;
export type BlogCategory = z.infer<typeof blogCategorySchema>;
export type BlogComment = z.infer<typeof blogCommentSchema>;
export type BlogTag = z.infer<typeof blogTagSchema>;

// Extended types with relationships
export type BlogPostWithRelations = BlogPost & {
  createdAt?: Date;
  updatedAt?: Date;
  viewCount?: number;
  category?: BlogCategory;
  author?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  tags?: BlogTag[];
  commentsCount?: number;
};

export type BlogCategoryWithStats = BlogCategory & {
  postsCount: number;
  posts?: BlogPost[];
};

export type BlogCommentWithAuthor = BlogComment & {
  author: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
  post?: {
    id: string;
    title: string;
    slug: string;
  };
  replies?: BlogCommentWithAuthor[];
};

export type BlogTagWithStats = BlogTag & {
  postsCount: number;
  posts?: BlogPost[];
};

// API Response Types
export type BlogPostsResponse = {
  posts: BlogPostWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

export type BlogCategoriesResponse = {
  categories: BlogCategoryWithStats[];
  totalCount: number;
};

export type BlogTagsResponse = {
  tags: BlogTagWithStats[];
  totalCount: number;
};

export type BlogCommentsResponse = {
  comments: BlogCommentWithAuthor[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
};

// Dashboard Statistics Type
export type BlogStatistics = {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalCategories: number;
  totalTags: number;
  totalComments: number;
  approvedComments: number;
  pendingComments: number;
  totalAuthors: number;
  recentPosts: BlogPostWithRelations[];
  popularPosts: BlogPostWithRelations[];
  recentComments: BlogCommentWithAuthor[];
};

// Filter and Sort Types
export type BlogPostFilter = {
  status?: 'draft' | 'published' | 'archived';
  categoryId?: string;
  authorId?: string;
  search?: string;
  tagIds?: string[];
};

export type BlogPostSort = {
  field: 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'viewCount';
  direction: 'asc' | 'desc';
};

export type PaginationParams = {
  page: number;
  limit: number;
};