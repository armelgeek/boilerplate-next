import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/features/blog/domain/service';
import { createBlogCategorySchema } from '@/features/blog/config/blog.schema';
import { z } from 'zod';

const blogService = new BlogService();

export async function GET() {
  try {
    const categories = await blogService.getCategories();
    
    return NextResponse.json({
      categories,
      totalCount: categories.length,
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the input data
    const validatedData = createBlogCategorySchema.parse(body);
    
    const category = await blogService.createCategory(validatedData);
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating blog category:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create blog category' },
      { status: 500 }
    );
  }
}