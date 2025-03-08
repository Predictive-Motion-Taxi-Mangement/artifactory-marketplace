
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ArtworkCardProps {
  id: string;
  title: string;
  artistName: string;
  artistId?: string;  // Making artistId optional
  price: number;
  image: string;
  category?: string;  // Adding category as an optional prop
  className?: string;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  id,
  title,
  artistName,
  artistId = "", // Default value to avoid undefined errors
  price,
  image,
  category,
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: `${title} has been ${isFavorite ? "removed from" : "added to"} your favorites.`,
    });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id,
      title,
      artistName,
      price,
      image,
    });
    toast({
      title: "Added to cart",
      description: `${title} has been added to your cart.`,
    });
  };

  const handleArtistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // This would navigate to artist page, using window.location
    // to avoid the nested links issue
    window.location.href = `/artists/${artistId}`;
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = `/artwork/${id}`;
  };

  return (
    <div
      className={cn(
        "group relative rounded-2xl overflow-hidden bg-secondary/50 transition-transform duration-500 ease-apple-ease will-change-transform",
        isHovered ? "scale-[1.02]" : "scale-100",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/artwork/${id}`} className="block">
        {/* Image Container */}
        <div
          className={cn(
            "aspect-[4/5] w-full relative overflow-hidden",
            !isLoaded && "image-loading"
          )}
        >
          <img
            src={image}
            alt={title}
            className={cn(
              "w-full h-full object-cover transition-all duration-500",
              isLoaded ? "opacity-100" : "opacity-0",
              isHovered ? "scale-[1.05]" : "scale-100"
            )}
            onLoad={() => setIsLoaded(true)}
          />

          {/* Quick actions overlay */}
          <div className={cn(
            "absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}>
            <button
              onClick={handleQuickView}
              className="bg-white/90 text-foreground rounded-full p-2 mx-2 hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Quick view"
            >
              <Eye size={18} />
            </button>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          className={cn(
            "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
            isFavorite
              ? "bg-primary/90 text-primary-foreground"
              : "bg-white/80 backdrop-blur text-foreground/80 opacity-0 group-hover:opacity-100"
          )}
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={16}
            className={cn(isFavorite && "fill-current")}
          />
        </button>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="font-medium truncate">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            by{" "}
            <button
              onClick={handleArtistClick}
              className="hover:text-foreground transition-apple"
            >
              {artistName}
            </button>
          </p>
          {category && (
            <p className="text-xs text-muted-foreground mt-1">
              {category}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <span className="font-medium">${price.toFixed(2)}</span>
            
            <button
              onClick={handleAddToCart}
              className="text-sm py-1 px-3 rounded-full bg-secondary text-foreground/80 hover:bg-primary hover:text-primary-foreground transition-apple"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ArtworkCard;
