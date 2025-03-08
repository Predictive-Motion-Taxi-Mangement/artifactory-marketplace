
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Share2, Heart, ZoomIn, ShoppingCart } from "lucide-react";

// In a real application, we would fetch this data from an API
// This is just a demo artwork for display purposes
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
  const [selectedImage, setSelectedImage] = useState(demoArtwork.image);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // In a real app, we would fetch the artwork data based on the id parameter
  // For this demo, we'll just use the demo artwork regardless of the id
  const artwork = demoArtwork;
  
  const handleAddToCart = () => {
    addToCart({
      id: artwork.id,
      title: artwork.title,
      price: artwork.price,
      image: artwork.image,
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${artwork.title} has been added to your cart.`,
    });
  };
  
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from wishlist" : "Added to wishlist",
      description: `${artwork.title} has been ${isFavorite ? "removed from" : "added to"} your wishlist.`,
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-6 md:px-10 py-12">
        {/* Back navigation */}
        <Link 
          to="/explore" 
          className="inline-flex items-center gap-2 mb-8 text-foreground/80 hover:text-foreground transition-all"
        >
          <ArrowLeft size={16} />
          <span>Back to Explore</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Artwork Images */}
          <div>
            <div className="relative rounded-xl overflow-hidden bg-black/5 aspect-square mb-4">
              <img 
                src={selectedImage} 
                alt={artwork.title} 
                className="w-full h-full object-contain"
              />
              <button 
                className="absolute bottom-4 right-4 p-2 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                aria-label="Zoom image"
              >
                <ZoomIn size={20} className="text-white" />
              </button>
            </div>
            
            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              <button 
                className={`rounded-md overflow-hidden w-20 h-20 ${selectedImage === artwork.image ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedImage(artwork.image)}
              >
                <img 
                  src={artwork.image} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover"
                />
              </button>
              {artwork.otherImages.map((img, index) => (
                <button 
                  key={index}
                  className={`rounded-md overflow-hidden w-20 h-20 ${selectedImage === img ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Artwork Details */}
          <div>
            <h1 className="text-3xl md:text-4xl font-medium mb-2">{artwork.title}</h1>
            <Link 
              to={`/artists/${artwork.artistId}`}
              className="text-lg text-foreground/80 hover:text-foreground transition-colors"
            >
              by {artwork.artistName}
            </Link>
            
            <div className="mt-6 mb-8">
              <p className="text-foreground/80">{artwork.description}</p>
            </div>
            
            <div className="bg-secondary/50 p-6 rounded-xl mb-8">
              <div className="text-3xl font-medium mb-6">${artwork.price.toFixed(2)}</div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="flex-1 h-12 gap-2"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 h-12 gap-2"
                  onClick={handleToggleFavorite}
                >
                  <Heart 
                    size={18} 
                    className={isFavorite ? "fill-foreground" : ""}
                  />
                  {isFavorite ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            {/* Artwork Details */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Dimensions</div>
                <div>{artwork.dimensions}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Created</div>
                <div>{artwork.created}</div>
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
            
            <Separator className="my-8" />
            
            {/* Tags */}
            <div>
              <div className="text-sm text-muted-foreground mb-3">Tags</div>
              <div className="flex flex-wrap gap-2">
                {artwork.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full bg-secondary/50 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Share button */}
            <div className="mt-8">
              <Button variant="ghost" className="gap-2">
                <Share2 size={16} />
                Share Artwork
              </Button>
            </div>
          </div>
        </div>
        
        {/* Artist Information */}
        <div className="mt-16 mb-20">
          <h2 className="text-2xl font-medium mb-6">About the Artist</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary/50 flex-shrink-0">
              {/* This would be the artist's profile image in a real app */}
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/50"></div>
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">{artwork.artistName}</h3>
              <p className="text-foreground/80 mb-4">{artwork.artistBio}</p>
              <Link 
                to={`/artists/${artwork.artistId}`}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                View all artwork by {artwork.artistName}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Related Artworks */}
        <div>
          <h2 className="text-2xl font-medium mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {artwork.relatedArtworks.map((related) => (
              <Link 
                key={related.id}
                to={`/artwork/${related.id}`}
                className="group"
              >
                <div className="rounded-xl overflow-hidden aspect-square mb-3">
                  <img 
                    src={related.image} 
                    alt={related.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">{related.title}</h3>
                <div className="text-foreground/80 text-sm">{related.artistName}</div>
                <div className="mt-1 font-medium">${related.price.toFixed(2)}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ArtworkDetail;
