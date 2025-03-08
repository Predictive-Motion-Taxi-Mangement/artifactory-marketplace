
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Demo artist data
const artists = [
  {
    id: "artist-1",
    name: "NeuroArtisan",
    avatar: "https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?auto=format&fit=crop&w=200&h=200&q=80",
    artCount: 24,
    bio: "Creating ethereal abstract art through neural networks and digital manipulation.",
  },
  {
    id: "artist-2",
    name: "SynthWave",
    avatar: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?auto=format&fit=crop&w=200&h=200&q=80",
    artCount: 18,
    bio: "Pioneering the fusion of retro aesthetics with futuristic AI-generated visuals.",
  },
  {
    id: "artist-3",
    name: "PixelMind",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80",
    artCount: 32,
    bio: "Merging classical art techniques with cutting-edge AI to create unique digital worlds.",
  },
];

const FeaturedArtists: React.FC = () => {
  return (
    <section className="py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium mb-4">Featured Artists</h2>
            <p className="text-muted-foreground max-w-xl">
              Meet the creative minds behind our most compelling AI-generated artwork.
            </p>
          </div>
          <Link 
            to="/artists" 
            className="hidden md:inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-apple hover:gap-3"
          >
            <span>View All Artists</span>
            <ArrowRight size={16} />
          </Link>
        </div>
        
        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link 
            to="/artists" 
            className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-apple"
          >
            <span>View All Artists</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

interface ArtistCardProps {
  artist: {
    id: string;
    name: string;
    avatar: string;
    artCount: number;
    bio: string;
  };
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Link 
      to={`/artists/${artist.id}`}
      className={cn(
        "block p-6 rounded-2xl border border-border transition-all duration-350 ease-apple-ease",
        isHovered ? "shadow-medium bg-secondary/30 -translate-y-1" : "bg-transparent"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-4">
        <div className={cn("w-16 h-16 rounded-full overflow-hidden", !isLoaded && "image-loading")}>
          <img 
            src={artist.avatar} 
            alt={artist.name}
            className={cn(
              "w-full h-full object-cover",
              isLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setIsLoaded(true)}
          />
        </div>
        <div>
          <h3 className="font-medium text-lg">{artist.name}</h3>
          <p className="text-sm text-muted-foreground">{artist.artCount} artworks</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-foreground/80">{artist.bio}</p>
      <div className="mt-4 pt-4 border-t border-border">
        <span className="inline-flex items-center text-sm font-medium text-foreground/80 transition-colors hover:text-foreground">
          View Profile
          <ArrowRight size={14} className="ml-1 transition-transform ease-apple-ease group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
};

export default FeaturedArtists;
