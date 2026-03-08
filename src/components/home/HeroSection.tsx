import { useEffect, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFeaturedProducts } from "@/hooks/useProducts";

const HeroScene3D = lazy(() => import("@/components/hero/HeroScene3D"));

const HeroSection = () => {
  const { data: featuredProducts, isLoading } = useFeaturedProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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

  const hasFeatured = featuredProducts && featuredProducts.length > 0;
  const currentArt = hasFeatured ? featuredProducts[currentSlide] : null;

  if (isLoading) {
    return (
      <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
        <div className="relative z-10 varnika-container w-full py-32 md:py-40">
          <div className="max-w-2xl space-y-6">
            <Skeleton className="h-6 w-32 bg-muted" />
            <Skeleton className="h-20 w-full bg-muted" />
            <Skeleton className="h-16 w-3/4 bg-muted" />
            <Skeleton className="h-6 w-2/3 bg-muted" />
            <div className="flex gap-4 pt-4">
              <Skeleton className="h-14 w-40 bg-muted" />
              <Skeleton className="h-14 w-44 bg-muted" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* 3D Floating Gift Boxes */}
      <Suspense fallback={null}>
        <HeroScene3D />
      </Suspense>

      {/* Warm cream gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-cream-dark to-background" />
      
      {/* Subtle decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] rounded-full bg-pastel-pink/8 blur-3xl" />
      </div>

      {/* Background Image if featured products exist */}
      {hasFeatured && (
        <div className="absolute inset-0">
          {featuredProducts.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-boutique",
                index === currentSlide ? "opacity-100" : "opacity-0"
              )}
            >
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-background/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 varnika-container w-full py-32 md:py-40">
        <div className="max-w-2xl">
          {/* Main heading - always show */}
          <h1
            className={cn(
              "font-display text-5xl md:text-7xl lg:text-8xl text-foreground leading-[0.9] mb-2 transition-all duration-800 ease-boutique",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Varnika
          </h1>

          <p
            className={cn(
              "font-display text-2xl md:text-3xl lg:text-4xl text-gold italic leading-tight mb-6 transition-all duration-800 ease-boutique",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "150ms" }}
          >
            Where Every Gift Becomes a Memory
          </p>

          {/* Subheading */}
          <p
            className={cn(
              "font-body text-muted-foreground text-base md:text-lg leading-relaxed mb-4 max-w-lg transition-all duration-800 ease-boutique",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "300ms" }}
          >
            Handcrafted with intention and wrapped in emotion — our creations are designed to celebrate feelings, not just occasions.
          </p>

          {/* Supporting line */}
          <p
            className={cn(
              "font-body text-muted-foreground/80 text-sm md:text-base leading-relaxed mb-10 max-w-md transition-all duration-800 ease-boutique",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "450ms" }}
          >
            From birthdays to once-in-a-lifetime moments, Varnika transforms love into something you can hold.
          </p>

          {/* Dynamic product info if available */}
          {currentArt && (
            <div
              className={cn(
                "mb-8 transition-all duration-500 ease-boutique",
                isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
              )}
            >
              <span className="inline-block px-4 py-1.5 bg-gold/10 text-gold text-sm tracking-widest uppercase mb-3 rounded-full font-body">
                Featured — {currentArt.name}
              </span>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-2xl text-gold">
                  {currentArt.salePrice ? (
                    <>
                      ₹{currentArt.salePrice.toLocaleString("en-IN")}
                      <span className="text-base text-muted-foreground line-through ml-3">
                        ₹{currentArt.regularPrice.toLocaleString("en-IN")}
                      </span>
                    </>
                  ) : (
                    `₹${currentArt.regularPrice.toLocaleString("en-IN")}`
                  )}
                </span>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div
            className={cn(
              "flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all duration-800 ease-boutique",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "600ms" }}
          >
            <Link to="/collections">
              <Button variant="artisan" size="xl" className="group button-glow">
                Explore Collections
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/collections">
              <Button variant="gallery" size="xl" className="group">
                Customize Your Gift
              </Button>
            </Link>
          </div>

          {/* Slide Indicators */}
          {hasFeatured && (
            <div className="flex gap-3 mt-12">
              {featuredProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    index === currentSlide
                      ? "w-12 bg-gold"
                      : "w-6 bg-foreground/20 hover:bg-foreground/40"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToGallery}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-foreground transition-colors animate-gentle-bob"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs tracking-widest uppercase font-body">Discover</span>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>
    </section>
  );
};

export default HeroSection;
