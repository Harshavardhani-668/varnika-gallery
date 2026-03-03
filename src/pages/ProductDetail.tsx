import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Heart, Share2, Star, Minus, Plus, 
  Truck, Shield, MessageCircle, ZoomIn, ShoppingBag, Zap
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id || "");
  const { data: allProducts } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  // Track recently viewed
  useEffect(() => {
    if (product && user) {
      supabase.from('recently_viewed').upsert({
        user_id: user.id,
        product_id: product.id,
        product_name: product.name,
        product_image: product.imageUrl,
        price: product.salePrice || product.regularPrice,
        viewed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,product_id' }).then(() => {});
    }
  }, [product?.id, user?.id]);

  const images = product
    ? [product.imageUrl, product.imageUrl2, product.imageUrl3].filter(Boolean)
    : [];

  const relatedProducts = allProducts?.filter(p => 
    p.id !== product?.id && p.category === product?.category
  ).slice(0, 4) || [];

  const isLiked = product ? isInWishlist(product.id) : false;

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    await addToCart(
      product.id,
      product.name,
      product.salePrice || product.regularPrice,
      quantity,
      product.imageUrl
    );
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (!user) {
      toast.info("Please sign in to continue", { description: "You'll be redirected back after login." });
      navigate(`/login?redirect=/product/${product.id}&buyNow=true`);
      return;
    }
    setAddingToCart(true);
    await addToCart(
      product.id,
      product.name,
      product.salePrice || product.regularPrice,
      quantity,
      product.imageUrl
    );
    setAddingToCart(false);
    navigate('/cart');
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleWishlist(product.id, product.name, product.salePrice || product.regularPrice, product.imageUrl);
  };

  const handleShare = async () => {
    if (!product) return;
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.shortDescription, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!", { description: "Product link copied to clipboard." });
    }
  };

  const handleWhatsApp = () => {
    if (!product) return;
    const message = encodeURIComponent(
      `Hi! I'm interested in customizing "${product.name}" (${product.modelNumber}). Can you help me with the options?`
    );
    window.open(`https://wa.me/919876543210?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="varnika-container">
            <Skeleton className="h-6 w-32 mb-8" />
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <Skeleton className="aspect-[4/3] rounded-card" />
              <div className="space-y-6">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-14 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="varnika-container text-center py-16">
            <h1 className="font-display text-3xl text-foreground mb-4">Product Not Found</h1>
            <p className="text-muted-foreground mb-8 font-body">
              The piece you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/collections">
              <Button variant="outline">Browse Collection</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="varnika-container">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Collection
            </Link>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div 
                className="relative aspect-[4/3] rounded-card overflow-hidden bg-cream-dark cursor-zoom-in group"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <img
                  src={images[selectedImage] || product.imageUrl}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-600 ease-boutique",
                    isZoomed ? "scale-150" : "scale-100"
                  )}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&h=800&fit=crop";
                  }}
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-foreground/70 text-primary-foreground text-xs rounded-full opacity-0 group-hover:opacity-100 transition-opacity font-body">
                  <ZoomIn className="w-4 h-4" />
                  Click to {isZoomed ? "zoom out" : "zoom in"}
                </div>
              </div>

              {images.length > 1 && (
                <div className="flex gap-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => { setSelectedImage(index); setIsZoomed(false); }}
                      className={cn(
                        "relative aspect-square w-24 rounded-xl overflow-hidden transition-all duration-300",
                        selectedImage === index
                          ? "ring-2 ring-gold ring-offset-2"
                          : "opacity-60 hover:opacity-100"
                      )}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:sticky lg:top-32 lg:self-start">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 font-body">
                <span>{product.brand}</span>
                {product.modelNumber && (
                  <>
                    <span>•</span>
                    <span>{product.modelNumber}</span>
                  </>
                )}
              </div>

              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-4">
                {product.name}
              </h1>

              {product.rating > 0 && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn("w-5 h-5", i < Math.floor(product.rating) ? "text-gold fill-gold" : "text-muted")}
                      />
                    ))}
                  </div>
                  <span className="font-display text-lg text-foreground">{product.rating}</span>
                  <span className="text-muted-foreground font-body">({product.reviewCount} reviews)</span>
                </div>
              )}

              <p className="text-gold/80 font-body text-sm italic mb-4">
                A handcrafted creation designed to capture emotion and turn moments into lasting memories.
              </p>

              <div className="prose prose-neutral mb-6">
                <p className="text-muted-foreground font-body leading-relaxed whitespace-pre-line">
                  {product.longDescription || product.shortDescription}
                </p>
              </div>

              <p className="text-muted-foreground/80 font-body text-sm mb-8">
                Every Varnika piece is carefully crafted using premium materials and finished with elegant detailing. Personalize it to make your gift truly one of a kind.
              </p>

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
                    <span className="px-3 py-1 bg-terracotta/10 text-terracotta text-sm rounded-full font-body">
                      Save ₹{(product.regularPrice - product.salePrice).toLocaleString("en-IN")}
                    </span>
                  </>
                ) : (
                  <span className="font-display text-4xl text-foreground">
                    ₹{product.regularPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              {product.stock > 0 && product.stock <= 3 && (
                <p className="text-terracotta font-body text-sm mb-6">⚡ Only {product.stock} pieces remaining</p>
              )}
              {product.stock > 3 && (
                <p className="text-sage font-body text-sm mb-6">✓ In Stock</p>
              )}
              {product.stock === 0 && (
                <p className="text-muted-foreground font-body text-sm mb-6">Currently sold out — Join waitlist</p>
              )}

              {/* Quantity & Actions */}
              <div className="space-y-4 mb-8">
                {product.stock > 0 && (
                  <div className="flex items-center gap-4">
                    <span className="font-body text-sm text-muted-foreground w-20">Quantity</span>
                    <div className="flex items-center border border-border rounded-xl">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-cream-dark transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-body">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="p-3 hover:bg-cream-dark transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Actions */}
                <div className="flex flex-col gap-3">
                  <Button
                    variant="artisan"
                    size="xl"
                    className="w-full button-glow"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || addingToCart}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {product.stock === 0 ? "Join Waitlist" : addingToCart ? "Adding..." : "Add to Cart"}
                  </Button>

                  <Button
                    size="xl"
                    className="w-full bg-gold hover:bg-gold-light text-foreground font-body font-semibold text-base"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0 || addingToCart}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    Buy Now
                  </Button>
                </div>

                {/* Secondary Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className={cn("flex-1 rounded-xl", isLiked && "border-terracotta text-terracotta")}
                    onClick={handleToggleWishlist}
                  >
                    <Heart className={cn("w-5 h-5 mr-2", isLiked && "fill-terracotta text-terracotta")} />
                    {isLiked ? "Saved" : "Wishlist"}
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1 rounded-xl" onClick={handleShare}>
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>

                {product.customizable && (
                  <Button variant="outline" size="lg" className="w-full gap-2 rounded-xl" onClick={handleWhatsApp}>
                    <MessageCircle className="w-5 h-5" />
                    Customize via WhatsApp
                  </Button>
                )}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-border">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm text-foreground">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">On orders above ₹5,000</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="font-body text-sm text-foreground">Authenticity Certified</p>
                    <p className="text-xs text-muted-foreground">With every purchase</p>
                  </div>
                </div>
              </div>

              {/* Specifications */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-display text-lg text-foreground mb-4">Details</h3>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="text-muted-foreground font-body">Category</dt>
                    <dd className="font-body text-foreground mt-1">{product.category}</dd>
                  </div>
                  {product.subcategory && (
                    <div>
                      <dt className="text-muted-foreground font-body">Type</dt>
                      <dd className="font-body text-foreground mt-1">{product.subcategory}</dd>
                    </div>
                  )}
                  {product.color && (
                    <div>
                      <dt className="text-muted-foreground font-body">Color/Variant</dt>
                      <dd className="font-body text-foreground mt-1">{product.color}</dd>
                    </div>
                  )}
                  {product.tags.length > 0 && (
                    <div className="col-span-2">
                      <dt className="text-muted-foreground font-body">Tags</dt>
                      <dd className="font-body text-foreground mt-1 flex flex-wrap gap-2">
                        {product.tags.map((tag) => (
                          <span key={tag} className="px-2 py-1 bg-cream-dark text-xs rounded-full">{tag}</span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-border">
              <h2 className="font-display text-3xl text-foreground mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} className="group">
                    <div className="aspect-[3/4] rounded-card overflow-hidden mb-3 bg-cream-dark">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=400&fit=crop"; }}
                      />
                    </div>
                    <h3 className="font-display text-sm text-foreground group-hover:text-gold transition-colors truncate">{p.name}</h3>
                    <p className="font-display text-sm text-gold mt-1">
                      ₹{(p.salePrice || p.regularPrice).toLocaleString("en-IN")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-40 lg:hidden">
        <div className="flex gap-3">
          <Button
            variant="artisan"
            size="lg"
            className="flex-1 button-glow"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addingToCart}
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          <Button
            size="lg"
            className="flex-1 bg-gold hover:bg-gold-light text-foreground font-body font-semibold"
            onClick={handleBuyNow}
            disabled={product.stock === 0 || addingToCart}
          >
            <Zap className="w-4 h-4 mr-2" />
            Buy Now
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
