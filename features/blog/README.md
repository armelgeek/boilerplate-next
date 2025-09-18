# Blog Module Documentation

## Overview

The Blog module is a complete content management system built following the repository's feature-driven architecture. It provides comprehensive functionality for managing blog posts, categories, tags, and comments with a focus on admin usability and relation management.

## Features

### ✅ Core Features Implemented

- **Blog Posts Management**: Full CRUD operations for blog posts
- **Categories Management**: Create, read, update, delete categories  
- **Tags System**: Many-to-many relationship between posts and tags
- **Comments System**: Threaded comments with approval workflow
- **Statistics Dashboard**: Real-time blog metrics and analytics
- **Admin UI**: Responsive, user-friendly administration interface
- **Relation Management**: Bidirectional editing following Copilot instructions

### 📊 Statistics & Analytics

The blog module automatically tracks and displays:
- Total posts, published/draft counts
- Categories and tags counts
- Comments (approved/pending)
- Authors count
- Recent posts and popular posts (by view count)
- Recent comments with moderation status

### 🔗 Relation Management

Following the updated Copilot instructions for relation management:

#### Post-Category Relations
- **From Category Detail**: View all posts in a category, add/remove posts
- **From Post Detail**: Select category via dropdown, change category easily
- **Bulk Operations**: Planned for future enhancement

#### Post-Tag Relations (Many-to-Many)
- **From Post Form**: Add/remove tags using tag input component
- **Tag Management**: Create tags on-the-fly during post creation
- **Visual Feedback**: Tags displayed as removable badges

## Architecture

### File Structure

```
features/blog/
├── config/
│   ├── blog.schema.ts      # Zod validation schemas
│   ├── blog.types.ts       # TypeScript type definitions
│   └── blog.constants.ts   # API endpoints and constants
├── domain/
│   ├── service.ts          # Business logic and data operations
│   └── use-cases/
│       ├── create-blog-post.use-case.ts
│       └── get-blog-statistics.use-case.ts
├── hooks/
│   ├── use-blog-posts.ts   # React Query hooks for posts
│   ├── use-blog-categories.ts
│   └── use-blog-statistics.ts
└── components/
    ├── molecules/
    │   └── blog-stats-cards.tsx
    └── organisms/
        ├── blog-dashboard.tsx
        ├── blog-posts-table.tsx
        ├── blog-post-form.tsx
        ├── category-management.tsx
        └── recent-activity.tsx
```

### Database Schema

```sql
-- Core entities
blog_categories (id, name, slug, description, timestamps)
blog_posts (id, title, slug, content, excerpt, status, author_id, category_id, timestamps)
blog_comments (id, content, post_id, author_id, parent_id, is_approved, timestamps)
blog_tags (id, name, slug, timestamps)

-- Relations
blog_post_tags (post_id, tag_id) -- Many-to-many junction table
```

## API Endpoints

### Posts
- `GET /api/v1/blog/posts` - List posts with filtering and pagination
- `POST /api/v1/blog/posts` - Create new post
- `GET /api/v1/blog/posts/[id]` - Get post details
- `PUT /api/v1/blog/posts/[id]` - Update post
- `DELETE /api/v1/blog/posts/[id]` - Delete post

### Categories
- `GET /api/v1/blog/categories` - List all categories
- `POST /api/v1/blog/categories` - Create new category

### Statistics
- `GET /api/v1/blog/statistics/dashboard` - Get dashboard metrics

## Usage Examples

### Creating a Blog Post

```tsx
import { BlogPostForm } from '@/features/blog/components/organisms/blog-post-form';

function CreatePost() {
  return (
    <BlogPostForm 
      onSuccess={() => router.push('/d/blog')}
      onCancel={() => router.back()}
    />
  );
}
```

### Displaying Blog Statistics

```tsx
import { BlogDashboard } from '@/features/blog/components/organisms/blog-dashboard';

function Dashboard() {
  return (
    <div>
      <h1>Blog Overview</h1>
      <BlogDashboard />
    </div>
  );
}
```

### Managing Categories

```tsx
import { CategoryManagement } from '@/features/blog/components/organisms/category-management';

function CategoriesPage() {
  return <CategoryManagement />;
}
```

## Admin Pages

- `/d/blog` - Main blog posts management table
- `/d/blog/new` - Create new blog post
- `/d/blog/categories` - Category management with post relations
- `/d` - Dashboard includes blog statistics overview

## Key Features Details

### 🎯 User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Feedback**: Toast notifications for all actions
- **Loading States**: Skeleton loaders and pending states
- **Error Handling**: Graceful error messages and recovery

### 🔍 Search & Filtering
- **Full-text Search**: Search in post titles and content
- **Status Filtering**: Filter by draft, published, archived
- **Category Filtering**: Filter posts by category
- **Pagination**: Efficient pagination for large datasets

### 📝 Content Management
- **Rich Metadata**: Title, slug, excerpt, featured image
- **Auto-slug Generation**: Automatic URL-friendly slug creation
- **Draft System**: Save posts as drafts before publishing
- **Version Control**: Track created/updated timestamps

### 🏷️ Tagging System
- **Dynamic Tags**: Create tags on-the-fly during post creation
- **Visual Management**: Tag chips with remove functionality
- **Search Integration**: Tags included in post search

## Performance Considerations

- **React Query Caching**: Efficient data fetching with 2-5 minute cache times
- **Pagination**: Prevents loading large datasets at once
- **Optimistic Updates**: UI updates immediately for better UX
- **Query Invalidation**: Smart cache invalidation on mutations

## Security

- **Input Validation**: Zod schemas validate all inputs
- **XSS Prevention**: Proper escaping of user content
- **API Error Handling**: Structured error responses
- **Type Safety**: Full TypeScript coverage

## Future Enhancements

- [ ] Rich text editor integration (TinyMCE/EditorJS)
- [ ] Image upload and management
- [ ] Comment moderation interface
- [ ] Advanced analytics and reporting
- [ ] Email notifications for comments
- [ ] SEO optimization features
- [ ] Content scheduling/publishing
- [ ] Multi-author workflows
- [ ] Post templates

## Integration with Dashboard

The blog module is fully integrated into the main admin dashboard at `/d`, displaying:
- Blog post counts (total, published, drafts)
- Category and tag statistics  
- Comment metrics (approved/pending)
- Recent activity feeds
- Popular content analytics

All statistics are automatically refreshed every 5 minutes for real-time insights.