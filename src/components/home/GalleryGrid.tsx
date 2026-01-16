import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ArtPiece {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  brand: string;
  category: string;
  subcategory: string;
  regularPrice: number;
  salePrice?: number;
  imageUrl: string;
  stock: number;
  rating: number;
  reviewCount: number;
  customizable: boolean;
  featured: boolean;
}

// Sample art pieces for demonstration
const artPieces: ArtPiece[] = [
  {
    id: "1",
    name: "Ethereal Bloom",
    shortDescription: "Delicate petals captured in eternal bronze",
    longDescription: "A stunning sculpture that captures the fleeting beauty of a flower in bloom, cast in solid bronze using the ancient lost-wax method.",
    brand: "Varnika Originals",
    category: "Sculpture",
    subcategory: "Bronze",
    regularPrice: 18500,
    imageUrl: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?w=600&h=800&fit=crop",
    stock: 3,
    rating: 4.9,
    reviewCount: 24,
    customizable: true,
    featured: true,
  },
  {
    id: "2",
    name: "Midnight Serenity",
    shortDescription: "Abstract expressions of calm in deep indigo",
    longDescription: "This oil painting explores the quiet moments between dusk and dawn, where thoughts settle like stars.",
    brand: "Varnika Originals",
    category: "Painting",
    subcategory: "Oil",
    regularPrice: 28000,
    salePrice: 24500,
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=900&fit=crop",
    stock: 1,
    rating: 5.0,
    reviewCount: 18,
    customizable: false,
    featured: true,
  },
  {
    id: "3",
    name: "Woven Dreams",
    shortDescription: "Traditional textile art meets modern vision",
    longDescription: "Handwoven on a traditional loom, this piece brings together centuries-old techniques with contemporary design.",
    brand: "Artisan Collective",
    category: "Textile",
    subcategory: "Woven",
    regularPrice: 12000,
    imageUrl: "https://images.unsplash.com/photo-1617503752587-97d2103a96ea?w=600&h=600&fit=crop",
    stock: 5,
    rating: 4.7,
    reviewCount: 32,
    customizable: true,
    featured: false,
  },
  {
    id: "4",
    name: "Terra Vessels",
    shortDescription: "Earth-toned ceramics shaped by patient hands",
    longDescription: "Each vessel is individually thrown on a potter's wheel and fired in a wood-burning kiln for unique variations.",
    brand: "Clay Studio",
    category: "Ceramics",
    subcategory: "Pottery",
    regularPrice: 8500,
    salePrice: 7200,
    imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=750&fit=crop",
    stock: 8,
    rating: 4.8,
    reviewCount: 45,
    customizable: true,
    featured: false,
  },
  {
    id: "5",
    name: "Golden Hour",
    shortDescription: "Capturing light through handblown glass",
    longDescription: "A master glassblower's interpretation of the magical light that occurs just before sunset.",
    brand: "Glass Atelier",
    category: "Glass Art",
    subcategory: "Blown Glass",
    regularPrice: 35000,
    imageUrl: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=600&h=700&fit=crop",
    stock: 2,
    rating: 4.9,
    reviewCount: 12,
    customizable: false,
    featured: true,
  },
  {
    id: "6",
    name: "Silent Forest",
    shortDescription: "Woodblock print of ancient groves",
    longDescription: "Using traditional Japanese woodblock techniques, this print captures the mystical atmosphere of old-growth forests.",
    brand: "Print House",
    category: "Print",
    subcategory: "Woodblock",
    regularPrice: 6500,
    imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=600&h=850&fit=crop",
    stock: 15,
    rating: 4.6,
    reviewCount: 58,
    customizable: false,
    featured: false,
  },
];

const GalleryGrid = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section id="gallery" className="py-24 bg-cream">
      <div className="varnika-container">
        {/* Section Header */}
        <div className="text-center mb-16">
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
        <div className="masonry-grid">
          {artPieces.map((art, index) => (
            <Link
              key={art.id}
              to={`/product/${art.id}`}
              className="masonry-item block group"
              onMouseEnter={() => setHoveredId(art.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <article className="relative bg-card rounded-sm overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-500 animate-fade-in">
                {/* Image Container */}
                <div className="image-reveal aspect-auto">
                  <img
                    src={art.imageUrl}
                    alt={art.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                      "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
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
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="text-sm text-muted-foreground">
                        {art.rating}
                      </span>
                    </div>
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
          <Button variant="gallery" size="xl">
            View Full Collection
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GalleryGrid;
