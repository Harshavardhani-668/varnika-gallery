import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useAnimations";
import OptimizedImage from "@/components/ui/optimized-image";

const GalleryGrid = () => {
  const { data: products, isLoading } = useProducts();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  
  const headerReveal = useScrollReveal<HTMLDivElement>();
  const displayProducts = products?.slice(0, 6) || [];
  const { containerRef, visibleItems } = useStaggeredReveal(displayProducts.length, 150);

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

  if (isLoading) {
    return (
      <section id="gallery" className="py-24 bg-background">
        <div className="varnika-container">
          <div className="text-center mb-16">
            <Skeleton className="h-4 w-32 mx-auto bg-muted" />
            <Skeleton className="h-12 w-64 mx-auto mt-4 bg-muted" />
            <Skeleton className="h-6 w-96 mx-auto mt-4 bg-muted" />
          </div>
          <div className="masonry-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="masonry-item">
                <Skeleton className="w-full h-80 rounded-card" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-pastel-pink/5 blur-3xl" />
      </div>

      <div className="varnika-container relative">
        {/* Section Header */}
        <div
          ref={headerReveal.ref}
          className={cn(
            "text-center mb-16 transition-all duration-700 ease-boutique",
            headerReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-gold text-sm tracking-widest uppercase font-body">
            Moments We've Crafted
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-6">
            Curated Collections
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            Thoughtfully designed for every heartfelt occasion.
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid" ref={containerRef}>
          {displayProducts.map((art, index) => (
            <Link
              key={art.id}
              to={`/product/${art.id}`}
              className="masonry-item block group"
              onMouseEnter={() => setHoveredId(art.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <article
                className={cn(
                  "relative bg-card rounded-card overflow-hidden floating-shadow transition-all duration-600 ease-boutique",
                  visibleItems.has(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image Container */}
                <div className="image-reveal aspect-auto overflow-hidden">
                  <OptimizedImage
                    src={art.imageUrl}
                    alt={art.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-boutique group-hover:scale-[1.03]"
                    containerClassName="w-full h-full"
                    optimizeWidth={760}
                    optimizeHeight={1000}
                    quality={72}
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop";
                    }}
                  />
                  
                  {/* Hover Overlay - 20% dark */}
                  <div className="story-overlay bg-gradient-to-t from-foreground/40 via-foreground/10 to-transparent">
                    <div className="text-primary-foreground">
                      <p className="font-body text-sm leading-relaxed opacity-90">
                        Handmade with care.
                      </p>
                      <div className="flex items-center gap-2 mt-2">
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
                      <span className="px-3 py-1 bg-terracotta text-primary-foreground text-xs tracking-wider uppercase rounded-full font-body">
                        Sale
                      </span>
                    )}
                    {art.stock <= 3 && art.stock > 0 && (
                      <span className="px-3 py-1 bg-foreground/70 text-primary-foreground text-xs tracking-wider uppercase rounded-full font-body">
                        Only {art.stock} left
                      </span>
                    )}
                    {art.stock === 0 && (
                      <span className="px-3 py-1 bg-muted text-muted-foreground text-xs tracking-wider uppercase rounded-full font-body">
                        Sold Out
                      </span>
                    )}
                    {art.customizable && (
                      <span className="px-3 py-1 bg-gold/90 text-foreground text-xs tracking-wider uppercase rounded-full font-body">
                        Customizable
                      </span>
                    )}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => toggleLike(art.id, e)}
                    className={cn(
                      "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                      likedItems.has(art.id)
                        ? "bg-terracotta text-primary-foreground"
                        : "bg-card/90 text-foreground hover:bg-card"
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
                      <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1 font-body">
                        {art.category}
                      </p>
                      <h3 className="font-display text-xl text-foreground group-hover:text-gold transition-colors duration-300">
                        {art.name}
                      </h3>
                    </div>
                    {art.rating > 0 && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-4 h-4 text-gold fill-gold" />
                        <span className="text-sm text-muted-foreground font-body">
                          {art.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-2">
                    {art.salePrice ? (
                      <>
                        <span className="font-display text-xl text-terracotta">
                          ₹{art.salePrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-muted-foreground line-through text-sm font-body">
                          ₹{art.regularPrice.toLocaleString("en-IN")}
                        </span>
                      </>
                    ) : (
                      <span className="font-display text-xl text-foreground">
                        ₹{art.regularPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* Delivery info */}
                  <p className="text-xs text-muted-foreground font-body flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage" />
                    Delivery in 5–7 days
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16">
          <Button variant="artisan" size="xl" className="button-glow" asChild>
            <Link to="/collections">View All Collections</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GalleryGrid;
