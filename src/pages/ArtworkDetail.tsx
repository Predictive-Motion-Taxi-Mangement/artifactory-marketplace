
import React, { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { 
  ArrowLeft, 
  Share2, 
  Heart, 
  ZoomIn, 
  ShoppingCart, 
  Tag, 
  X, 
  Info, 
  Check, 
  ChevronRight,
  Download,
  Maximize2,
  ArrowUpRight,
  Clock,
  PaintBucket
} from "lucide-react";

const demoArtwork = {
  id: "artwork-1",
  title: "Cosmic Convergence",
  description: "An AI-generated masterpiece that explores the boundaries between the physical universe and digital consciousness. This piece merges celestial elements with abstract neural patterns to create a visual representation of cosmic intelligence.",
  artistName: "NeuroArtisan",
  artistId: "artist-1",
  artistBio: "NeuroArtisan is a pioneering AI art creator who combines neural network algorithms with classical art techniques to create unique digital experiences. With a background in both computer science and fine arts, their work explores the intersection of technology and creativity.",
  price: 299.99,
  dimensions: "3000 x 3000 px",
  created: "2023-09-15",
  aiModel: "Stable Diffusion XL",
  technique: "Generative Adversarial Network",
  image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1600&q=80",
  otherImages: [
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1633186710895-309db2ddaf00?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?auto=format&fit=crop&w=800&q=80",
  ],
  tags: ["abstract", "space", "neural", "consciousness", "digital art"],
  relatedArtworks: [
    {
      id: "artwork-2",
      title: "Digital Dreamscape",
      artistName: "SynthWave",
      price: 199.99,
      image: "https://images.unsplash.com/photo-1681412327205-8d8781d7d121?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "artwork-3",
      title: "Neural Nocturne",
      artistName: "PixelMind",
      price: 349.99,
      image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "artwork-7",
      title: "Synthetic Symphony",
      artistName: "NeuroArtisan",
      price: 329.99,
      image: "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?auto=format&fit=crop&w=800&q=80",
    },
  ]
};

const ArtworkDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(demoArtwork.image);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [showNotification, setShowNotification] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  
  const artwork = demoArtwork;
  
  const handleAddToCart = () => {
    addToCart({
      id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      image: artwork.image,
      artistName: artwork.artistName,
    });
    
    toast({
      title: "Added to cart",
      description: `${artwork.title} has been added to your cart.`,
    });

    // Show the added to cart animation
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from wishlist" : "Added to wishlist",
      description: `${artwork.title} has been ${isFavorite ? "removed from" : "added to"} your wishlist.`,
    });
  };

  const handleRelatedArtworkClick = (relatedId: string) => {
    navigate(`/artwork/${relatedId}`);
  };

  const handleToggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  const handleFullscreen = () => {
    setFullscreen(!fullscreen);
    if (!fullscreen && imageRef.current) {
      if (imageRef.current.requestFullscreen) {
        imageRef.current.requestFullscreen();
      }
    }
  };

  const handleShare = () => {
    // In a real app, this would use the Web Share API if available
    toast({
      title: "Share link copied",
      description: "The link to this artwork has been copied to your clipboard.",
    });
  };

  const handleDownload = () => {
    toast({
      title: "Preparing download",
      description: "Your high-resolution artwork will begin downloading shortly.",
    });
  };

  return (
    <Layout>
      <div className="relative">
        {/* Notification animation */}
        {showNotification && (
          <div className="fixed top-24 right-10 z-50 bg-primary text-primary-foreground p-4 rounded-md shadow-md animate-slide-in-right">
            <div className="flex items-center gap-2">
              <Check className="text-primary-foreground" />
              <span>Added to cart successfully!</span>
            </div>
          </div>
        )}

        {/* Artwork viewer in fullscreen mode */}
        {fullscreen && (
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center" onClick={() => setFullscreen(false)}>
            <img 
              src={selectedImage} 
              alt={artwork.title} 
              className="max-h-screen max-w-screen object-contain" 
            />
            <button 
              className="absolute top-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              onClick={() => setFullscreen(false)}
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        )}

        <div className="container mx-auto px-6 md:px-10 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/explore" 
              className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-all group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to Explore</span>
            </Link>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="text-sm text-muted-foreground flex items-center">
              <span>Artwork</span>
              <ChevronRight size={14} className="mx-1" />
              <span>{artwork.title}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left side - Artwork images */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              <div 
                ref={imageRef}
                className="relative bg-black/5 rounded-2xl overflow-hidden group"
              >
                <div className="relative aspect-square">
                  <img 
                    src={selectedImage} 
                    alt={artwork.title} 
                    className={`w-full h-full transition-all duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'object-contain cursor-zoom-in'}`}
                    onClick={handleToggleZoom}
                  />
                </div>
                
                {/* Image controls */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    className="p-2.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                    aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                    onClick={handleToggleZoom}
                  >
                    <ZoomIn size={20} className="text-white" />
                  </button>
                  <button 
                    className="p-2.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                    aria-label="View fullscreen"
                    onClick={handleFullscreen}
                  >
                    <Maximize2 size={20} className="text-white" />
                  </button>
                </div>
                
                {/* Artwork details overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <h3 className="font-medium">{artwork.title}</h3>
                      <p className="text-sm text-white/80">by {artwork.artistName}</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                        onClick={handleShare}
                      >
                        <Share2 size={16} />
                      </button>
                      <button 
                        className="p-1.5 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                        onClick={handleToggleFavorite}
                      >
                        <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Thumbnails */}
              <ScrollArea className="w-full whitespace-nowrap pb-2">
                <div className="flex gap-3">
                  <button 
                    className={`rounded-lg overflow-hidden w-24 h-24 border-2 shrink-0 transition-all ${selectedImage === artwork.image ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                    onClick={() => setSelectedImage(artwork.image)}
                  >
                    <img 
                      src={artwork.image} 
                      alt="Main view" 
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {artwork.otherImages.map((img, index) => (
                    <button 
                      key={index}
                      className={`rounded-lg overflow-hidden w-24 h-24 border-2 shrink-0 transition-all ${selectedImage === img ? 'border-primary' : 'border-transparent hover:border-primary/50'}`}
                      onClick={() => setSelectedImage(img)}
                    >
                      <img 
                        src={img} 
                        alt={`View ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </ScrollArea>
              
              {/* Tabbed information panel */}
              <div className="mt-8 border rounded-xl overflow-hidden bg-background">
                <div className="flex border-b">
                  <button 
                    className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === "details" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                    {activeTab === "details" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                  <button 
                    className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === "about-artist" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    onClick={() => setActiveTab("about-artist")}
                  >
                    About the Artist
                    {activeTab === "about-artist" && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                </div>
                
                <div className="p-6">
                  {activeTab === "details" && (
                    <div>
                      <h3 className="font-medium mb-4">Artwork Details</h3>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                        <div>
                          <div className="text-sm text-muted-foreground">Dimensions</div>
                          <div className="flex items-center gap-2">
                            <PaintBucket size={14} />
                            {artwork.dimensions}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Created</div>
                          <div className="flex items-center gap-2">
                            <Clock size={14} />
                            {artwork.created}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">AI Model</div>
                          <div>{artwork.aiModel}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Technique</div>
                          <div>{artwork.technique}</div>
                        </div>
                      </div>
                      
                      <h4 className="font-medium mb-3">Description</h4>
                      <p className="text-sm text-foreground/80 mb-6">{artwork.description}</p>
                      
                      <div>
                        <div className="text-sm text-muted-foreground mb-3">Tags</div>
                        <div className="flex flex-wrap gap-2">
                          {artwork.tags.map((tag, index) => (
                            <Badge 
                              key={index}
                              variant="outline"
                              className="px-3 py-1 bg-primary/5 hover:bg-primary/10 transition-colors"
                            >
                              <Tag size={12} className="mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === "about-artist" && (
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/50 flex items-center justify-center text-2xl font-bold text-primary">
                          {artwork.artistName.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-medium mb-2">{artwork.artistName}</h3>
                        <p className="text-foreground/80 mb-4">{artwork.artistBio}</p>
                        <Link 
                          to={`/artists/${artwork.artistId}`}
                          className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
                        >
                          View all artwork by {artwork.artistName}
                          <ArrowUpRight size={14} />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right side - Purchase information */}
            <div className="lg:col-span-5 xl:col-span-4 space-y-8">
              <div className="sticky top-24">
                <div className="p-6 border rounded-xl bg-background/50 backdrop-blur mb-6">
                  <h1 className="text-2xl md:text-3xl font-medium mb-2">{artwork.title}</h1>
                  <Link 
                    to={`/artists/${artwork.artistId}`}
                    className="text-lg text-foreground/80 hover:text-foreground transition-colors"
                  >
                    by {artwork.artistName}
                  </Link>
                  
                  <div className="mt-6 mb-6">
                    <div className="bg-primary/5 rounded-lg p-4 mb-4">
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-medium">${artwork.price.toFixed(2)}</span>
                        <span className="text-sm text-muted-foreground mb-1">USD</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        className="w-full h-12 gap-2 text-base"
                        onClick={handleAddToCart}
                      >
                        <ShoppingCart size={18} />
                        Add to Cart
                      </Button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          variant="outline" 
                          className="h-12 gap-2"
                          onClick={handleToggleFavorite}
                        >
                          <Heart 
                            size={18} 
                            className={isFavorite ? "fill-primary text-primary" : ""}
                          />
                          {isFavorite ? "Saved" : "Save"}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="h-12 gap-2"
                          onClick={handleShare}
                        >
                          <Share2 size={18} />
                          Share
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  {/* License information */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-1.5">
                      <Info size={16} />
                      License Information
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Commercial and personal use</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>High resolution digital download</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Print and digital reproduction rights</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Lifetime access to downloaded files</span>
                      </li>
                    </ul>
                  </div>
                  
                  <Button 
                    variant="secondary" 
                    className="w-full mt-6 gap-2"
                    onClick={handleDownload}
                  >
                    <Download size={16} />
                    Download Preview
                  </Button>
                </div>
                
                {/* Authentication certificate */}
                <div className="border rounded-xl p-5 bg-primary/5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Authenticity Guaranteed</h3>
                      <p className="text-xs text-muted-foreground">Includes digital certificate of authenticity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Related artworks section */}
          <div className="mt-20">
            <h2 className="text-2xl font-medium mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artwork.relatedArtworks.map((related) => (
                <div 
                  key={related.id}
                  onClick={() => handleRelatedArtworkClick(related.id)}
                  className="group cursor-pointer rounded-xl overflow-hidden bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="overflow-hidden aspect-square">
                    <img 
                      src={related.image} 
                      alt={related.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">{related.title}</h3>
                    <div className="text-foreground/80 text-sm">{related.artistName}</div>
                    <div className="mt-1 font-medium">${related.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtworkDetail;
