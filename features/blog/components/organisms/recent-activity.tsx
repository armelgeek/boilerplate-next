import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogStatistics } from '../../config/blog.types';
import { formatDateTime } from '@/shared/lib/utils';

interface RecentActivityProps {
  statistics: BlogStatistics;
}

export function RecentActivity({ statistics }: RecentActivityProps) {
  return (
    <div className="gap-4 grid md:grid-cols-2 lg:grid-cols-3">
      {/* Recent Posts */}
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Latest blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statistics.recentPosts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent posts</p>
            ) : (
              statistics.recentPosts.map((post) => (
                <div key={post.id} className="flex flex-col space-y-1">
                  <p className="font-medium text-sm line-clamp-2">{post.title}</p>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : post.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {post.status}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {post.createdAt ? formatDateTime(post.createdAt).dateOnly : 'N/A'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Popular Posts */}
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Popular Posts</CardTitle>
          <CardDescription>Most viewed content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statistics.popularPosts.length === 0 ? (
              <p className="text-muted-foreground text-sm">No popular posts</p>
            ) : (
              statistics.popularPosts.map((post) => (
                <div key={post.id} className="flex flex-col space-y-1">
                  <p className="font-medium text-sm line-clamp-2">{post.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      {post.viewCount} views
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {post.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Comments */}
      <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Recent Comments</CardTitle>
          <CardDescription>Latest user engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {statistics.recentComments.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent comments</p>
            ) : (
              statistics.recentComments.map((comment) => (
                <div key={comment.id} className="flex flex-col space-y-1">
                  <p className="text-sm line-clamp-2">{comment.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">
                      by {comment.author.name}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      comment.isApproved 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {comment.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  {comment.post && (
                    <p className="text-muted-foreground text-xs">
                      on "{comment.post.title}"
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}