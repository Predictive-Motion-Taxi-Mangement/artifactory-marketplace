
import React, { useState } from "react";
import { Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  Upload,
  Check
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

interface Product {
  id: string;
  title: string;
  price: number;
  artist: string;
  category: string;
  description?: string;
  image_url?: string;
  dimensions?: string;
  tags?: string[];
  created_at: string;
  updated_at?: string;
}

const categories = [
  "Abstract", 
  "Portrait", 
  "Landscape", 
  "Surreal", 
  "Modern", 
  "Contemporary", 
  "Cubism", 
  "Impressionism", 
  "Minimalism"
];

// Validation schema for product form
const productSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters" }),
  price: z.coerce.number().min(0.01, { message: "Price must be greater than 0" }),
  artist: z.string().min(2, { message: "Artist name is required" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().optional(),
  image_url: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  dimensions: z.string().optional(),
  tags: z.array(z.string()).optional()
});

type ProductFormValues = z.infer<typeof productSchema>;

// ProductList Component
const ProductsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const fetchProducts = async () => {
    console.log("Fetching products...");
    try {
      let query = supabase
        .from('products')
        .select('*');
      
      query = query.order(sortField, { ascending: sortDirection === "asc" });
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
      
      console.log("Products fetched:", data);
      return (data || []) as Product[];
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
      return [];
    }
  };

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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.artist?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase()) || '';
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDuplicateProduct = async (product: Product) => {
    try {
      // Create a new product object with required fields explicitly defined as non-optional
      const newProduct = {
        title: product.title ? product.title + " (Copy)" : "Untitled (Copy)", // Ensure title is non-optional with fallback
        price: typeof product.price === 'number' ? product.price : 0, // Ensure price is non-optional with fallback
        artist: product.artist || "Unknown", 
        category: product.category || "Uncategorized",
        description: product.description || "",
        image_url: product.image_url || "",
        dimensions: product.dimensions || "",
        tags: product.tags || []
      };
      
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();
      
      if (error) throw error;
      
      toast.success("Product duplicated successfully");
      refetch();
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
        refetch();
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
            <div className="w-full sm:w-[200px] flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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

// ProductForm Component
const ProductFormWrapper: React.FC = () => {
  const { id } = useParams();
  return <ProductForm productId={id} />;
};

const ProductForm: React.FC<{ productId?: string }> = ({ productId }) => {
  const navigate = useNavigate();
  const isEditing = !!productId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  
  // Define the form with validation
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      price: 0,
      artist: '',
      category: '',
      description: '',
      image_url: '',
      dimensions: '',
      tags: []
    }
  });
  
  const { isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      if (!productId) return null;
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        // Reset form with product data
        form.reset({
          title: data.title || '',
          price: data.price || 0,
          artist: data.artist || '',
          category: data.category || '',
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
  
  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        const { error } = await supabase
          .from('products')
          .update(data)
          .eq('id', productId);
          
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        // Ensure required fields are definitely non-optional when inserting
        const productData = {
          ...data,
          title: data.title || "Untitled",
          price: typeof data.price === 'number' ? data.price : 0
        };

        const { error } = await supabase
          .from('products')
          .insert([productData]);
          
        if (error) throw error;
        toast.success("Product added successfully");
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(`Failed to ${isEditing ? 'update' : 'add'} product`);
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
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                          <Input placeholder='e.g., 24" x 36"' {...field} />
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
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Image className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                              placeholder="https://example.com/image.jpg" 
                              className="pl-8"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Enter a URL for the product image.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Image preview */}
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
                  
                  <div className="border border-dashed rounded-md p-6 text-center">
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">File upload coming soon</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      In the meantime, please use an image URL.
                    </p>
                  </div>
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

// Main ProductsManager component
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
