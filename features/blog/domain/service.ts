import { db } from '@/drizzle/db';
import { 
  blogPosts, 
  blogCategories, 
  blogComments, 
  blogTags, 
  blogPostTags,
  users 
} from '@/drizzle/schema';
import { 
  BlogPost, 
  BlogCategory, 
  BlogComment, 
  BlogTag,
  BlogPostWithRelations,
  BlogCategoryWithStats,
  BlogCommentWithAuthor,
  BlogTagWithStats,
  BlogStatistics,
  BlogPostFilter,
  BlogPostSort,
  PaginationParams
} from '../config/blog.types';
import { BLOG_CONSTANTS } from '../config/blog.constants';
import { eq, desc, asc, and, or, like, count, sql } from 'drizzle-orm';
import slugify from 'slugify';

export class BlogService {
  // Posts
  async createPost(data: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values({
        ...data,
        slug: this.generateSlug(data.title),
        publishedAt: data.status === 'published' ? new Date() : null,
      })
      .returning();
    
    // Handle tag associations
    if (data.tagIds && data.tagIds.length > 0) {
      await this.associatePostTags(post.id, data.tagIds);
    }

    return post;
  }

  async getPostById(id: string): Promise<BlogPostWithRelations | null> {
    const result = await db
      .select({
        post: blogPosts,
        category: blogCategories,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(blogPosts)
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (!result.length) return null;

    const post = result[0];
    const tags = await this.getPostTags(id);
    const commentsCount = await this.getPostCommentsCount(id);

    return {
      ...post.post,
      category: post.category || undefined,
      author: post.author,
      tags,
      commentsCount,
    };
  }

  async getPosts(
    filter: BlogPostFilter = {}, 
    sort: BlogPostSort = BLOG_CONSTANTS.DEFAULT_SORT,
    pagination: PaginationParams = { page: 1, limit: BLOG_CONSTANTS.DEFAULT_PAGE_SIZE }
  ): Promise<{ posts: BlogPostWithRelations[]; totalCount: number }> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    // Build filter conditions
    const conditions = [];
    if (filter.status) {
      conditions.push(eq(blogPosts.status, filter.status));
    }
    if (filter.categoryId) {
      conditions.push(eq(blogPosts.categoryId, filter.categoryId));
    }
    if (filter.authorId) {
      conditions.push(eq(blogPosts.authorId, filter.authorId));
    }
    if (filter.search) {
      conditions.push(
        or(
          like(blogPosts.title, `%${filter.search}%`),
          like(blogPosts.content, `%${filter.search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderBy = sort.direction === 'desc' 
      ? desc(blogPosts[sort.field]) 
      : asc(blogPosts[sort.field]);

    // Get posts with relations
    const result = await db
      .select({
        post: blogPosts,
        category: blogCategories,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(blogPosts)
      .leftJoin(blogCategories, eq(blogPosts.categoryId, blogCategories.id))
      .leftJoin(users, eq(blogPosts.authorId, users.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    // Get total count
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(whereClause);

    // Enhance with tags and comments count
    const posts = await Promise.all(
      result.map(async (item) => {
        const tags = await this.getPostTags(item.post.id);
        const commentsCount = await this.getPostCommentsCount(item.post.id);
        
        return {
          ...item.post,
          category: item.category || undefined,
          author: item.author,
          tags,
          commentsCount,
        };
      })
    );

    return { posts, totalCount };
  }

  async updatePost(id: string, data: Partial<BlogPost>): Promise<BlogPost | null> {
    const updateData: any = { ...data };
    
    // Update slug if title changed
    if (data.title) {
      updateData.slug = this.generateSlug(data.title);
    }

    // Set published date when publishing
    if (data.status === 'published' && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const [post] = await db
      .update(blogPosts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();

    // Handle tag associations
    if (data.tagIds !== undefined) {
      await this.updatePostTags(id, data.tagIds);
    }

    return post || null;
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id));
    
    return result.rowCount > 0;
  }

  // Categories
  async createCategory(data: Omit<BlogCategory, 'id'>): Promise<BlogCategory> {
    const [category] = await db
      .insert(blogCategories)
      .values({
        ...data,
        slug: this.generateSlug(data.name),
      })
      .returning();
    
    return category;
  }

  async getCategories(): Promise<BlogCategoryWithStats[]> {
    const categories = await db.select().from(blogCategories);
    
    return Promise.all(
      categories.map(async (category) => {
        const [{ count: postsCount }] = await db
          .select({ count: count() })
          .from(blogPosts)
          .where(eq(blogPosts.categoryId, category.id));
        
        return {
          ...category,
          postsCount: postsCount || 0,
        };
      })
    );
  }

  async getCategoryById(id: string): Promise<BlogCategoryWithStats | null> {
    const [category] = await db
      .select()
      .from(blogCategories)
      .where(eq(blogCategories.id, id))
      .limit(1);

    if (!category) return null;

    const [{ count: postsCount }] = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(eq(blogPosts.categoryId, id));

    return {
      ...category,
      postsCount: postsCount || 0,
    };
  }

  // Comments
  async createComment(data: Omit<BlogComment, 'id'>): Promise<BlogComment> {
    const [comment] = await db
      .insert(blogComments)
      .values(data)
      .returning();
    
    return comment;
  }

  async getCommentsByPostId(postId: string): Promise<BlogCommentWithAuthor[]> {
    const result = await db
      .select({
        comment: blogComments,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
      })
      .from(blogComments)
      .leftJoin(users, eq(blogComments.authorId, users.id))
      .where(eq(blogComments.postId, postId))
      .orderBy(desc(blogComments.createdAt));

    return result.map(item => ({
      ...item.comment,
      author: item.author,
    }));
  }

  // Tags
  async createTag(data: Omit<BlogTag, 'id'>): Promise<BlogTag> {
    const [tag] = await db
      .insert(blogTags)
      .values({
        ...data,
        slug: this.generateSlug(data.name),
      })
      .returning();
    
    return tag;
  }

  async getTags(): Promise<BlogTagWithStats[]> {
    const tags = await db.select().from(blogTags);
    
    return Promise.all(
      tags.map(async (tag) => {
        const [{ count: postsCount }] = await db
          .select({ count: count() })
          .from(blogPostTags)
          .where(eq(blogPostTags.tagId, tag.id));
        
        return {
          ...tag,
          postsCount: postsCount || 0,
        };
      })
    );
  }

  // Statistics for dashboard
  async getBlogStatistics(): Promise<BlogStatistics> {
    const [totalPosts] = await db.select({ count: count() }).from(blogPosts);
    const [publishedPosts] = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(eq(blogPosts.status, 'published'));
    const [draftPosts] = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(eq(blogPosts.status, 'draft'));
    const [totalCategories] = await db.select({ count: count() }).from(blogCategories);
    const [totalTags] = await db.select({ count: count() }).from(blogTags);
    const [totalComments] = await db.select({ count: count() }).from(blogComments);
    const [approvedComments] = await db
      .select({ count: count() })
      .from(blogComments)
      .where(eq(blogComments.isApproved, true));
    const [pendingComments] = await db
      .select({ count: count() })
      .from(blogComments)
      .where(eq(blogComments.isApproved, false));
    
    // Get unique authors count
    const [totalAuthors] = await db
      .select({ count: sql`COUNT(DISTINCT ${blogPosts.authorId})` })
      .from(blogPosts);

    // Get recent posts
    const { posts: recentPosts } = await this.getPosts(
      {},
      { field: 'createdAt', direction: 'desc' },
      { page: 1, limit: 5 }
    );

    // Get popular posts (by view count)
    const { posts: popularPosts } = await this.getPosts(
      { status: 'published' },
      { field: 'viewCount', direction: 'desc' },
      { page: 1, limit: 5 }
    );

    // Get recent comments
    const recentComments = await db
      .select({
        comment: blogComments,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
          image: users.image,
        },
        post: {
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
        },
      })
      .from(blogComments)
      .leftJoin(users, eq(blogComments.authorId, users.id))
      .leftJoin(blogPosts, eq(blogComments.postId, blogPosts.id))
      .orderBy(desc(blogComments.createdAt))
      .limit(5);

    return {
      totalPosts: totalPosts.count,
      publishedPosts: publishedPosts.count,
      draftPosts: draftPosts.count,
      totalCategories: totalCategories.count,
      totalTags: totalTags.count,
      totalComments: totalComments.count,
      approvedComments: approvedComments.count,
      pendingComments: pendingComments.count,
      totalAuthors: Number(totalAuthors.count),
      recentPosts,
      popularPosts,
      recentComments: recentComments.map(item => ({
        ...item.comment,
        author: item.author,
        post: item.post,
      })),
    };
  }

  // Private helper methods
  private generateSlug(text: string): string {
    return slugify(text, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

  private async getPostTags(postId: string): Promise<BlogTag[]> {
    const result = await db
      .select({ tag: blogTags })
      .from(blogPostTags)
      .leftJoin(blogTags, eq(blogPostTags.tagId, blogTags.id))
      .where(eq(blogPostTags.postId, postId));

    return result.map(item => item.tag).filter(Boolean);
  }

  private async getPostCommentsCount(postId: string): Promise<number> {
    const [{ count: commentsCount }] = await db
      .select({ count: count() })
      .from(blogComments)
      .where(and(
        eq(blogComments.postId, postId),
        eq(blogComments.isApproved, true)
      ));

    return commentsCount || 0;
  }

  private async associatePostTags(postId: string, tagIds: string[]): Promise<void> {
    if (tagIds.length === 0) return;

    const associations = tagIds.map(tagId => ({
      postId,
      tagId,
    }));

    await db.insert(blogPostTags).values(associations);
  }

  private async updatePostTags(postId: string, tagIds: string[]): Promise<void> {
    // Remove existing associations
    await db.delete(blogPostTags).where(eq(blogPostTags.postId, postId));
    
    // Add new associations
    if (tagIds.length > 0) {
      await this.associatePostTags(postId, tagIds);
    }
  }
}