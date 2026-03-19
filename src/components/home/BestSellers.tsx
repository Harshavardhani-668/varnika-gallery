import { Link } from "react-router-dom";
import { Star, ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProducts } from "@/hooks/useProducts";
import { useScrollReveal } from "@/hooks/useAnimations";

const BestSellers = () => {
  const { data: products, isLoading } = useProducts();
  const reveal = useScrollReveal<HTMLElement>();

  // Show top-rated or first 8 products
  const bestSellers = products
    ?.slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8) || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-background">
        <div className="varnika-container">
          <div className="text-center mb-12">
            <Skeleton className="h-4 w-32 mx-auto bg-muted" />
            <Skeleton className="h-12 w-64 mx-auto mt-4 bg-muted" />
          </div>
          <div className="flex gap-5 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[260px]">
                <Skeleton className="w-full aspect-[3/4] rounded-2xl" />
                <Skeleton className="h-5 w-32 mt-3" />
                <Skeleton className="h-4 w-20 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={reveal.ref} className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-20 left-10 w-64 h-64 rounded-full bg-gold/3 blur-3xl" />
      </div>

      <div className="varnika-container relative z-10">
        <div
          className={cn(
            "flex items-end justify-between mb-12 transition-all duration-700 ease-boutique",
            reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div>
            <span className="text-gold text-sm tracking-widest uppercase font-body">
              Most Loved
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-foreground mt-3">
              Best Sellers
            </h2>
          </div>
          <Link to="/collections" className="hidden md:block">
            <Button variant="ghost" className="text-gold hover:text-foreground group">
              View All
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Horizontal scroll */}
        <div className="flex gap-5 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory scrollbar-hide">
          {bestSellers.map((product, i) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className={cn(
                "min-w-[240px] sm:min-w-[260px] snap-start group flex-shrink-0 transition-all duration-700 ease-boutique",
                reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${(i + 1) * 80}ms` }}
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-cream-dark mb-3">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-boutique group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop";
                  }}
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.customizable && (
                    <span className="px-2.5 py-1 bg-gold/90 text-foreground text-[10px] tracking-wider uppercase rounded-full font-body font-medium">
                      Customisable
                    </span>
                  )}
                  {product.salePrice && (
                    <span className="px-2.5 py-1 bg-terracotta text-primary-foreground text-[10px] tracking-wider uppercase rounded-full font-body font-medium">
                      Sale
                    </span>
                  )}
                  {product.rating >= 4.5 && (
                    <span className="px-2.5 py-1 bg-foreground/80 text-primary-foreground text-[10px] tracking-wider uppercase rounded-full font-body font-medium">
                      Best Seller
                    </span>
                  )}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
              </div>

              <h3 className="font-display text-base text-foreground group-hover:text-gold transition-colors duration-300 line-clamp-1">
                {product.name}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                {product.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                    <span className="text-xs text-muted-foreground font-body">{product.rating}</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground font-body">•</span>
                <div className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-body">5–7 days</span>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mt-1.5">
                {product.salePrice ? (
                  <>
                    <span className="font-display text-lg text-terracotta">
                      ₹{product.salePrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-muted-foreground line-through text-xs font-body">
                      ₹{product.regularPrice.toLocaleString("en-IN")}
                    </span>
                  </>
                ) : (
                  <span className="font-display text-lg text-foreground">
                    ₹{product.regularPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/collections">
            <Button variant="artisan" size="lg" className="button-glow">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
