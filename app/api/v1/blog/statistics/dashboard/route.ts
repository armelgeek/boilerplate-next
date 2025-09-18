import { NextResponse } from 'next/server';
import { getBlogStatisticsUseCase } from '@/features/blog/domain/use-cases/get-blog-statistics.use-case';

export async function GET() {
  try {
    const statistics = await getBlogStatisticsUseCase();
    
    return NextResponse.json(statistics, { status: 200 });
  } catch (error) {
    console.error('Error fetching blog statistics:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch blog statistics' },
      { status: 500 }
    );
  }
}