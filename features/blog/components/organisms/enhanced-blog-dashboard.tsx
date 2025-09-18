'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Users, 
  Tag, 
  Folder, 
  TrendingUp, 
  Eye, 
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { useBlogStatistics } from '../../hooks/use-blog-statistics';
import { RecentActivity } from './recent-activity';
import { BlogStatistics } from '../../config/blog.types';
import Link from 'next/link';

export function EnhancedBlogDashboard() {
  const { data: statistics, isLoading, error } = useBlogStatistics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-8 bg-muted rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-64 animate-pulse"></div>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
                <div className="bg-muted rounded w-16 h-4"></div>
                <div className="bg-muted rounded w-4 h-4"></div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded w-12 h-8 mb-2"></div>
                <div className="bg-muted rounded w-20 h-3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center">
            ⚠️ Error Loading Blog Statistics
          </CardTitle>
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
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-bold text-2xl text-foreground">Blog Overview</h2>
          <p className="text-muted-foreground">
            Monitor your blog performance and content metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/d/blog">
              <FileText className="mr-2 w-4 h-4" />
              All Posts
            </Link>
          </Button>
          <Button asChild>
            <Link href="/d/blog/new">
              <BookOpen className="mr-2 w-4 h-4" />
              New Post
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <EnhancedStatsCard
          title="Total Posts"
          value={statistics.totalPosts}
          description={`${statistics.publishedPosts} published, ${statistics.draftPosts} drafts`}
          icon={BookOpen}
          color="blue"
          trend={statistics.publishedPosts > statistics.draftPosts ? 'up' : 'down'}
        />
        <EnhancedStatsCard
          title="Categories"
          value={statistics.totalCategories}
          description="Content organization"
          icon={Folder}
          color="purple"
        />
        <EnhancedStatsCard
          title="Comments"
          value={statistics.totalComments}
          description={`${statistics.approvedComments} approved`}
          icon={MessageSquare}
          color="green"
          trend={statistics.approvedComments > statistics.pendingComments ? 'up' : 'down'}
        />
        <EnhancedStatsCard
          title="Authors"
          value={statistics.totalAuthors}
          description="Content contributors"
          icon={Users}
          color="amber"
        />
      </div>

      {/* Publishing Status Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <PieChart className="mr-2 w-5 h-5" />
              Publishing Status
            </CardTitle>
            <CardDescription>
              Distribution of your content by status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Published</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono">{statistics.publishedPosts}</span>
                  <Badge variant="outline" className="text-xs">
                    {statistics.totalPosts > 0 ? Math.round((statistics.publishedPosts / statistics.totalPosts) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={statistics.totalPosts > 0 ? (statistics.publishedPosts / statistics.totalPosts) * 100 : 0} 
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium">Drafts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono">{statistics.draftPosts}</span>
                  <Badge variant="outline" className="text-xs">
                    {statistics.totalPosts > 0 ? Math.round((statistics.draftPosts / statistics.totalPosts) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={statistics.totalPosts > 0 ? (statistics.draftPosts / statistics.totalPosts) * 100 : 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <BarChart3 className="mr-2 w-5 h-5" />
              Comment Moderation
            </CardTitle>
            <CardDescription>
              Monitor comment activity and moderation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Approved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono">{statistics.approvedComments}</span>
                  <Badge variant="default" className="text-xs">
                    {statistics.totalComments > 0 ? Math.round((statistics.approvedComments / statistics.totalComments) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={statistics.totalComments > 0 ? (statistics.approvedComments / statistics.totalComments) * 100 : 0} 
                className="h-2"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium">Pending</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono">{statistics.pendingComments}</span>
                  <Badge variant="secondary" className="text-xs">
                    {statistics.totalComments > 0 ? Math.round((statistics.pendingComments / statistics.totalComments) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={statistics.totalComments > 0 ? (statistics.pendingComments / statistics.totalComments) * 100 : 0} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Popular Posts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <Activity className="mr-2 w-5 h-5" />
              Recent Posts
            </CardTitle>
            <CardDescription>
              Your latest blog content
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statistics.recentPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start creating content for your blog
                </p>
                <Button asChild size="sm">
                  <Link href="/d/blog/new">
                    <BookOpen className="mr-2 w-4 h-4" />
                    Create First Post
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {statistics.recentPosts.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">{post.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <Badge variant={post.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                          {post.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Calendar className="mr-1 w-3 h-3" />
                          {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Eye className="mr-1 w-3 h-3" />
                        {post.viewCount || 0}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/d/blog">
                      View All Posts
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <TrendingUp className="mr-2 w-5 h-5" />
              Popular Posts
            </CardTitle>
            <CardDescription>
              Most viewed content
            </CardDescription>
          </CardHeader>
          <CardContent>
            {statistics.popularPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <TrendingUp className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No popular posts yet</h3>
                <p className="text-muted-foreground">
                  Create and publish content to see popular posts
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {statistics.popularPosts.slice(0, 5).map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-1">{post.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {post.category?.name || 'Uncategorized'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-muted-foreground flex items-center">
                        <Eye className="mr-1 w-3 h-3" />
                        {post.viewCount || 0}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface EnhancedStatsCardProps {
  title: string;
  value: number;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'purple' | 'amber' | 'red';
  trend?: 'up' | 'down';
}

function EnhancedStatsCard({ title, value, description, icon: Icon, color, trend }: EnhancedStatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-50 to-blue-100/50 border-blue-200',
    green: 'from-green-50 to-green-100/50 border-green-200',
    purple: 'from-purple-50 to-purple-100/50 border-purple-200',
    amber: 'from-amber-50 to-amber-100/50 border-amber-200',
    red: 'from-red-50 to-red-100/50 border-red-200',
  };

  const iconColorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  return (
    <Card className={`shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br ${colorClasses[color]}`}>
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${iconColorClasses[color]}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="font-bold text-2xl">
              {value.toLocaleString()}
            </div>
            <p className="mt-1 text-muted-foreground text-xs">{description}</p>
          </div>
          {trend && (
            <div className={`flex items-center text-xs ${trend === 'up' ? 'text-green-600' : 'text-amber-600'}`}>
              <TrendingUp className={`w-3 h-3 mr-1 ${trend === 'down' ? 'rotate-180' : ''}`} />
              {trend === 'up' ? 'Growing' : 'Stable'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}