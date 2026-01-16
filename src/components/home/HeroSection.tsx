import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFeaturedProducts } from "@/hooks/useProducts";

const HeroSection = () => {
  const { data: featuredProducts, isLoading } = useFeaturedProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!featuredProducts?.length) return;
    
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
        setIsAnimating(false);
      }, 500);
    }, 6000);

    return () => clearInterval(timer);
  }, [featuredProducts?.length]);

  const scrollToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center overflow-hidden bg-espresso">
        <div className="relative z-10 varnika-container w-full py-32 md:py-40">
          <div className="max-w-2xl space-y-6">
            <Skeleton className="h-6 w-32 bg-gold/20" />
            <Skeleton className="h-20 w-full bg-cream/10" />
            <Skeleton className="h-16 w-3/4 bg-cream/10" />
            <Skeleton className="h-6 w-2/3 bg-cream/10" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-12 w-32 bg-gold/20" />
              <Skeleton className="h-12 w-40 bg-gold/30" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredProducts?.length) {
    return null;
  }

  const currentArt = featuredProducts[currentSlide];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {featuredProducts.map((item, index) => (
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
              {currentArt.salePrice ? (
                <>
                  ₹{currentArt.salePrice.toLocaleString("en-IN")}
                  <span className="text-lg text-cream/50 line-through ml-3">
                    ₹{currentArt.regularPrice.toLocaleString("en-IN")}
                  </span>
                </>
              ) : (
                `₹${currentArt.regularPrice.toLocaleString("en-IN")}`
              )}
            </span>
            <Link to={`/product/${currentArt.id}`}>
              <Button variant="reserve" size="xl" className="group">
                Explore This Piece
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {/* Slide Indicators */}
          <div className="flex gap-3 mt-12">
            {featuredProducts.map((_, index) => (
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
