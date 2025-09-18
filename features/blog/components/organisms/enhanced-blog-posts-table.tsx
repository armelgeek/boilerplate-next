'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Eye, Edit, Trash2, Plus, Search, Folder, MoreHorizontal, Calendar, User, TrendingUp, Filter } from 'lucide-react';
import { useBlogPosts, useDeleteBlogPost } from '../../hooks/use-blog-posts';
import { useBlogCategories } from '../../hooks/use-blog-categories';
import { BlogPostFilter, BlogPostSort, PaginationParams } from '../../config/blog.types';
import { formatDateTime } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';
import { cn } from '@/shared/lib/utils';

export function EnhancedBlogPostsTable() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<BlogPostFilter>({});
  const [sort, setSort] = useState<BlogPostSort>({ field: 'createdAt', direction: 'desc' });
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10 });
  const [search, setSearch] = useState('');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  const { data: postsData, isLoading, error } = useBlogPosts(filter, sort, pagination);
  const { data: categoriesData } = useBlogCategories();
  const deletePostMutation = useDeleteBlogPost();

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilter(prev => ({ ...prev, search: value || undefined }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    const statusValue = status === 'all' ? undefined : (status as any);
    setFilter(prev => ({ ...prev, status: statusValue }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleCategoryFilter = (categoryId: string) => {
    const categoryValue = categoryId === 'all' ? undefined : categoryId;
    setFilter(prev => ({ ...prev, categoryId: categoryValue }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleDeletePost = async (id: string, title: string) => {
    try {
      await deletePostMutation.mutateAsync(id);
      toast({
        title: 'Success! 🗑️',
        description: `"${title}" deleted successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'published':
        return '🟢';
      case 'draft':
        return '🟡';
      case 'archived':
        return '⚫';
      default:
        return '🟡';
    }
  };

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center">
            ⚠️ Error Loading Posts
          </CardTitle>
          <CardDescription className="text-red-600">
            Failed to load blog posts. Please try again.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="space-y-1">
            <h2 className="font-bold text-2xl text-foreground">Blog Posts</h2>
            <p className="text-muted-foreground">
              Create, manage, and organize your blog content
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" className="shadow-sm">
              <Link href="/d/blog/categories">
                <Folder className="mr-2 w-4 h-4" />
                Categories
              </Link>
            </Button>
            <Button asChild className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/d/blog/new">
                <Plus className="mr-2 w-4 h-4" />
                New Post
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                  <p className="text-xl font-bold">{postsData?.totalCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Eye className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-xl font-bold">
                    {postsData?.posts.filter(p => p.status === 'published').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-500 rounded-lg">
                  <Edit className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Drafts</p>
                  <p className="text-xl font-bold">
                    {postsData?.posts.filter(p => p.status === 'draft').length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <Folder className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-xl font-bold">{categoriesData?.categories.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Filters */}
      <Card className="shadow-sm border-0 bg-gradient-to-r from-background to-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Filter className="mr-2 w-5 h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="relative">
              <Search className="top-3 left-3 absolute w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select onValueChange={handleStatusFilter} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="published">🟢 Published</SelectItem>
                <SelectItem value="draft">🟡 Draft</SelectItem>
                <SelectItem value="archived">⚫ Archived</SelectItem>
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select onValueChange={handleCategoryFilter} defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categoriesData?.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id || ''}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select 
              onValueChange={(value) => {
                const [field, direction] = value.split('-') as [any, 'asc' | 'desc'];
                setSort({ field, direction });
              }}
              defaultValue="createdAt-desc"
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">🕐 Newest first</SelectItem>
                <SelectItem value="createdAt-asc">🕐 Oldest first</SelectItem>
                <SelectItem value="title-asc">📝 Title A-Z</SelectItem>
                <SelectItem value="title-desc">📝 Title Z-A</SelectItem>
                <SelectItem value="viewCount-desc">👁️ Most viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Posts Table */}
      <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/20">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <div className="flex items-center space-x-2 mb-4">
                <div className="border-primary border-t-2 rounded-full w-8 h-8 animate-spin"></div>
                <span className="text-lg font-medium">Loading posts...</span>
              </div>
              <p className="text-muted-foreground">Please wait while we fetch your content</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Post Details</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Author</TableHead>
                  <TableHead className="font-semibold">Performance</TableHead>
                  <TableHead className="w-32 font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postsData?.posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                          📝
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg">No blog posts found</h3>
                          <p className="text-muted-foreground">
                            {search || filter.status || filter.categoryId 
                              ? 'Try adjusting your filters or search terms'
                              : 'Create your first blog post to get started'
                            }
                          </p>
                        </div>
                        {!search && !filter.status && !filter.categoryId && (
                          <Button asChild>
                            <Link href="/d/blog/new">
                              <Plus className="mr-2 w-4 h-4" />
                              Create First Post
                            </Link>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  postsData?.posts.map((post) => (
                    <TableRow key={post.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium line-clamp-1 max-w-md">{post.title}</p>
                          {post.excerpt && (
                            <p className="text-muted-foreground text-sm line-clamp-1 max-w-md">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{post.createdAt ? formatDateTime(post.createdAt).dateOnly : 'N/A'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(post.status)} className="font-medium">
                          {getStatusIcon(post.status)} {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {post.category?.name ? (
                          <Badge variant="outline" className="font-medium">
                            {post.category.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">Uncategorized</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {post.author?.name || 'Unknown'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-mono font-medium">
                            {post.viewCount || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 w-4 h-4" />
                              View Post
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 w-4 h-4" />
                              Edit Post
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="mr-2 w-4 h-4" />
                                  Delete Post
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{post.title}"? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePost(post.id || '', post.title)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    disabled={deletePostMutation.isPending}
                                  >
                                    {deletePostMutation.isPending ? 'Deleting...' : 'Delete Post'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Pagination */}
      {postsData && postsData.totalPages > 1 && (
        <Card className="shadow-sm border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, postsData.totalCount)} of{' '}
                  {postsData.totalCount} posts
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, postsData.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.page === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  {postsData.totalPages > 5 && (
                    <>
                      <span className="text-muted-foreground">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setPagination(prev => ({ ...prev, page: postsData.totalPages }))}
                      >
                        {postsData.totalPages}
                      </Button>
                    </>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= postsData.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}