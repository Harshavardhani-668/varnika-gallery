import { useEffect, useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FeaturedArt {
  id: string;
  name: string;
  shortDescription: string;
  imageUrl: string;
  price: number;
}

// Sample featured items for demonstration
const featuredItems: FeaturedArt[] = [
  {
    id: "1",
    name: "Whispers of Dawn",
    shortDescription: "A handcrafted canvas capturing the first light breaking through misty mountains",
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&h=800&fit=crop",
    price: 12500,
  },
  {
    id: "2",
    name: "Sacred Geometry",
    shortDescription: "Intricate mandala artwork using traditional gold leaf techniques",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=800&fit=crop",
    price: 8900,
  },
  {
    id: "3",
    name: "Monsoon Melodies",
    shortDescription: "Watercolor dreams of rain-kissed lotus petals in a village pond",
    imageUrl: "https://images.unsplash.com/photo-1549887534-1541e9326642?w=1200&h=800&fit=crop",
    price: 15000,
  },
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredItems.length);
        setIsAnimating(false);
      }, 500);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const currentArt = featuredItems[currentSlide];

  const scrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {featuredItems.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000 ease-smooth",
              index === currentSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 via-transparent to-transparent" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 varnika-container w-full py-32 md:py-40">
        <div className="max-w-2xl">
          {/* Tagline */}
          <div
            className={cn(
              "transition-all duration-500 ease-smooth",
              isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
            )}
          >
            <span className="inline-block px-4 py-1.5 bg-gold/20 backdrop-blur-sm text-gold-light text-sm tracking-[0.2em] uppercase mb-6 rounded">
              Featured Piece
            </span>
          </div>

          {/* Title */}
          <h1
            className={cn(
              "font-display text-5xl md:text-7xl lg:text-8xl text-cream leading-[0.9] mb-6 transition-all duration-500 ease-smooth",
              isAnimating ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "100ms" }}
          >
            {currentArt.name}
          </h1>

          {/* Description */}
          <p
            className={cn(
              "font-body text-cream/80 text-lg md:text-xl leading-relaxed mb-8 max-w-lg transition-all duration-500 ease-smooth",
              isAnimating ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            {currentArt.shortDescription}
          </p>

          {/* Price & CTA */}
          <div
            className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 transition-all duration-500 ease-smooth",
              isAnimating ? "opacity-0 translate-y-8" : "opacity-100 translate-y-0"
            )}
            style={{ transitionDelay: "300ms" }}
          >
            <span className="font-display text-3xl text-gold">
              ₹{currentArt.price.toLocaleString("en-IN")}
            </span>
            <Button variant="reserve" size="xl" className="group">
              Explore This Piece
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          {/* Slide Indicators */}
          <div className="flex gap-3 mt-12">
            {featuredItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  index === currentSlide
                    ? "w-12 bg-gold"
                    : "w-6 bg-cream/30 hover:bg-cream/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToGallery}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cream/60 hover:text-cream transition-colors animate-float"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.2em] uppercase font-body">Discover</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </button>
    </section>
  );
};

export default HeroSection;
