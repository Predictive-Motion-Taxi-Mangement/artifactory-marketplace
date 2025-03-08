
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import ArtworkCard from '@/components/ui-custom/ArtworkCard';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  parent_id?: string;
  subcategories?: Category[];
}

interface Product {
  id: string;
  title: string;
  price: number;
  artist: string;
  image_url?: string;
  category_id?: string;
  category_name?: string;
}

const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<string>(
    searchParams.get('sort') || "newest"
  );

  // Use this map to convert between slugs and IDs
  const [categoryMap, setCategoryMap] = useState<Record<string, Category>>({});
  const [slugToIdMap, setSlugToIdMap] = useState<Record<string, string>>({});
  
  // Get category and subcategory slugs from URL
  const categorySlug = searchParams.get('category');
  const subcategorySlug = searchParams.get('subcategory');

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['explore-categories'],
    queryFn: async () => {
      try {
        const { data: allCategories, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;

        // Create maps for looking up categories
        const categoriesById: Record<string, Category> = {};
        const categoriesBySlug: Record<string, string> = {};
        
        allCategories?.forEach((category: Category) => {
          categoriesById[category.id] = { ...category, subcategories: [] };
          categoriesBySlug[category.slug] = category.id;
        });
        
        setCategoryMap(categoriesById);
        setSlugToIdMap(categoriesBySlug);

        const mainCategories: Category[] = [];

        allCategories?.forEach((category: Category) => {
          if (category.parent_id && categoriesById[category.parent_id]) {
            if (!categoriesById[category.parent_id].subcategories) {
              categoriesById[category.parent_id].subcategories = [];
            }
            categoriesById[category.parent_id].subcategories?.push(
              categoriesById[category.id]
            );
          } else {
            mainCategories.push(categoriesById[category.id]);
          }
        });

        return mainCategories;
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    },
  });

  // Update selected category IDs when URL params change or categories load
  useEffect(() => {
    if (Object.keys(slugToIdMap).length > 0) {
      if (categorySlug && slugToIdMap[categorySlug]) {
        setSelectedCategoryId(slugToIdMap[categorySlug]);
      } else {
        setSelectedCategoryId(null);
      }
      
      if (subcategorySlug && slugToIdMap[subcategorySlug]) {
        setSelectedSubcategoryId(slugToIdMap[subcategorySlug]);
      } else {
        setSelectedSubcategoryId(null);
      }
    }
  }, [categorySlug, subcategorySlug, slugToIdMap]);

  // Update URL based on selected filters
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchTerm) params.set('search', searchTerm);
    
    // Use the slugs in the URL instead of IDs
    if (selectedCategoryId && categoryMap[selectedCategoryId]) {
      params.set('category', categoryMap[selectedCategoryId].slug);
    }
    
    if (selectedSubcategoryId && categoryMap[selectedSubcategoryId]) {
      params.set('subcategory', categoryMap[selectedSubcategoryId].slug);
    }
    
    if (sortOrder && sortOrder !== "newest") params.set('sort', sortOrder);
    
    setSearchParams(params, { replace: true });
  }, [searchTerm, selectedCategoryId, selectedSubcategoryId, sortOrder, categoryMap, setSearchParams]);

  const selectedMainCategory = categories.find(
    (cat) => cat.id === selectedCategoryId
  );

  const {
    data: products = [],
    isLoading: isLoadingProducts,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ['explore-products', searchTerm, selectedCategoryId, selectedSubcategoryId, sortOrder, priceRange],
    queryFn: async () => {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            categories(id, name, parent_id)
          `);
        
        if (selectedSubcategoryId) {
          query = query.eq('category_id', selectedSubcategoryId);
        } else if (selectedCategoryId) {
          const { data: subcats } = await supabase
            .from('categories')
            .select('id')
            .eq('parent_id', selectedCategoryId);
          
          const subcategoryIds = subcats?.map(sub => sub.id) || [];
          
          if (subcategoryIds.length > 0) {
            query = query.or(`category_id.eq.${selectedCategoryId},category_id.in.(${subcategoryIds.join(',')})`);
          } else {
            query = query.eq('category_id', selectedCategoryId);
          }
        }
        
        query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
        
        if (searchTerm) {
          query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,artist.ilike.%${searchTerm}%`);
        }
        
        switch (sortOrder) {
          case 'price-low':
            query = query.order('price', { ascending: true });
            break;
          case 'price-high':
            query = query.order('price', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          case 'newest':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        const { data, error } = await query;
        
        if (error) throw error;
        
        return data?.map(product => ({
          ...product,
          category_name: product.categories?.name
        })) || [];
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    },
  });

  const getSelectedCategoryInfo = () => {
    if (selectedSubcategoryId) {
      for (const mainCat of categories) {
        const subCat = mainCat.subcategories?.find(
          sub => sub.id === selectedSubcategoryId
        );
        if (subCat) {
          return {
            title: subCat.seo_title || subCat.name,
            description: subCat.seo_description || subCat.description || `Explore our collection of ${subCat.name} art`,
            breadcrumb: `${mainCat.name} > ${subCat.name}`
          };
        }
      }
    } else if (selectedCategoryId) {
      const mainCat = categories.find(cat => cat.id === selectedCategoryId);
      if (mainCat) {
        return {
          title: mainCat.seo_title || mainCat.name,
          description: mainCat.seo_description || mainCat.description || `Explore our collection of ${mainCat.name} art`,
          breadcrumb: mainCat.name
        };
      }
    }
    
    return {
      title: 'Explore All Artwork',
      description: 'Browse our entire collection of AI-generated art and find your perfect piece.',
      breadcrumb: 'All Categories'
    };
  };

  const categoryInfo = getSelectedCategoryInfo();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetchProducts();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategoryId(null);
    setSelectedSubcategoryId(null);
    setSortOrder('newest');
    setPriceRange([0, 1000]);
    setSearchParams({});
  };

  const hasActiveFilters = !!(
    searchTerm || 
    selectedCategoryId || 
    selectedSubcategoryId || 
    sortOrder !== 'newest' || 
    priceRange[0] > 0 || 
    priceRange[1] < 1000
  );

  return (
    <Layout>
      <Helmet>
        <title>{categoryInfo.title} | Artifi Gallery</title>
        <meta name="description" content={categoryInfo.description} />
      </Helmet>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <nav className="flex mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            </li>
            <li className="flex items-center space-x-2">
              <span className="text-muted-foreground">/</span>
              <Link to="/explore" className="text-muted-foreground hover:text-foreground">Explore</Link>
            </li>
            {(selectedCategoryId || selectedSubcategoryId) && (
              <li className="flex items-center space-x-2">
                <span className="text-muted-foreground">/</span>
                <span>{categoryInfo.breadcrumb}</span>
              </li>
            )}
          </ol>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block space-y-6">
            <div>
              <h2 className="text-xl font-medium mb-4">Categories</h2>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="all-categories" className="border-b">
                  <Link to="/explore" className={`block py-2 ${!selectedCategoryId ? 'font-medium text-primary' : 'text-foreground'}`}>
                    All Categories
                  </Link>
                </AccordionItem>
                
                {isLoadingCategories ? (
                  <div className="py-4 text-center text-muted-foreground">Loading categories...</div>
                ) : (
                  categories.map((category) => (
                    <AccordionItem key={category.id} value={category.id} className="border-b">
                      <AccordionTrigger
                        className={`${selectedCategoryId === category.id && !selectedSubcategoryId ? 'font-medium text-primary' : ''}`}
                        onClick={(e) => {
                          if (category.subcategories?.length === 0) {
                            e.preventDefault();
                            setSelectedCategoryId(category.id);
                            setSelectedSubcategoryId(null);
                          }
                        }}
                      >
                        {category.name}
                      </AccordionTrigger>
                      
                      {category.subcategories && category.subcategories.length > 0 && (
                        <AccordionContent>
                          <div className="ml-4 space-y-2">
                            <div
                              className={`block py-1 cursor-pointer ${selectedCategoryId === category.id && !selectedSubcategoryId ? 'font-medium text-primary' : ''}`}
                              onClick={() => {
                                setSelectedCategoryId(category.id);
                                setSelectedSubcategoryId(null);
                              }}
                            >
                              All {category.name}
                            </div>
                            
                            {category.subcategories.map((subcat) => (
                              <div
                                key={subcat.id}
                                className={`block py-1 cursor-pointer ${selectedSubcategoryId === subcat.id ? 'font-medium text-primary' : ''}`}
                                onClick={() => {
                                  setSelectedCategoryId(category.id);
                                  setSelectedSubcategoryId(subcat.id);
                                }}
                              >
                                {subcat.name}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      )}
                    </AccordionItem>
                  ))
                )}
              </Accordion>
            </div>
            
            <Separator />
            
            <div>
              <h2 className="text-xl font-medium mb-4">Filters</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Price Range</h3>
                  <Slider
                    min={0}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" /> Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Filter className="h-4 w-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle>Categories & Filters</SheetTitle>
                  <SheetDescription>
                    Browse by category or apply filters
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <h2 className="text-lg font-medium mb-4">Categories</h2>
                    <Accordion type="multiple" className="w-full">
                      <AccordionItem value="all-categories" className="border-b">
                        <div 
                          className={`block py-2 ${!selectedCategoryId ? 'font-medium text-primary' : 'text-foreground'}`}
                          onClick={() => {
                            setSelectedCategoryId(null);
                            setSelectedSubcategoryId(null);
                          }}
                        >
                          All Categories
                        </div>
                      </AccordionItem>
                      
                      {categories.map((category) => (
                        <AccordionItem key={category.id} value={category.id} className="border-b">
                          <AccordionTrigger
                            className={`${selectedCategoryId === category.id && !selectedSubcategoryId ? 'font-medium text-primary' : ''}`}
                            onClick={(e) => {
                              if (category.subcategories?.length === 0) {
                                e.preventDefault();
                                setSelectedCategoryId(category.id);
                                setSelectedSubcategoryId(null);
                              }
                            }}
                          >
                            {category.name}
                          </AccordionTrigger>
                          
                          {category.subcategories && category.subcategories.length > 0 && (
                            <AccordionContent>
                              <div className="ml-4 space-y-2">
                                <div
                                  className={`block py-1 cursor-pointer ${selectedCategoryId === category.id && !selectedSubcategoryId ? 'font-medium text-primary' : ''}`}
                                  onClick={() => {
                                    setSelectedCategoryId(category.id);
                                    setSelectedSubcategoryId(null);
                                  }}
                                >
                                  All {category.name}
                                </div>
                                
                                {category.subcategories.map((subcat) => (
                                  <div
                                    key={subcat.id}
                                    className={`block py-1 cursor-pointer ${selectedSubcategoryId === subcat.id ? 'font-medium text-primary' : ''}`}
                                    onClick={() => {
                                      setSelectedCategoryId(category.id);
                                      setSelectedSubcategoryId(subcat.id);
                                    }}
                                  >
                                    {subcat.name}
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          )}
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h2 className="text-lg font-medium mb-4">Filters</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Price Range</h3>
                        <Slider
                          min={0}
                          max={1000}
                          step={10}
                          value={priceRange}
                          onValueChange={setPriceRange}
                          className="mb-2"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>${priceRange[0]}</span>
                          <span>${priceRange[1]}</span>
                        </div>
                      </div>
                      
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" /> Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="lg:col-span-3">
            <div className="flex flex-col space-y-4 mb-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h1 className="text-2xl md:text-3xl font-medium">
                  {categoryInfo.title}
                </h1>
                
                <div className="flex gap-2">
                  <Select value={sortOrder || "newest"} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[150px]">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search artworks..."
                  className="pl-9 pr-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7"
                >
                  Search
                </Button>
              </form>
            </div>
            
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {searchTerm && (
                  <div className="flex items-center bg-secondary/50 text-secondary-foreground rounded-full px-3 py-1 text-sm">
                    Search: {searchTerm}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => setSearchTerm('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {selectedSubcategoryId && selectedMainCategory && (
                  <div className="flex items-center bg-secondary/50 text-secondary-foreground rounded-full px-3 py-1 text-sm">
                    {selectedMainCategory.name} &gt; {selectedMainCategory.subcategories?.find(s => s.id === selectedSubcategoryId)?.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => setSelectedSubcategoryId(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {selectedCategoryId && !selectedSubcategoryId && (
                  <div className="flex items-center bg-secondary/50 text-secondary-foreground rounded-full px-3 py-1 text-sm">
                    {categories.find(c => c.id === selectedCategoryId)?.name}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => setSelectedCategoryId(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                  <div className="flex items-center bg-secondary/50 text-secondary-foreground rounded-full px-3 py-1 text-sm">
                    ${priceRange[0]} - ${priceRange[1]}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0"
                      onClick={() => setPriceRange([0, 1000])}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="rounded-full px-3 h-7"
                >
                  Clear All
                </Button>
              </div>
            )}
            
            {isLoadingProducts ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[400px] bg-muted rounded-lg"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12 border rounded-lg">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-muted">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">No artwork found</h3>
                <p className="mt-1 text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ArtworkCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    artistName={product.artist || "Unknown Artist"}
                    price={product.price}
                    image={product.image_url || '/placeholder.svg'}
                    category={product.category_name}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
