'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Plus, Edit, Trash2, BookOpen, Search, Filter, ArrowUpDown, Users, FileText } from 'lucide-react';
import { useBlogCategories, useCreateBlogCategory, useDeleteBlogCategory } from '../../hooks/use-blog-categories';
import { useBlogPosts } from '../../hooks/use-blog-posts';
import { useToast } from '@/shared/hooks/use-toast';
import { BlogCategory } from '../../config/blog.types';
import { cn } from '@/shared/lib/utils';

export function EnhancedCategoryManagement() {
  const { toast } = useToast();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: categoriesData, isLoading } = useBlogCategories();
  const createCategoryMutation = useCreateBlogCategory();
  const deleteCategoryMutation = useDeleteBlogCategory();

  // Get posts for selected category
  const { data: categoryPostsData } = useBlogPosts(
    selectedCategory ? { categoryId: selectedCategory } : {},
    { field: 'createdAt', direction: 'desc' },
    { page: 1, limit: 10 }
  );

  const filteredCategories = categoriesData?.categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const selectedCategoryData = categoriesData?.categories.find(c => c.id === selectedCategory);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Category name is required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || undefined,
      });
      
      setNewCategoryName('');
      setNewCategoryDescription('');
      setShowCreateDialog(false);
      setIsCreating(false);
      
      toast({
        title: 'Success! 🎉',
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

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    try {
      await deleteCategoryMutation.mutateAsync(categoryId);
      
      if (selectedCategory === categoryId) {
        setSelectedCategory(null);
      }
      
      toast({
        title: 'Success! 🗑️',
        description: `Category "${categoryName}" deleted successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full w-12 h-12 border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="font-bold text-2xl text-foreground">Category Management</h2>
            <p className="text-muted-foreground">
              Organize your blog content with categories and manage post relationships
            </p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="shadow-lg hover:shadow-xl transition-shadow">
                <Plus className="mr-2 w-4 h-4" />
                New Category
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <BookOpen className="mr-2 w-5 h-5" />
                  Create New Category
                </DialogTitle>
                <DialogDescription>
                  Add a new category to organize your blog posts
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="category-name" className="text-sm font-medium">
                    Category Name *
                  </label>
                  <Input
                    id="category-name"
                    placeholder="Enter category name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="category-description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea
                    id="category-description"
                    placeholder="Enter category description (optional)"
                    value={newCategoryDescription}
                    onChange={(e) => setNewCategoryDescription(e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                  disabled={createCategoryMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateCategory}
                  disabled={createCategoryMutation.isPending || !newCategoryName.trim()}
                  className="min-w-[100px]"
                >
                  {createCategoryMutation.isPending ? (
                    <>
                      <div className="mr-2 w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    'Create Category'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <BookOpen className="mr-1 w-4 h-4" />
              {categoriesData?.categories.length || 0} categories
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enhanced Categories List */}
        <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <BookOpen className="mr-2 w-5 h-5" />
              Categories
            </CardTitle>
            <CardDescription>
              Click on a category to view and manage its posts
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No categories found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Create your first category to get started'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setShowCreateDialog(true)} variant="outline">
                    <Plus className="mr-2 w-4 h-4" />
                    Create Category
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-center">Posts</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow 
                      key={category.id}
                      className={cn(
                        "cursor-pointer transition-colors hover:bg-muted/50",
                        selectedCategory === category.id && "bg-primary/10 border-l-4 border-l-primary"
                      )}
                      onClick={() => setSelectedCategory(
                        selectedCategory === category.id ? null : (category.id || null)
                      )}
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{category.name}</span>
                            {selectedCategory === category.id && (
                              <Badge variant="secondary" className="text-xs">
                                Selected
                              </Badge>
                            )}
                          </div>
                          {category.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-mono">
                          {category.postsCount}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                disabled={deleteCategoryMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{category.name}"? This action cannot be undone.
                                  {category.postsCount > 0 && (
                                    <span className="block mt-2 text-amber-600 font-medium">
                                      Warning: This category contains {category.postsCount} post(s). 
                                      These posts will become uncategorized.
                                    </span>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category.id || '', category.name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete Category
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Category Details & Posts Management */}
        <Card className="shadow-sm border-0 bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg">
              <FileText className="mr-2 w-5 h-5" />
              {selectedCategoryData ? `Posts in "${selectedCategoryData.name}"` : 'Category Posts'}
            </CardTitle>
            <CardDescription>
              {selectedCategory 
                ? 'Manage posts associated with this category'
                : 'Select a category to view and manage its posts'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedCategory ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ArrowUpDown className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No category selected</h3>
                <p className="text-muted-foreground">
                  Click on a category from the list to view its posts
                </p>
              </div>
            ) : categoryPostsData?.posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="font-semibold text-lg mb-2">No posts in this category</h3>
                <p className="text-muted-foreground mb-4">
                  This category doesn't have any posts yet
                </p>
                <Button variant="outline">
                  <Plus className="mr-2 w-4 h-4" />
                  Add Posts to Category
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {categoryPostsData?.posts.length} posts
                    </Badge>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="mr-2 w-4 h-4" />
                    Add Posts
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {categoryPostsData?.posts.map((post) => (
                    <div 
                      key={post.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-clamp-1">{post.title}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {post.viewCount || 0} views
                          </span>
                          {post.author?.name && (
                            <span className="text-sm text-muted-foreground">
                              by {post.author.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}