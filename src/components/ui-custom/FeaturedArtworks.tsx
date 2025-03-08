
import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ArtworkCard from "./ArtworkCard";

// Demo artwork data
const artworks = [
  {
    id: "artwork-1",
    title: "Cosmic Convergence",
    artistName: "NeuroArtisan",
    artistId: "artist-1",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "artwork-2",
    title: "Digital Dreamscape",
    artistName: "SynthWave",
    artistId: "artist-2",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1681412327205-8d8781d7d121?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "artwork-3",
    title: "Neural Nocturne",
    artistName: "PixelMind",
    artistId: "artist-3",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "artwork-4",
    title: "Quantum Reverie",
    artistName: "AImagination",
    artistId: "artist-4",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1633186710895-309db2ddaf00?auto=format&fit=crop&w=800&q=80",
  },
];

const FeaturedArtworks: React.FC = () => {
  return (
    <section className="py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium mb-4">Featured Artworks</h2>
            <p className="text-muted-foreground max-w-xl">
              Discover exceptional AI-generated artwork from our curated collection of talented digital artists.
            </p>
          </div>
          <Link 
            to="/explore" 
            className="hidden md:inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-apple hover:gap-3"
          >
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        
        {/* Artwork Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {artworks.map((artwork) => (
            <ArtworkCard 
              key={artwork.id}
              id={artwork.id}
              title={artwork.title}
              artistName={artwork.artistName}
              artistId={artwork.artistId}
              price={artwork.price}
              image={artwork.image}
            />
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
          <Link 
            to="/explore" 
            className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-apple"
          >
            <span>View All Artworks</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArtworks;
