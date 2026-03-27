import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFeaturedProducts } from "@/hooks/useProducts";
import FloatingClouds from "@/components/effects/FloatingClouds";

const HeroScene3D = lazy(() => import("@/components/hero/HeroScene3D"));

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { data: featuredProducts, isLoading } = useFeaturedProducts();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showScene3D, setShowScene3D] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Show 3D scene on all devices, but defer more aggressively for faster first load.

    if ("requestIdleCallback" in window) {
      const id = (window as Window & {
        requestIdleCallback: (callback: () => void, options?: { timeout: number }) => number;
      }).requestIdleCallback(() => setShowScene3D(true), { timeout: 5000 });

      return () => {
        const cancelIdle = (window as Window & {
          cancelIdleCallback?: (idleId: number) => void;
        }).cancelIdleCallback;
        if (cancelIdle) {
          cancelIdle(id);
        }
      };
    }

    const timeoutId = window.setTimeout(() => setShowScene3D(true), 2800);
    return () => window.clearTimeout(timeoutId);
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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let frameId = 0;

    const updatePosition = (clientX: number, clientY: number) => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }

      frameId = requestAnimationFrame(() => {
        const rect = section.getBoundingClientRect();
        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;
        section.style.setProperty("--hero-x", `${Math.max(0, Math.min(1, x))}`);
        section.style.setProperty("--hero-y", `${Math.max(0, Math.min(1, y))}`);
      });
    };

    const handleMove = (event: MouseEvent) => {
      updatePosition(event.clientX, event.clientY);
    };

    const handleTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      updatePosition(touch.clientX, touch.clientY);
    };

    const handleLeave = () => {
      section.style.setProperty("--hero-x", "0.5");
      section.style.setProperty("--hero-y", "0.45");
    };

    // Desktop mouse events
    section.addEventListener("mousemove", handleMove, { passive: true });
    section.addEventListener("mouseleave", handleLeave, { passive: true });

    // Mobile touch events for parallax effect
    section.addEventListener("touchmove", handleTouch, { passive: true });
    section.addEventListener("touchend", handleLeave, { passive: true });

    return () => {
      section.removeEventListener("mousemove", handleMove);
      section.removeEventListener("mouseleave", handleLeave);
      section.removeEventListener("touchmove", handleTouch);
      section.removeEventListener("touchend", handleLeave);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  const scrollToContent = () => {
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
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        "--hero-x": "0.5",
        "--hero-y": "0.45",
      } as React.CSSProperties}
    >
      {/* 3D scene is deferred to idle time on larger screens */}
      {showScene3D && (
        <Suspense fallback={null}>
          <HeroScene3D />
        </Suspense>
      )}

      <FloatingClouds count={4} />

      {/* Warm gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-cream-dark to-background" />

      {/* Cursor-reactive premium pastel glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(36rem 36rem at calc(var(--hero-x) * 100%) calc(var(--hero-y) * 100%), rgba(245,198,208,0.24), rgba(212,184,224,0.12) 45%, transparent 70%)",
          transition: "background 180ms ease-out",
        }}
      />

      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-[400px] h-[400px] rounded-full bg-pastel-pink/8 blur-3xl" />
        <div
          className="absolute top-[18%] left-[14%] w-56 h-56 rounded-full blur-3xl"
          style={{
            background: "rgba(212, 184, 224, 0.18)",
            transform: "translate3d(calc((var(--hero-x) - 0.5) * -30px), calc((var(--hero-y) - 0.5) * -22px), 0)",
            transition: "transform 180ms ease-out",
          }}
        />
        <div
          className="absolute bottom-[12%] right-[12%] w-64 h-64 rounded-full blur-3xl"
          style={{
            background: "rgba(181, 216, 204, 0.16)",
            transform: "translate3d(calc((var(--hero-x) - 0.5) * 26px), calc((var(--hero-y) - 0.5) * 18px), 0)",
            transition: "transform 200ms ease-out",
          }}
        />
      </div>

      {/* Background images for featured products */}
      {hasFeatured && (
        <div className="absolute inset-0">
          {currentArt && (
            <div
              key={currentArt.id}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-boutique",
                isAnimating ? "opacity-85" : "opacity-100"
              )}
            >
              <img
                src={currentArt.imageUrl}
                alt={`${currentArt.name} handmade gift product image`}
                className="w-full h-full max-w-full object-cover"
                loading="lazy"
                fetchPriority="low"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 varnika-container w-full py-24 sm:py-32 md:py-40">
        <div className="max-w-2xl">
          {/* Badge */}
          <div
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 transition-all duration-800 ease-boutique border border-white/35 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-sm",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{
              background: "linear-gradient(120deg, rgba(245,198,208,0.36), rgba(232,213,183,0.34), rgba(212,184,224,0.30))",
            }}
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-xs sm:text-sm text-gold font-body tracking-wide">Handcrafted with Love</span>
          </div>

          {/* Headline */}
          <h1
            className={cn(
              "font-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-foreground leading-[0.9] mb-4 transition-all duration-800 ease-boutique",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Turn Your Memories Into{" "}
            <span className="text-gradient-gold">Handmade Gifts</span>
          </h1>

          {/* Subheading */}
          <p
            className={cn(
              "font-body text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed mb-4 max-w-lg transition-all duration-800 ease-boutique",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            Custom photo frames, resin art, embroidery & more — designed to celebrate feelings, not just occasions.
          </p>

          {/* Supporting text */}
          <p
            className={cn(
              "font-body text-muted-foreground/70 text-sm md:text-base leading-relaxed mb-10 max-w-md transition-all duration-800 ease-boutique",
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "350ms" }}
          >
            From birthdays to once-in-a-lifetime moments, Varnika transforms love into something you can hold.
          </p>

          {/* Featured product info */}
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
            style={{ transitionDelay: "500ms" }}
          >
            <Button
                asChild
                variant="artisan"
                size="xl"
                className="group w-full sm:w-auto button-glow border border-white/30 shadow-[0_14px_34px_rgba(164,131,196,0.30)]"
                style={{
                  background: "linear-gradient(135deg, hsl(347 73% 85%), hsl(272 41% 73%))",
                }}
              >
                <Link to="/collections" className="w-full sm:w-auto">
                  Shop Now
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            <Button
                asChild
                variant="reserve"
                size="xl"
                className="group w-full sm:w-auto border border-white/45 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
                style={{
                  background: "linear-gradient(135deg, rgba(245,240,235,0.95), rgba(232,213,183,0.75))",
                }}
              >
                <Link to="/collections" className="w-full sm:w-auto">
                  <Sparkles className="w-5 h-5" />
                  Create Custom Gift
                </Link>
              </Button>
          </div>

          {/* Slide indicators */}
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

      {/* Scroll indicator */}
      <button
        onClick={scrollToContent}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 px-3 py-2 rounded-full text-muted-foreground hover:text-foreground transition-colors animate-gentle-bob"
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
