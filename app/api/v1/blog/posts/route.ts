import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/features/blog/domain/service';
import { createBlogPostUseCase } from '@/features/blog/domain/use-cases/create-blog-post.use-case';
import { z } from 'zod';

const blogService = new BlogService();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as 'draft' | 'published' | 'archived' | undefined;
    const categoryId = searchParams.get('categoryId') || undefined;
    const authorId = searchParams.get('authorId') || undefined;
    const search = searchParams.get('search') || undefined;
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortDirection = searchParams.get('sortDirection') || 'desc';

    const filter = {
      status,
      categoryId,
      authorId,
      search,
    };

    const sort = {
      field: sortField as 'createdAt' | 'updatedAt' | 'publishedAt' | 'title' | 'viewCount',
      direction: sortDirection as 'asc' | 'desc',
    };

    const pagination = { page, limit };

    const { posts, totalCount } = await blogService.getPosts(filter, sort, pagination);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      posts,
      totalCount,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create the blog post using the use case
    const post = await createBlogPostUseCase(body);
    
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}