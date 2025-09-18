'use client';

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
import { Eye, Edit, Trash2, Plus, Search } from 'lucide-react';
import { useBlogPosts, useDeleteBlogPost } from '../../hooks/use-blog-posts';
import { useBlogCategories } from '../../hooks/use-blog-categories';
import { BlogPostFilter, BlogPostSort, PaginationParams } from '../../config/blog.types';
import { formatDateTime } from '@/shared/lib/utils';
import { useToast } from '@/shared/hooks/use-toast';

export function BlogPostsTable() {
  const { toast } = useToast();
  const [filter, setFilter] = useState<BlogPostFilter>({});
  const [sort, setSort] = useState<BlogPostSort>({ field: 'createdAt', direction: 'desc' });
  const [pagination, setPagination] = useState<PaginationParams>({ page: 1, limit: 10 });
  const [search, setSearch] = useState('');

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
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await deletePostMutation.mutateAsync(id);
      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
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

  if (error) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">Error Loading Posts</CardTitle>
          <CardDescription className="text-red-600">
            Failed to load blog posts. Please try again.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="font-semibold text-xl">Blog Posts</h2>
          <p className="text-muted-foreground text-sm">
            Manage your blog content
          </p>
        </div>
        <Button>
          <Plus className="mr-2 w-4 h-4" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="gap-4 grid sm:grid-cols-2 lg:grid-cols-4">
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
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
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
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <div className="border-primary border-t-2 rounded-full w-8 h-8 animate-spin"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead className="w-32">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {postsData?.posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      No blog posts found
                    </TableCell>
                  </TableRow>
                ) : (
                  postsData?.posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium line-clamp-1">{post.title}</p>
                          {post.excerpt && (
                            <p className="text-muted-foreground text-sm line-clamp-1">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(post.status)}>
                          {post.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {post.category?.name || (
                          <span className="text-muted-foreground">Uncategorized</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {post.author?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(post.createdAt).dateOnly}
                      </TableCell>
                      <TableCell>
                        {post.viewCount || 0}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeletePost(post.id, post.title)}
                            disabled={deletePostMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {postsData && postsData.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {pagination.page} of {postsData.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            disabled={pagination.page >= postsData.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}