import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useAnimations";

const GalleryGrid = () => {
  const { data: products, isLoading } = useProducts();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  
  const headerReveal = useScrollReveal<HTMLDivElement>();
  const displayProducts = products?.slice(0, 5) || [];
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
      <section id="gallery" className="py-24 bg-cream">
        <div className="varnika-container">
          <div className="text-center mb-16">
            <Skeleton className="h-4 w-32 mx-auto bg-gold/20" />
            <Skeleton className="h-12 w-64 mx-auto mt-4 bg-espresso/10" />
            <Skeleton className="h-6 w-96 mx-auto mt-4 bg-muted" />
          </div>
          <div className="masonry-grid">
            {[1, 2, 3, 4, 5].map((i) => (
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
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-24 bg-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-pastel-pink/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-pastel-lavender/10 blur-3xl" />
      </div>

      <div className="varnika-container relative">
        {/* Section Header */}
        <div
          ref={headerReveal.ref}
          className={cn(
            "text-center mb-16 transition-all duration-700",
            headerReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase font-body">
            Curated Collection
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-espresso mt-4 mb-6">
            The Gallery
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            Each piece in our collection is a conversation between the artist's vision
            and the timeless traditions of handcraft.
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
                  "relative bg-card rounded-sm overflow-hidden floating-shadow transition-all duration-500",
                  visibleItems.has(index)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-12"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Image Container */}
                <div className="image-reveal aspect-auto">
                  <img
                    src={art.imageUrl}
                    alt={art.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop";
                    }}
                  />
                  
                  {/* Story Overlay */}
                  <div className="story-overlay bg-gradient-to-t from-espresso/90 via-espresso/40 to-transparent">
                    <div className="text-cream">
                      <p className="font-body text-sm leading-relaxed opacity-90">
                        {art.shortDescription}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Eye className="w-4 h-4 text-gold" />
                        <span className="text-xs text-gold tracking-wider uppercase">
                          View Story
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
                    {art.stock <= 3 && art.stock > 0 && (
                      <span className="px-3 py-1 bg-espresso/80 text-cream text-xs tracking-wider uppercase rounded-sm">
                        Only {art.stock} left
                      </span>
                    )}
                    {art.stock === 0 && (
                      <span className="px-3 py-1 bg-muted text-muted-foreground text-xs tracking-wider uppercase rounded-sm">
                        Sold Out
                      </span>
                    )}
                    {art.customizable && (
                      <span className="px-3 py-1 bg-gold/90 text-espresso text-xs tracking-wider uppercase rounded-sm">
                        Customizable
                      </span>
                    )}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => toggleLike(art.id, e)}
                    className={cn(
                      "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 interactive-element",
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
                      <h3 className="font-display text-xl text-espresso group-hover:text-gold transition-colors duration-300">
                        {art.name}
                      </h3>
                    </div>
                    {art.rating > 0 && (
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-4 h-4 text-gold fill-gold" />
                        <span className="text-sm text-muted-foreground">
                          {art.rating}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
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

        {/* View All CTA */}
        <div className="text-center mt-16">
          <Link to="/collections">
            <Button variant="gallery" size="xl" className="interactive-element glow-hover">
              View All Masterpieces
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default GalleryGrid;