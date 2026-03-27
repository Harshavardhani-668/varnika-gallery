import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Star, ArrowRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useAnimations";
import FloatingClouds from "@/components/effects/FloatingClouds";

const Gallery = () => {
  const { data: products, isLoading } = useProducts();
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const headerReveal = useScrollReveal<HTMLDivElement>();
  const { containerRef, visibleItems } = useStaggeredReveal(products?.length || 0, 100);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 overflow-hidden pastel-clouds">
        <FloatingClouds count={5} />
        <div className="absolute inset-0 gradient-bg-pastel opacity-30" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-pastel-lavender/10 blur-3xl" />
          <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-pastel-mint/10 blur-3xl" />
        </div>
        
        <div className="varnika-container relative z-10 text-center">
          <span className="text-gold text-sm tracking-[0.3em] uppercase font-body animate-fade-in">
            Design Gallery
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl text-espresso mt-4 mb-6 animate-fade-in-up text-shadow-soft">
            Our Creations
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body text-base sm:text-lg animate-fade-in-up animate-delay-2">
            Discover our complete gallery of handmade gifts — each piece crafted with love,
            creativity, and heartfelt artistry.
          </p>
        </div>
      </section>

      <main className="pb-16">
        <div className="varnika-container">
          {/* Loading State */}
          {isLoading && (
            <div className="masonry-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="masonry-item">
                  <Skeleton className="w-full h-80 rounded-sm" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Gallery Grid */}
          {!isLoading && products && (
            <div ref={containerRef} className="masonry-grid">
              {products.map((art, index) => (
                <Link
                  key={art.id}
                  to={`/product/${art.id}`}
                  className="masonry-item block group"
                >
                  <article
                    className={cn(
                      "relative bg-card rounded-sm overflow-hidden floating-shadow transition-all duration-600",
                      visibleItems.has(index)
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-12"
                    )}
                    style={{ transitionDelay: `${index * 80}ms` }}
                  >
                    {/* Image */}
                    <div className="image-reveal aspect-auto">
                      <img
                        src={art.imageUrl}
                        alt={`${art.name} handmade gift product image`}
                        loading="lazy"
                        className="w-full h-full max-w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop";
                        }}
                      />
                      
                      {/* Overlay */}
                      <div className="story-overlay bg-gradient-to-t from-espresso/90 via-espresso/40 to-transparent">
                        <div className="text-cream">
                          <p className="font-body text-sm leading-relaxed opacity-90 line-clamp-3">
                            {art.shortDescription}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Eye className="w-4 h-4 text-gold" />
                            <span className="text-xs text-gold tracking-wider uppercase">
                              View Details
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {art.salePrice && (
                          <span className="px-3 py-1 bg-terracotta text-cream text-xs tracking-wider uppercase rounded-sm">
                            Sale
                          </span>
                        )}
                        {art.customizable && (
                          <span className="px-3 py-1 bg-gold/90 text-espresso text-xs tracking-wider uppercase rounded-sm">
                            Customizable
                          </span>
                        )}
                      </div>

                      {/* Like */}
                      <button
                        onClick={(e) => toggleLike(art.id, e)}
                        className={cn(
                          "absolute top-4 right-4 w-11 h-11 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 interactive-element",
                          likedItems.has(art.id)
                            ? "bg-terracotta text-cream"
                            : "bg-cream/90 text-espresso hover:bg-cream"
                        )}
                      >
                        <Heart
                          className={cn(
                            "w-5 h-5 transition-transform",
                            likedItems.has(art.id) ? "fill-current scale-110" : ""
                          )}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">
                            {art.category}
                          </p>
                          <p className="font-display text-xl text-espresso group-hover:text-gold transition-colors duration-300">
                            {art.name}
                          </p>
                        </div>
                        {art.rating > 0 && (
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="w-4 h-4 text-gold fill-gold" />
                            <span className="text-sm text-muted-foreground">{art.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-baseline gap-3">
                        {art.salePrice ? (
                          <>
                            <span className="font-display text-xl text-terracotta">
                              ₹{art.salePrice.toLocaleString("en-IN")}
                            </span>
                            <span className="text-muted-foreground line-through text-sm">
                              ₹{art.regularPrice.toLocaleString("en-IN")}
                            </span>
                          </>
                        ) : (
                          <span className="font-display text-xl text-espresso">
                            ₹{art.regularPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-16">
            <Button variant="artisan" size="xl" className="group interactive-element" asChild>
              <Link to="/collections">
                Browse All Collections
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Gallery;