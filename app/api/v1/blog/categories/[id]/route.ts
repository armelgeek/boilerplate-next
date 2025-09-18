import { NextRequest, NextResponse } from 'next/server';
import { BlogService } from '@/features/blog/domain/service';
import { updateBlogCategorySchema } from '@/features/blog/config/blog.schema';
import { handleApiError } from '@/shared/lib/utils/handle-api-error';

const blogService = new BlogService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const category = await blogService.getCategoryById(id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate the update data
    const validatedData = updateBlogCategorySchema.parse({ ...body, id });
    
    const category = await blogService.updateCategory(id, validatedData);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(category);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const success = await blogService.deleteCategory(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Category deleted successfully',
      success: true 
    });
  } catch (error) {
    return handleApiError(error);
  }
}