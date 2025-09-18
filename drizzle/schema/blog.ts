import { sql } from 'drizzle-orm';
import { boolean, pgEnum, pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { users } from './auth';

// Blog post status enum
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived']);

// Blog categories table
export const blogCategories = pgTable('blog_categories', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Blog posts table
export const blogPosts = pgTable('blog_posts', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  status: postStatusEnum('status').notNull().default('draft'),
  publishedAt: timestamp('published_at'),
  viewCount: integer('view_count').notNull().default(0),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id),
  categoryId: text('category_id')
    .references(() => blogCategories.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Blog comments table
export const blogComments = pgTable('blog_comments', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  content: text('content').notNull(),
  postId: text('post_id')
    .notNull()
    .references(() => blogPosts.id, { onDelete: 'cascade' }),
  authorId: text('author_id')
    .notNull()
    .references(() => users.id),
  parentId: text('parent_id')
    .references(() => blogComments.id), // For threaded comments
  isApproved: boolean('is_approved').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Blog tags table
export const blogTags = pgTable('blog_tags', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Blog post tags junction table (many-to-many)
export const blogPostTags = pgTable('blog_post_tags', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  postId: text('post_id')
    .notNull()
    .references(() => blogPosts.id, { onDelete: 'cascade' }),
  tagId: text('tag_id')
    .notNull()
    .references(() => blogTags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});