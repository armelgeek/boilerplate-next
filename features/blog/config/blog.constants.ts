// Blog module constants
export const BLOG_CONSTANTS = {
  // Pagination defaults
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50,
  
  // Content limits
  MAX_TITLE_LENGTH: 200,
  MAX_EXCERPT_LENGTH: 500,
  MAX_CONTENT_LENGTH: 50000,
  MAX_COMMENT_LENGTH: 1000,
  
  // Slug generation
  SLUG_SEPARATOR: '-',
  
  // Post statuses
  POST_STATUSES: ['draft', 'published', 'archived'] as const,
  
  // Default sort options
  DEFAULT_SORT: {
    field: 'createdAt' as const,
    direction: 'desc' as const,
  },
  
  // Cache keys
  CACHE_KEYS: {
    BLOG_STATS: 'blog:stats',
    RECENT_POSTS: 'blog:posts:recent',
    POPULAR_POSTS: 'blog:posts:popular',
    CATEGORIES: 'blog:categories',
    TAGS: 'blog:tags',
  },
  
  // Cache TTL (in seconds)
  CACHE_TTL: {
    STATS: 300, // 5 minutes
    POSTS: 600, // 10 minutes
    CATEGORIES: 1800, // 30 minutes
  },
} as const;

// API endpoints for blog
export const BLOG_API_ENDPOINTS = {
  posts: {
    base: '/api/v1/blog/posts',
    list: (qs: string) => `/api/v1/blog/posts${qs}`,
    create: '/api/v1/blog/posts',
    detail: (id: string) => `/api/v1/blog/posts/${id}`,
    update: (id: string) => `/api/v1/blog/posts/${id}`,
    delete: (id: string) => `/api/v1/blog/posts/${id}`,
    publish: (id: string) => `/api/v1/blog/posts/${id}/publish`,
    unpublish: (id: string) => `/api/v1/blog/posts/${id}/unpublish`,
    archive: (id: string) => `/api/v1/blog/posts/${id}/archive`,
  },
  categories: {
    base: '/api/v1/blog/categories',
    list: (qs: string) => `/api/v1/blog/categories${qs}`,
    create: '/api/v1/blog/categories',
    detail: (id: string) => `/api/v1/blog/categories/${id}`,
    update: (id: string) => `/api/v1/blog/categories/${id}`,
    delete: (id: string) => `/api/v1/blog/categories/${id}`,
    posts: (id: string, qs: string) => `/api/v1/blog/categories/${id}/posts${qs}`,
  },
  tags: {
    base: '/api/v1/blog/tags',
    list: (qs: string) => `/api/v1/blog/tags${qs}`,
    create: '/api/v1/blog/tags',
    detail: (id: string) => `/api/v1/blog/tags/${id}`,
    update: (id: string) => `/api/v1/blog/tags/${id}`,
    delete: (id: string) => `/api/v1/blog/tags/${id}`,
    posts: (id: string, qs: string) => `/api/v1/blog/tags/${id}/posts${qs}`,
  },
  comments: {
    base: '/api/v1/blog/comments',
    list: (qs: string) => `/api/v1/blog/comments${qs}`,
    create: '/api/v1/blog/comments',
    detail: (id: string) => `/api/v1/blog/comments/${id}`,
    update: (id: string) => `/api/v1/blog/comments/${id}`,
    delete: (id: string) => `/api/v1/blog/comments/${id}`,
    approve: (id: string) => `/api/v1/blog/comments/${id}/approve`,
    reject: (id: string) => `/api/v1/blog/comments/${id}/reject`,
    byPost: (postId: string, qs: string) => `/api/v1/blog/posts/${postId}/comments${qs}`,
  },
  statistics: {
    dashboard: '/api/v1/blog/statistics/dashboard',
    posts: '/api/v1/blog/statistics/posts',
    categories: '/api/v1/blog/statistics/categories',
    comments: '/api/v1/blog/statistics/comments',
  },
} as const;