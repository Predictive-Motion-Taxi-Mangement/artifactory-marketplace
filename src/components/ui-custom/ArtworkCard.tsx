
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

interface ArtworkCardProps {
  id: string;
  title: string;
  artistName: string;
  artistId: string;
  price: number;
  image: string;
  className?: string;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
  id,
  title,
  artistName,
  artistId,
  price,
  image,
  className,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
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
            <Link
              to={`/artists/${artistId}`}
              className="hover:text-foreground transition-apple"
              onClick={(e) => e.stopPropagation()}
            >
              {artistName}
            </Link>
          </p>
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
