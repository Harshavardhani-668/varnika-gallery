import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, Eye, Star, Filter, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useProducts, useCategories } from "@/hooks/useProducts";
import { useScrollReveal, useStaggeredReveal } from "@/hooks/useAnimations";
import FloatingClouds from "@/components/effects/FloatingClouds";
import OptimizedImage from "@/components/ui/optimized-image";

const Collections = () => {
  const { data: products, isLoading } = useProducts();
  const { data: categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const headerReveal = useScrollReveal<HTMLDivElement>();

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((product) => {
      const matchesSearch =
        searchQuery === "" ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const { containerRef, visibleItems } = useStaggeredReveal(filteredProducts.length, 80);

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

      {/* Hero Banner with clouds */}
      <section className="relative pt-32 pb-16 overflow-hidden pastel-clouds">
        <FloatingClouds count={4} />
        <div className="absolute inset-0 gradient-bg-pastel opacity-20" />
        
        <div
          ref={headerReveal.ref}
          className={cn(
            "varnika-container relative z-10 text-center transition-all duration-700",
            headerReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase font-body">
            Our Collection
          </span>
          <h1 className="font-display text-4xl md:text-6xl text-espresso mt-4 mb-6 text-shadow-soft">
            All Masterpieces
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body">
            Explore our complete collection of handcrafted art pieces, each
            telling its own unique story.
          </p>
        </div>
      </section>

      <main className="pb-16">
        <div className="varnika-container">
          {/* Search & Filter Bar */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search Input */}
              <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, category, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-border bg-card font-body rounded-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-espresso" />
                  </button>
                )}
              </div>

              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                className="md:hidden w-full interactive-element"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter by Category
              </Button>

              {/* Category Filters (Desktop) */}
              <div className="hidden md:flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    "font-body rounded-full interactive-element",
                    selectedCategory === null && "bg-espresso text-cream"
                  )}
                >
                  All
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "font-body rounded-full interactive-element",
                      selectedCategory === category && "bg-espresso text-cream"
                    )}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="md:hidden flex flex-wrap gap-2 mt-4 animate-fade-in-up">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => { setSelectedCategory(null); setShowFilters(false); }}
                  className={cn("font-body rounded-full", selectedCategory === null && "bg-espresso text-cream")}
                >
                  All
                </Button>
                {categories?.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => { setSelectedCategory(category); setShowFilters(false); }}
                    className={cn("font-body rounded-full", selectedCategory === category && "bg-espresso text-cream")}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-8">
            <p className="text-muted-foreground font-body">
              {isLoading
                ? "Loading..."
                : `Showing ${filteredProducts.length} ${filteredProducts.length === 1 ? "piece" : "pieces"}`}
            </p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="w-full aspect-[3/4] rounded-sm" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
          )}

          {/* Products Grid */}
          {!isLoading && (
            <div
              ref={containerRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((art, index) => (
                <Link
                  key={art.id}
                  to={`/product/${art.id}`}
                  className="block group"
                >
                  <article
                    className={cn(
                      "relative bg-card rounded-sm overflow-hidden floating-shadow transition-all duration-500",
                      visibleItems.has(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                    )}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <OptimizedImage
                        src={art.imageUrl}
                        alt={art.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        containerClassName="w-full h-full"
                        optimizeWidth={720}
                        optimizeHeight={960}
                        quality={72}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop";
                        }}
                      />

                      {/* Story Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                        <div className="text-cream">
                          <p className="font-body text-sm leading-relaxed opacity-90 line-clamp-2">
                            {art.shortDescription}
                          </p>
                          <div className="flex items-center gap-2 mt-3">
                            <Eye className="w-4 h-4 text-gold" />
                            <span className="text-xs text-gold tracking-wider uppercase">View Story</span>
                          </div>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {art.salePrice && (
                          <span className="px-2 py-1 bg-terracotta text-cream text-xs tracking-wider uppercase rounded-sm">Sale</span>
                        )}
                        {art.stock <= 3 && art.stock > 0 && (
                          <span className="px-2 py-1 bg-espresso/80 text-cream text-xs tracking-wider uppercase rounded-sm">
                            Only {art.stock} left
                          </span>
                        )}
                        {art.stock === 0 && (
                          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs tracking-wider uppercase rounded-sm">Sold Out</span>
                        )}
                        {art.customizable && (
                          <span className="px-2 py-1 bg-gold/90 text-espresso text-xs tracking-wider uppercase rounded-sm">Customizable</span>
                        )}
                      </div>

                      {/* Like Button */}
                      <button
                        onClick={(e) => toggleLike(art.id, e)}
                        className={cn(
                          "absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 interactive-element",
                          likedItems.has(art.id)
                            ? "bg-terracotta text-cream"
                            : "bg-cream/90 text-espresso hover:bg-cream"
                        )}
                      >
                        <Heart
                          className={cn("w-4 h-4 transition-transform", likedItems.has(art.id) ? "fill-current scale-110" : "")}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-xs text-muted-foreground tracking-wider uppercase mb-1">{art.category}</p>
                          <h3 className="font-display text-lg text-espresso group-hover:text-gold transition-colors duration-300 line-clamp-1">
                            {art.name}
                          </h3>
                        </div>
                        {art.rating > 0 && (
                          <div className="flex items-center gap-1 shrink-0">
                            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                            <span className="text-xs text-muted-foreground">{art.rating}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        {art.salePrice ? (
                          <>
                            <span className="font-display text-lg text-terracotta">₹{art.salePrice.toLocaleString("en-IN")}</span>
                            <span className="text-muted-foreground line-through text-xs">₹{art.regularPrice.toLocaleString("en-IN")}</span>
                          </>
                        ) : (
                          <span className="font-display text-lg text-espresso">₹{art.regularPrice.toLocaleString("en-IN")}</span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-16 animate-fade-in-up">
              <p className="font-display text-2xl text-espresso mb-4">No pieces found</p>
              <p className="text-muted-foreground font-body mb-8">Try adjusting your search or filter criteria</p>
              <Button
                variant="outline"
                className="interactive-element"
                onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Collections;