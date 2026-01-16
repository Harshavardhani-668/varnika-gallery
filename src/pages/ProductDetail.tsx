import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  Minus, 
  Plus, 
  Truck, 
  Shield, 
  MessageCircle,
  ZoomIn 
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Sample product data (would come from API/Google Sheets)
const product = {
  id: "1",
  name: "Whispers of Dawn",
  shortDescription: "A handcrafted canvas capturing the first light breaking through misty mountains",
  longDescription: `Every morning tells a different story, and this piece captures one of those magical moments when the sun first peeks over the Himalayan range, painting the world in hues of gold and rose.

Created using traditional oil techniques passed down through three generations, this painting took 47 days to complete. The artist, Meera Devi, works from her studio in Dharamsala, where the very mountains she paints are visible from her window.

The canvas is stretched over a premium teak frame, hand-carved with subtle lotus motifs that only reveal themselves upon close inspection. A certificate of authenticity accompanies each piece, detailing its unique journey from vision to canvas.

This artwork speaks to those who find peace in dawn's quiet moments—the early risers, the dreamers, the ones who understand that some of life's most beautiful experiences happen when most of the world is still asleep.`,
  brand: "Varnika Originals",
  modelNumber: "VO-2024-WD-001",
  category: "Painting",
  subcategory: "Oil on Canvas",
  tags: ["Landscape", "Himalayan", "Traditional", "Oil Painting"],
  color: "Warm Tones",
  regularPrice: 28500,
  salePrice: 24500,
  costPrice: 15000,
  imageUrl1: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&h=800&fit=crop",
  imageUrl2: "https://images.unsplash.com/photo-1578926288207-a90a5366759d?w=800&h=600&fit=crop",
  imageUrl3: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop",
  stock: 3,
  rating: 4.9,
  reviewCount: 24,
  customizable: true,
  featured: true,
  dimensions: "24 x 36 inches",
  weight: "2.5 kg (framed)",
  materials: "Oil on Belgian Linen, Teak Frame",
  artisan: "Meera Devi",
  origin: "Dharamsala, Himachal Pradesh",
};

const ProductDetail = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const images = [product.imageUrl1, product.imageUrl2, product.imageUrl3];

  const handleReserve = () => {
    toast.success("Piece reserved!", {
      description: "We'll contact you within 2 hours to complete your order.",
    });
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in customizing "${product.name}" (${product.modelNumber}). Can you help me with the options?`
    );
    window.open(`https://wa.me/919876543210?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="varnika-container">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-espresso transition-colors font-body text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Gallery
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div 
                className="relative aspect-[4/3] rounded-sm overflow-hidden bg-cream-dark cursor-zoom-in group"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-500",
                    isZoomed ? "scale-150" : "scale-100"
                  )}
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-espresso/80 text-cream text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                  Click to {isZoomed ? "zoom out" : "zoom in"}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      setIsZoomed(false);
                    }}
                    className={cn(
                      "relative aspect-square w-24 rounded-sm overflow-hidden transition-all duration-300",
                      selectedImage === index
                        ? "ring-2 ring-gold ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={img}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              {/* Brand & Model */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                <span className="font-body">{product.brand}</span>
                <span>•</span>
                <span className="font-body">{product.modelNumber}</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl md:text-5xl text-espresso mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "w-5 h-5",
                        i < Math.floor(product.rating)
                          ? "text-gold fill-gold"
                          : "text-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="font-display text-lg text-espresso">{product.rating}</span>
                <span className="text-muted-foreground font-body">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Description */}
              <div className="prose prose-neutral mb-8">
                <p className="text-muted-foreground font-body leading-relaxed whitespace-pre-line">
                  {product.longDescription}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-8">
                {product.salePrice ? (
                  <>
                    <span className="font-display text-4xl text-terracotta">
                      ₹{product.salePrice.toLocaleString("en-IN")}
                    </span>
                    <span className="font-display text-xl text-muted-foreground line-through">
                      ₹{product.regularPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="px-3 py-1 bg-terracotta/10 text-terracotta text-sm rounded">
                      Save ₹{(product.regularPrice - product.salePrice).toLocaleString("en-IN")}
                    </span>
                  </>
                ) : (
                  <span className="font-display text-4xl text-espresso">
                    ₹{product.regularPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {product.stock <= 3 && product.stock > 0 && (
                <p className="text-terracotta font-body text-sm mb-6">
                  ⚡ Only {product.stock} pieces remaining
                </p>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-4 mb-8">
                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <span className="font-body text-sm text-muted-foreground w-20">Quantity</span>
                  <div className="flex items-center border border-border rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-cream-dark transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-body">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-cream-dark transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="reserve"
                    size="xl"
                    className="flex-1"
                    onClick={handleReserve}
                  >
                    Reserve This Piece
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-14 w-14 border border-border"
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={cn(
                        "w-6 h-6 transition-colors",
                        isLiked ? "fill-terracotta text-terracotta" : "text-espresso-light"
                      )}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-14 w-14 border border-border"
                  >
                    <Share2 className="w-6 h-6 text-espresso-light" />
                  </Button>
                </div>

                {/* Customize Button */}
                {product.customizable && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleWhatsApp}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Customize This Artwork via WhatsApp
                  </Button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm text-espresso">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">On orders above ₹5,000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm text-espresso">Authenticity Certified</p>
                    <p className="text-xs text-muted-foreground">With every purchase</p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-display text-lg text-espresso mb-4">Specifications</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground font-body">Dimensions</dt>
                    <dd className="font-body text-espresso mt-1">{product.dimensions}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground font-body">Weight</dt>
                    <dd className="font-body text-espresso mt-1">{product.weight}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground font-body">Materials</dt>
                    <dd className="font-body text-espresso mt-1">{product.materials}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground font-body">Artisan</dt>
                    <dd className="font-body text-espresso mt-1">{product.artisan}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-muted-foreground font-body">Origin</dt>
                    <dd className="font-body text-espresso mt-1">{product.origin}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
