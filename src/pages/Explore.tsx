
import React from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import ArtworkCard from "@/components/ui-custom/ArtworkCard";

// Demo artwork data (in a real app, this would come from an API)
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
  {
    id: "artwork-5",
    title: "Ethereal Synthesis",
    artistName: "BinaryBrush",
    artistId: "artist-5",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1655635949212-1d8f3f4d8571?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "artwork-6",
    title: "Algorithmic Aurora",
    artistName: "DataDreamer",
    artistId: "artist-6",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1583160247711-2191776b4b91?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "artwork-7",
    title: "Synthetic Symphony",
    artistName: "NeuroArtisan",
    artistId: "artist-1",
    price: 329.99,
    image: "https://images.unsplash.com/photo-1633177317976-3f9bc45e1d1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "artwork-8",
    title: "Digital Divide",
    artistName: "SynthWave",
    artistId: "artist-2",
    price: 289.99,
    image: "https://images.unsplash.com/photo-1633177031940-61beb547f15e?auto=format&fit=crop&w=800&q=80",
  },
];

const Explore: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 md:px-10 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-medium mb-4">Explore Artworks</h1>
          <p className="text-muted-foreground max-w-3xl">
            Discover unique AI-generated digital artwork from talented artists around the world.
            Each piece represents a fusion of human creativity and artificial intelligence.
          </p>
        </div>

        {/* Filters would go here in a more complete implementation */}
        <div className="mb-8 py-4 border-y">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {artworks.length} artworks
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Sort by:</span>
              <select className="bg-background border border-input rounded-md p-1 text-sm">
                <option>Newest</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
                <option>Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
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

        {/* Pagination would go here in a more complete implementation */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-2">
            <button className="p-2 rounded-md border border-border hover:bg-secondary">
              Previous
            </button>
            <button className="p-2 px-4 rounded-md bg-primary text-primary-foreground">
              1
            </button>
            <button className="p-2 px-4 rounded-md hover:bg-secondary">
              2
            </button>
            <button className="p-2 px-4 rounded-md hover:bg-secondary">
              3
            </button>
            <button className="p-2 rounded-md border border-border hover:bg-secondary">
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
