'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useBlogStatistics } from '../../hooks/use-blog-statistics';
import { BlogStatsCards } from '../molecules/blog-stats-cards';
import { RecentActivity } from './recent-activity';

export function BlogDashboard() {
  const { data: statistics, isLoading, error } = useBlogStatistics();

  if (isLoading) {
    return (
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
              <div className="bg-gray-200 rounded w-16 h-4"></div>
              <div className="bg-gray-200 rounded w-4 h-4"></div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 rounded w-12 h-8 mb-2"></div>
              <div className="bg-gray-200 rounded w-20 h-3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Error Loading Blog Statistics</CardTitle>
          <CardDescription className="text-red-600">
            Failed to load blog dashboard data. Please try again.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-5">
        <BlogStatsCards statistics={statistics} />
      </div>

      {/* Recent Activity */}
      <RecentActivity statistics={statistics} />
    </div>
  );
}