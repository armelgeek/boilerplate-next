'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { useBlogCategories, useCreateBlogCategory, useDeleteBlogCategory } from '../../hooks/use-blog-categories';
import { useBlogPosts } from '../../hooks/use-blog-posts';
import { useToast } from '@/shared/hooks/use-toast';
import { BlogCategory } from '../../config/blog.types';

export function CategoryManagement() {
  const { toast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categoriesData, isLoading } = useBlogCategories();
  const createCategoryMutation = useCreateBlogCategory();
  const deleteCategoryMutation = useDeleteBlogCategory();

  // Get posts for selected category
  const { data: categoryPostsData } = useBlogPosts(
    selectedCategory ? { categoryId: selectedCategory } : {},
    { field: 'createdAt', direction: 'desc' },
    { page: 1, limit: 10 }
  );

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
      });
      
      setNewCategoryName('');
      setNewCategoryDescription('');
      setIsCreating(false);
      
      toast({
        title: 'Success',
        description: 'Category created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create category',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCategory = async (category: BlogCategory) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      await deleteCategoryMutation.mutateAsync(category.id!);
      
      // Clear selection if deleted category was selected
      if (selectedCategory === category.id) {
        setSelectedCategory(null);
      }
      
      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const selectedCategoryData = categoriesData?.categories.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h2 className="font-semibold text-xl">Category Management</h2>
        <p className="text-muted-foreground text-sm">
          Manage blog categories and their associated posts
        </p>
      </div>

      <div className="gap-6 grid lg:grid-cols-2">
        {/* Categories List */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <div>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage your blog categories</CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setIsCreating(!isCreating)}
              variant={isCreating ? "outline" : "default"}
            >
              <Plus className="mr-2 w-4 h-4" />
              {isCreating ? 'Cancel' : 'New Category'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Create New Category Form */}
            {isCreating && (
              <div className="p-4 border rounded-lg space-y-3">
                <div>
                  <Input
                    placeholder="Category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                </div>
                <div>
                  <Input
                    placeholder="Description (optional)"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateCategory}
                    disabled={!newCategoryName.trim() || createCategoryMutation.isPending}
                  >
                    {createCategoryMutation.isPending ? 'Creating...' : 'Create'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setNewCategoryName('');
                      setNewCategoryDescription('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Categories Table */}
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="border-primary border-t-2 rounded-full w-6 h-6 animate-spin"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Posts</TableHead>
                    <TableHead className="w-24">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesData?.categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-6 text-center text-muted-foreground">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    categoriesData?.categories.map((category) => (
                      <TableRow 
                        key={category.id}
                        className={`cursor-pointer ${selectedCategory === category.id ? 'bg-muted' : ''}`}
                        onClick={() => setSelectedCategory(
                          selectedCategory === category.id ? null : (category.id || null)
                        )}
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            {category.description && (
                              <p className="text-muted-foreground text-sm line-clamp-1">
                                {category.description}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {category.postsCount} posts
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // TODO: Implement edit functionality
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(category);
                              }}
                              disabled={deleteCategoryMutation.isPending}
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

        {/* Category Posts */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedCategoryData ? (
                <>Posts in "{selectedCategoryData.name}"</>
              ) : (
                'Category Posts'
              )}
            </CardTitle>
            <CardDescription>
              {selectedCategoryData 
                ? `${selectedCategoryData.postsCount} posts in this category`
                : 'Select a category to view its posts'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedCategory ? (
              <div className="flex flex-col justify-center items-center py-8 text-center">
                <BookOpen className="mb-4 w-12 h-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Click on a category to view its posts
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {categoryPostsData?.posts.length === 0 ? (
                  <p className="py-6 text-center text-muted-foreground">
                    No posts in this category
                  </p>
                ) : (
                  categoryPostsData?.posts.map((post) => (
                    <div key={post.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium line-clamp-1">{post.title}</h4>
                          {post.excerpt && (
                            <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            <Badge 
                              variant={post.status === 'published' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {post.status}
                            </Badge>
                            <span className="text-muted-foreground text-xs">
                              by {post.author?.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}