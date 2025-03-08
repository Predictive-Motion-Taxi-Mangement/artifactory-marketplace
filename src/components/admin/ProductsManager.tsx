
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Pencil, 
  Trash,
  ArrowUpDown,
  Loader2,
  Copy,
  Image,
  Tag,
  DollarSign,
  Save,
  X,
  Check,
  FolderTree
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import ImageUploader from "./ImageUploader";

interface Product {
  id: string;
  title: string;
  price: number;
  artist: string;
  category: string;
  category_id?: string;
  description?: string;
  image_url?: string;
  dimensions?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

interface Category {
  id: string;
  name: string;
  parent_id?: string;
  description?: string;
}

const productSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0" }),
  artist: z.string().min(2, { message: "Artist name is required" }),
  category: z.string().min(1, { message: "Please select a category" }),
  category_id: z.string().optional(),
  description: z.string().optional(),
  image_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  dimensions: z.string().optional(),
  tags: z.array(z.string()).optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchProducts = async () => {
    console.log("Fetching products...");
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories(id, name, parent_id)
        `);
      
      query = query.order(sortField, { ascending: sortDirection === "asc" });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      // Map the data to include the category name from the categories relation
      const mappedData = data?.map(product => ({
        ...product,
        category: product.categories?.name || product.category || "Uncategorized"
      }));
      
      console.log("Products fetched:", mappedData);
      return (mappedData || []) as Product[];
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
      return [];
    }
  };

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data as Category[];
    }
  });

  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ['products', sortField, sortDirection],
    queryFn: fetchProducts,
  });

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Get all categories including subcategories
  const getAllCategories = () => {
    // Create a map of category ids to their data
    const categoryMap = categories.reduce<Record<string, Category & { path: string }>>((acc, cat) => {
      acc[cat.id] = { ...cat, path: cat.name };
      return acc;
    }, {});
    
    // Add the full path for subcategories
    categories.forEach(cat => {
      if (cat.parent_id && categoryMap[cat.parent_id]) {
        categoryMap[cat.id].path = `${categoryMap[cat.parent_id].path} > ${cat.name}`;
      }
    });
    
    return Object.values(categoryMap);
  };

  const allCategories = getAllCategories();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artist?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || '';
    
    const matchesCategory = categoryFilter === "all" || 
                          (product.category_id && product.category_id === categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  const handleDuplicateProduct = async (product: Product) => {
    try {
      const newProduct = {
        title: product.title || "Untitled (Copy)", 
        price: typeof product.price === 'number' ? product.price : 0, 
        artist: product.artist || "Unknown", 
        category: product.category || "Uncategorized",
        category_id: product.category_id || null,
        description: product.description || "",
        image_url: product.image_url || "",
        dimensions: product.dimensions || "",
        tags: product.tags || []
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert(newProduct)
        .select();
      
      if (error) throw error;
      
      toast.success("Product duplicated successfully");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    } catch (error) {
      console.error("Error duplicating product:", error);
      toast.error("Failed to duplicate product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast.success("Product deleted successfully");
        queryClient.invalidateQueries({ queryKey: ['products'] });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
      }
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Products
          </h1>
        </div>
        <Card className="p-6 text-center">
          <p className="text-destructive text-lg">Error loading products</p>
          <p className="text-muted-foreground">Please try again later or contact support</p>
          <Button className="mt-4" onClick={() => refetch()}>Try Again</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Products
          </h1>
          <p className="text-muted-foreground">Manage your store's products</p>
        </div>
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-[250px] flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <Separator className="my-2" />
                  {isLoadingCategories ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </div>
                  ) : allCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-10">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
              <p className="mt-2 text-lg">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <Package className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-2 text-lg font-medium">No products found</p>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
                      <div className="flex items-center">
                        Product
                        {sortField === "title" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
                      <div className="flex items-center">
                        Price
                        {sortField === "price" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Artist</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>
                      <div className="flex items-center">
                        Date Added
                        {sortField === "created_at" && (
                          <ArrowUpDown className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          {product.image_url && (
                            <div className="w-10 h-10 mr-3 rounded overflow-hidden bg-muted">
                              <img 
                                src={product.image_url} 
                                alt={product.title} 
                                className="w-full h-full object-cover"
                                onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                              />
                            </div>
                          )}
                          <div>{product.title || 'Untitled'}</div>
                        </div>
                      </TableCell>
                      <TableCell>${parseFloat((product.price || 0).toString()).toFixed(2)}</TableCell>
                      <TableCell>{product.artist || 'Unknown'}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {product.category || 'Uncategorized'}
                        </span>
                      </TableCell>
                      <TableCell>{product.created_at ? new Date(product.created_at).toLocaleDateString() : 'Unknown'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDuplicateProduct(product)}
                            title="Duplicate"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteProduct(product.id)}
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

const ProductFormWrapper: React.FC = () => {
  const { id } = useParams();
  return <ProductForm productId={id} />;
};

const ProductForm: React.FC<{ productId?: string }> = ({ productId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!productId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      price: 0,
      artist: '',
      category: '',
      category_id: '',
      description: '',
      image_url: '',
      dimensions: '',
      tags: []
    }
  });

  // Fetch categories for dropdown
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;
      return data as Category[];
    }
  });

  // Get all categories including subcategories with proper formatting
  const getAllCategories = () => {
    // Create a map of category ids to their data
    const categoryMap = categories.reduce<Record<string, Category & { path: string }>>((acc, cat) => {
      acc[cat.id] = { ...cat, path: cat.name };
      return acc;
    }, {});
    
    // Add the full path for subcategories
    categories.forEach(cat => {
      if (cat.parent_id && categoryMap[cat.parent_id]) {
        categoryMap[cat.id].path = `${categoryMap[cat.parent_id].path} > ${cat.name}`;
      }
    });
    
    return Object.values(categoryMap);
  };

  const allCategories = getAllCategories();
  
  const { isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(id, name)
        `)
        .eq('id', productId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Set category_id for the dropdown
        const categoryId = data.category_id || data.categories?.id;
        const categoryName = data.categories?.name || data.category || '';
        
        form.reset({
          title: data.title || '',
          price: data.price || 0,
          artist: data.artist || '',
          category: categoryName,
          category_id: categoryId || '',
          description: data.description || '',
          image_url: data.image_url || '',
          dimensions: data.dimensions || '',
          tags: data.tags || []
        });
      }
      
      return data;
    },
    enabled: isEditing,
  });
  
  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    form.setValue('category_id', categoryId);
    form.setValue('category', category?.name || '');
  };
  
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    const currentTags = form.getValues('tags') || [];
    if (!currentTags.includes(tagInput.trim())) {
      form.setValue('tags', [...currentTags, tagInput.trim()]);
    }
    setTagInput('');
  };
  
  const removeTag = (tag: string) => {
    const currentTags = form.getValues('tags') || [];
    form.setValue('tags', currentTags.filter(t => t !== tag));
  };

  const handleImageUploaded = (url: string) => {
    form.setValue('image_url', url);
  };
  
  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting product data:", data);
      
      const productData = {
        title: data.title || "Untitled",
        price: typeof data.price === 'number' ? data.price : 0,
        artist: data.artist || "Unknown",
        category: data.category || "Uncategorized",
        category_id: data.category_id || null,
        description: data.description || "",
        image_url: data.image_url || "",
        dimensions: data.dimensions || "",
        tags: data.tags || []
      };

      if (isEditing && productId) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', productId);
          
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        console.log("Inserting new product:", productData);
        const { error } = await supabase
          .from('products')
          .insert(productData);
          
        if (error) {
          console.error("Supabase insert error:", error);
          throw error;
        }
        toast.success("Product added successfully");
      }
      
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/admin/products');
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} product: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="mt-2 text-lg">Loading product details...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Edit Product' : 'Add New Product'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Update the product details' : 'Fill in the details for the new product'}
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Enter the essential information about the product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input 
                                type="number" 
                                step="0.01" 
                                min="0" 
                                placeholder="0.00" 
                                className="pl-8"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="artist"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Artist</FormLabel>
                          <FormControl>
                            <Input placeholder="Artist name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <div className="flex items-center gap-2">
                            <Select 
                              onValueChange={handleCategoryChange}
                              value={field.value || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {isLoadingCategories ? (
                                  <div className="flex items-center justify-center p-2">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Loading...
                                  </div>
                                ) : allCategories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    <div className="flex items-center">
                                      <span>{category.path}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              type="button"
                              onClick={() => navigate('/admin/categories/new')}
                              title="Add New Category"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <FormDescription>
                            <span className="flex items-center mt-1 text-xs">
                              <FolderTree className="h-3 w-3 mr-1" />
                              Select a category for this product or create a new one
                            </span>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <textarea
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe your product..."
                            rows={5}
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of the artwork.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Additional information about the product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="dimensions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dimensions</FormLabel>
                        <FormControl>
                          <Input placeholder='e.g., 24" x 36"' {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>
                          The physical dimensions of the artwork.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex mt-1.5 mb-1.5">
                      <Input 
                        placeholder="Add a tag"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="mr-2"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        variant="secondary"
                        onClick={addTag}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                    <FormDescription>
                      Add tags to help customers find your product.
                    </FormDescription>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {form.watch('tags')?.map((tag) => (
                        <div 
                          key={tag} 
                          className="bg-muted px-2 py-1 rounded-md flex items-center text-sm"
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 ml-1 p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="media" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                  <CardDescription>
                    Add images and media files for the product.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Image</FormLabel>
                        <FormControl>
                          <ImageUploader 
                            onImageUploaded={handleImageUploaded} 
                            existingImageUrl={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center gap-2">
                    <Separator className="flex-1" />
                    <span className="text-xs text-muted-foreground px-2">OR</span>
                    <Separator className="flex-1" />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Image className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              className="pl-8"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Alternatively, enter a URL for the product image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {form.watch('image_url') && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Image Preview</p>
                      <div className="border rounded-md overflow-hidden w-full max-w-md h-64 bg-muted">
                        <img 
                          src={form.watch('image_url')} 
                          alt="Product preview" 
                          className="w-full h-full object-contain"
                          onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/admin/products')}
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
                  {isEditing ? 'Update Product' : 'Create Product'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

const ProductsManager: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductsList />} />
      <Route path="/new" element={<ProductForm />} />
      <Route path="/edit/:id" element={<ProductFormWrapper />} />
    </Routes>
  );
};

export default ProductsManager;
