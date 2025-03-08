
import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1655635949212-1d8f3f4d8571?auto=format&fit=crop&w=2000&q=80",
    title: "Dreamscape Odyssey",
    artist: "EtherealVisuals",
    description: "An AI-crafted journey through imagined realms of surreal beauty.",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1583160247711-2191776b4b91?auto=format&fit=crop&w=2000&q=80",
    title: "Quantum Thoughts",
    artist: "NeuralCanvas",
    description: "Visual expressions of consciousness, rendered by cutting-edge AI.",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1633177031940-61beb547f15e?auto=format&fit=crop&w=2000&q=80",
    title: "Digital Renaissance",
    artist: "SynthArtist",
    description: "Classic aesthetics reimagined through the lens of artificial intelligence.",
  },
];

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean[]>(slides.map(() => false));

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 500);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleImageLoad = (index: number) => {
    setIsLoaded((prev) => {
      const newLoaded = [...prev];
      newLoaded[index] = true;
      return newLoaded;
    });
  };

  const handleDotClick = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 500);
  };

  return (
    <section className="relative h-[calc(100vh-80px)] min-h-[600px] overflow-hidden">
      {/* Image Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-all duration-[1.5s] ease-apple-ease",
            index === currentSlide
              ? isTransitioning
                ? "opacity-0 scale-110"
                : "opacity-100 scale-100 z-10"
              : "opacity-0 scale-110 z-0"
          )}
        >
          <div
            className={cn(
              "absolute inset-0 bg-black/30 z-20",
              !isLoaded[index] && "animate-pulse bg-secondary"
            )}
          />
          <img
            src={slide.image}
            alt={slide.title}
            className={cn(
              "w-full h-full object-cover object-center transition-transform duration-[10s]",
              index === currentSlide && !isTransitioning && "scale-110"
            )}
            onLoad={() => handleImageLoad(index)}
          />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-30 h-full flex items-center">
        <div className="container mx-auto px-6 md:px-10">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-white/10 backdrop-blur text-white rounded-full mb-4 animate-fade-in">
              Featured Artwork
            </span>
            <h1
              className={cn(
                "text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6 transition-all duration-500",
                isTransitioning
                  ? "opacity-0 transform translate-y-8"
                  : "opacity-100 transform translate-y-0"
              )}
            >
              {slides[currentSlide].title}
            </h1>
            <p
              className={cn(
                "text-lg text-white/90 mb-8 max-w-lg transition-all duration-500 delay-100",
                isTransitioning
                  ? "opacity-0 transform translate-y-8"
                  : "opacity-100 transform translate-y-0"
              )}
            >
              {slides[currentSlide].description}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 bg-white text-foreground px-6 py-3 rounded-full font-medium transition-all duration-350 ease-apple-ease hover:bg-white/90 hover:gap-3"
              >
                <span>Explore Collection</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to={`/artists/${slides[currentSlide].artist}`}
                className="inline-flex items-center gap-2 bg-transparent border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-350 ease-apple-ease hover:bg-white/10"
              >
                <span>By {slides[currentSlide].artist}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center">
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "w-8 bg-white"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
