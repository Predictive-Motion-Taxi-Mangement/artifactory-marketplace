
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Folder, 
  Plus, 
  Search, 
  Filter, 
  Pencil, 
  Trash,
  ArrowUpDown,
  Loader2,
  Save,
  X,
  ArrowRight,
  Layers,
  Globe
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  parent_id?: string;
  created_at: string;
  updated_at?: string;
}

const categorySchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  slug: z.string().min(2, { message: "Slug must be at least 2 characters" })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { 
      message: "Slug must contain only lowercase letters, numbers, and hyphens" 
    }),
  description: z.string().optional(),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.string().optional(),
  parent_id: z.string().optional().nullable()
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const CategoriesList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [parentFilter, setParentFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const queryClient = useQueryClient();

  const fetchCategories = async () => {
    console.log("Fetching categories...");
    try {
      let query = supabase
        .from('categories')
        .select('*');
      
      query = query.order(sortField, { ascending: sortDirection === "asc" });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching categories:", error);
        throw error;
      }
      
      console.log("Categories fetched:", data);
      return (data || []) as Category[];
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories");
      return [];
    }
  };

  const fetchParentCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .is('parent_id', null);
      
      if (error) throw error;
      
      return data as Pick<Category, 'id' | 'name'>[];
    } catch (error) {
      console.error("Failed to fetch parent categories:", error);
      return [];
    }
  };

  const { data: categories = [], isLoading, error, refetch } = useQuery({
    queryKey: ['categories', sortField, sortDirection],
    queryFn: fetchCategories,
  });

  const { data: parentCategories = [] } = useQuery({
    queryKey: ['parentCategories'],
    queryFn: fetchParentCategories,
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      // Check if category has children
      const { data: children, error: childrenError } = await supabase
        .from('categories')
        .select('id')
        .eq('parent_id', id);
      
      if (childrenError) throw childrenError;
      
      if (children && children.length > 0) {
        throw new Error("Cannot delete a category that has subcategories");
      }
      
      // Check if category has products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', id);
      
      if (productsError) throw productsError;
      
      if (products && products.length > 0) {
        throw new Error("Cannot delete a category that has products");
      }
      
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['parentCategories'] });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast.error(`Failed to delete category: ${error.message}`);
    }
  });

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate(id);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get a map of parent category names for displaying in the table
  const parentCategoryMap = parentCategories.reduce((acc, category) => {
    acc[category.id] = category.name;
    return acc;
  }, {} as Record<string, string>);

  const getFilteredCategories = () => {
    return categories.filter(category => {
      const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesParent = parentFilter === "all" || 
                           (parentFilter === "parent" && !category.parent_id) ||
                           (parentFilter === "sub" && category.parent_id) ||
                           category.parent_id === parentFilter;
      
      return matchesSearch && matchesParent;
    });
  };

  const filteredCategories = getFilteredCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Folder className="h-6 w-6" />
            Categories
          </h1>
          <p className="text-muted-foreground">
            Manage product categories and subcategories
          </p>
        </div>
        <Button onClick={() => navigate('/admin/categories/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[200px] flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={parentFilter} onValueChange={setParentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="parent">Main Categories</SelectItem>
                  <SelectItem value="sub">Subcategories</SelectItem>
                  <Separator className="my-2" />
                  {parentCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-lg">Loading categories...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-destructive text-lg">Error loading categories</p>
              <Button className="mt-4" onClick={() => refetch()}>Try Again</Button>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-10">
              <Folder className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-2 text-lg font-medium">No categories found</p>
              <p className="text-muted-foreground">
                {searchTerm || parentFilter !== "all" 
                  ? "Try adjusting your search or filter criteria." 
                  : "Get started by creating your first category."}
              </p>
              {!searchTerm && parentFilter === "all" && (
                <Button className="mt-4" onClick={() => navigate('/admin/categories/new')}>
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                      <div className="flex items-center">
                        Name
                        {sortField === "name" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("slug")}>
                      <div className="flex items-center">
                        Slug
                        {sortField === "slug" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Parent</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
                      <div className="flex items-center">
                        Created
                        {sortField === "created_at" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        {category.parent_id ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {parentCategoryMap[category.parent_id] || 'Unknown'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                            Main Category
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(category.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/categories/edit/${category.id}`)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteCategory(category.id)}
                            title="Delete"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const CategoryFormWrapper: React.FC = () => {
  const { id } = useParams();
  return <CategoryForm categoryId={id} />;
};

const CategoryForm: React.FC<{ categoryId?: string }> = ({ categoryId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!categoryId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [slugError, setSlugError] = useState<string | null>(null);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      seo_title: '',
      seo_description: '',
      seo_keywords: '',
      parent_id: null
    }
  });

  // Watch the name field to auto-generate slug
  const watchName = form.watch("name");
  const watchSlug = form.watch("slug");

  // Auto-generate slug from name when name changes and slug is empty
  useEffect(() => {
    if (watchName && (!form.getValues("slug") || form.getValues("slug") === "")) {
      const slug = watchName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      form.setValue("slug", slug, { shouldValidate: true });
    }
  }, [watchName, form]);

  // Clear slug error when slug changes
  useEffect(() => {
    if (slugError) {
      setSlugError(null);
    }
  }, [watchSlug, slugError]);

  const { data: parentCategories = [], isLoading: isLoadingParents } = useQuery({
    queryKey: ['parentCategories'],
    queryFn: async () => {
      console.log("Fetching parent categories");
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .is('parent_id', null);
      
      if (error) {
        console.error("Error fetching parent categories:", error);
        throw error;
      }
      
      console.log("Parent categories fetched:", data);
      
      // If editing, filter out self to prevent circular reference
      const filteredData = isEditing
        ? data.filter(cat => cat.id !== categoryId) 
        : data;
      
      return filteredData as Pick<Category, 'id' | 'name'>[];
    },
  });

  const { isLoading } = useQuery({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      if (!categoryId) return null;
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        form.reset({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
          seo_keywords: data.seo_keywords || '',
          parent_id: data.parent_id || null
        });
      }
      
      return data;
    },
    enabled: isEditing,
  });

  // Check if slug already exists
  const checkSlugExists = async (slug: string): Promise<boolean> => {
    try {
      // Don't check against the current category when editing
      const query = supabase
        .from('categories')
        .select('id')
        .eq('slug', slug);
      
      if (isEditing && categoryId) {
        query.neq('id', categoryId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data && data.length > 0);
    } catch (error) {
      console.error("Error checking slug uniqueness:", error);
      return false;
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);
    setSlugError(null);
    
    try {
      console.log("Submitting category data:", data);
      
      // Check if slug already exists
      const slugExists = await checkSlugExists(data.slug);
      
      if (slugExists) {
        setSlugError("This slug is already in use. Please choose a different one.");
        form.setError("slug", { 
          type: "manual", 
          message: "This slug is already in use. Please choose a different one." 
        });
        setIsSubmitting(false);
        return;
      }
      
      // Prepare parent_id (convert "none" to null)
      const parentId = data.parent_id === "none" || !data.parent_id ? null : data.parent_id;
      
      if (isEditing && categoryId) {
        const { error } = await supabase
          .from('categories')
          .update({
            name: data.name,
            slug: data.slug,
            description: data.description || null,
            seo_title: data.seo_title || null,
            seo_description: data.seo_description || null,
            seo_keywords: data.seo_keywords || null,
            parent_id: parentId,
            updated_at: new Date().toISOString()
          })
          .eq('id', categoryId);
          
        if (error) throw error;
        toast.success("Category updated successfully");
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            name: data.name,
            slug: data.slug,
            description: data.description || null,
            seo_title: data.seo_title || null,
            seo_description: data.seo_description || null,
            seo_keywords: data.seo_keywords || null,
            parent_id: parentId
          });
          
        if (error) {
          console.error("Error saving category:", error);
          throw error;
        }
        toast.success("Category added successfully");
      }
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['parentCategories'] });
      
      navigate('/admin/categories');
    } catch (error: any) {
      console.error("Error saving category:", error);
      
      // Check if this is a duplicate key error
      if (error.message && error.message.includes("duplicate key value violates unique constraint")) {
        setSlugError("This slug is already in use. Please choose a different one.");
        form.setError("slug", { 
          type: "manual", 
          message: "This slug is already in use. Please choose a different one." 
        });
      } else {
        toast.error(`Failed to ${isEditing ? 'update' : 'add'} category: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-lg">Loading category details...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Category' : 'Add New Category'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Update the category details' : 'Fill in the details for the new category'}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the essential information about the category.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter category name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="category-slug" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL-friendly version of the name. Must be unique.
                          </FormDescription>
                          {slugError && (
                            <p className="text-sm font-medium text-destructive">{slugError}</p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parent Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          value={field.value || "none"}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="None (Main Category)" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None (Main Category)</SelectItem>
                            {isLoadingParents ? (
                              <div className="flex items-center justify-center p-2">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Loading...
                              </div>
                            ) : parentCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select a parent category if this is a subcategory.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <textarea
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe this category..."
                            rows={4}
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of the category.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="seo" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Information</CardTitle>
                  <CardDescription>
                    Optimize this category for search engines.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="seo_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SEO Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="SEO optimized title" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          The title that appears in search engine results (recommended: 50-60 characters).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seo_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <textarea
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Brief description for search engine results..."
                            rows={3}
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          The description that appears in search engine results (recommended: 150-160 characters).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="seo_keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Keywords</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="keyword1, keyword2, keyword3" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Keywords related to this category (comma separated).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="rounded-md border p-4 bg-muted/50">
                    <h3 className="flex items-center text-sm font-medium mb-2">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      SEO Preview
                    </h3>
                    <div className="space-y-1.5">
                      <p className="text-base text-blue-600 font-medium">
                        {form.watch("seo_title") || form.watch("name") || "Category Title"}
                      </p>
                      <p className="text-sm text-green-700">
                        yourdomain.com/{form.watch("slug") || "category-slug"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {form.watch("seo_description") || form.watch("description") || "This is how your category will appear in search engine results. Add a meta description to improve SEO."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/admin/categories')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update Category' : 'Create Category'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const CategoriesManager: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CategoriesList />} />
      <Route path="/new" element={<CategoryForm />} />
      <Route path="/edit/:id" element={<CategoryFormWrapper />} />
    </Routes>
  );
};

export default CategoriesManager;
