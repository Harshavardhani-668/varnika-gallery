import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Heart, Share2, Star, Minus, Plus, 
  Truck, Shield, ZoomIn, ShoppingBag, Zap
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import FloatingClouds from "@/components/effects/FloatingClouds";
import OptimizedImage from "@/components/ui/optimized-image";

interface ProductReview {
  id: string;
  reviewer_name: string;
  user_id: string;
  rating: number;
  review_text: string;
  review_image_url: string | null;
  created_at: string;
}

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
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [eligibleOrderId, setEligibleOrderId] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewImageFile, setReviewImageFile] = useState<File | null>(null);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

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

  const loadReviewData = useCallback(async () => {
    if (!product?.id) {
      setReviews([]);
      setEligibleOrderId(null);
      return;
    }

    setReviewsLoading(true);

    const { data: reviewRows } = await supabase
      .from('reviews')
      .select('id, user_id, rating, review_text, review_image_url, created_at')
      .eq('product_id', product.id)
      .order('created_at', { ascending: false });

    const rawReviews = (reviewRows || []) as Omit<ProductReview, 'reviewer_name'>[];

    const reviewerIds = [...new Set(rawReviews.map((review) => review.user_id))];
    const nameMap: Record<string, string> = {};
    if (reviewerIds.length > 0) {
      const { data: profileRows } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', reviewerIds);

      for (const profile of profileRows || []) {
        nameMap[profile.id] = profile.full_name || 'Anonymous';
      }
    }

    setReviews(
      rawReviews.map((review) => ({
        ...review,
        reviewer_name: nameMap[review.user_id] || 'Anonymous',
      }))
    );

    if (user) {
      const { data: userOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id);

      const orderIds = (userOrders || []).map((order) => order.id);
      if (orderIds.length === 0) {
        setEligibleOrderId(null);
        setReviewsLoading(false);
        return;
      }

      const { data: purchasedItems } = await supabase
        .from('order_items')
        .select('order_id')
        .eq('product_id', product.id)
        .in('order_id', orderIds);

      const purchasedOrderIds = [...new Set((purchasedItems || []).map((item) => item.order_id))];

      if (purchasedOrderIds.length === 0) {
        setEligibleOrderId(null);
        setReviewsLoading(false);
        return;
      }

      const { data: existingReviews } = await supabase
        .from('reviews')
        .select('order_id')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .in('order_id', purchasedOrderIds);

      const alreadyReviewedOrderIds = new Set((existingReviews || []).map((row) => row.order_id));
      const availableOrderId = purchasedOrderIds.find((orderId) => !alreadyReviewedOrderIds.has(orderId)) || null;
      setEligibleOrderId(availableOrderId);
    } else {
      setEligibleOrderId(null);
    }

    setReviewsLoading(false);
  }, [product?.id, user?.id]);

  useEffect(() => {
    loadReviewData();
  }, [loadReviewData]);

  const submitReview = async () => {
    if (!product || !user) {
      toast.error("Please sign in to review");
      return;
    }

    if (!eligibleOrderId) {
      toast.error("Review not eligible", {
        description: "You can review this product only after a confirmed purchase.",
      });
      return;
    }

    if (reviewRating < 1 || reviewRating > 5) {
      toast.error("Please provide a star rating");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    setSubmittingReview(true);

    try {
      let reviewImageUrl: string | null = null;

      if (reviewImageFile) {
        const ext = reviewImageFile.name.split('.').pop() || 'jpg';
        const filePath = `${user.id}/${product.id}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from('review-images')
          .upload(filePath, reviewImageFile, { upsert: false });

        if (uploadError) {
          toast.error("Image upload failed", { description: uploadError.message });
          return;
        }

        const { data: publicUrlData } = supabase.storage.from('review-images').getPublicUrl(filePath);
        reviewImageUrl = publicUrlData.publicUrl;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          order_id: eligibleOrderId,
          product_id: product.id,
          rating: reviewRating,
          review_text: reviewText.trim(),
          review_image_url: reviewImageUrl,
        });

      if (error) {
        if (error.code === '23505') {
          toast.error("Duplicate review", {
            description: "You have already reviewed this purchased item.",
          });
        } else {
          toast.error("Unable to submit review", { description: error.message });
        }
        return;
      }

      toast.success("Thank you for your review ❤️");
      setReviewRating(0);
      setReviewText("");
      setReviewImageFile(null);
      setIsReviewModalOpen(false);
      await loadReviewData();
    } finally {
      setSubmittingReview(false);
    }
  };

  const images = product
    ? [product.imageUrl, product.imageUrl2, product.imageUrl3].filter(Boolean)
    : [];

  const relatedProducts = allProducts?.filter(p => 
    p.id !== product?.id && p.category === product?.category
  ).slice(0, 4) || [];

  const isLiked = product ? isInWishlist(product.id) : false;
  const averageRating = reviews.length > 0
    ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
    : product.rating || 0;
  const totalReviews = reviews.length > 0 ? reviews.length : product.reviewCount;
  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((review) => review.rating === star).length;
    const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { star, count, percent };
  });
  const topReviews = reviews.filter((review) => review.rating >= 5).slice(0, 2);
  const reviewImages = reviews
    .filter((review) => Boolean(review.review_image_url))
    .map((review) => ({ id: review.id, imageUrl: review.review_image_url as string }));

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
        <section className="relative overflow-hidden">
          <FloatingClouds count={3} />
          <div className="varnika-container relative z-10">
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
                <OptimizedImage
                  src={images[selectedImage] || product.imageUrl}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-600 ease-boutique",
                    isZoomed ? "scale-150" : "scale-100"
                  )}
                  containerClassName="w-full h-full"
                  optimizeWidth={1100}
                  optimizeHeight={900}
                  quality={74}
                  eager
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
                      <OptimizedImage
                        src={img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                        optimizeWidth={200}
                        optimizeHeight={200}
                        quality={68}
                      />
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
                    variant="outline"
                    size="xl"
                    className="w-full rounded-xl"
                    onClick={handleBuyNow}
                    disabled={product.stock === 0 || addingToCart}
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {product.stock === 0 ? "Join Waitlist" : addingToCart ? "Processing..." : "Buy Standard"}
                  </Button>

                  <Button
                    size="xl"
                    className="w-full bg-gold hover:bg-gold-light text-foreground font-body font-semibold text-base button-glow"
                    onClick={() => navigate(`/customize/${product.id}`)}
                    disabled={product.stock === 0}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    {product.stock === 0 ? "Join Waitlist" : "Customize This Product"}
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

          {/* Reviews */}
          <div className="mt-20 pt-12 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="font-display text-3xl text-foreground">Customer Reviews</h2>
              {user && eligibleOrderId && (
                <Button
                  type="button"
                  variant="artisan"
                  className="w-full md:w-auto"
                  onClick={() => setIsReviewModalOpen(true)}
                >
                  Rate this Product
                </Button>
              )}
            </div>

            <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 mb-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-card p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-1">Average Rating</p>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-gold fill-gold" />
                    <p className="font-display text-2xl text-foreground">{averageRating.toFixed(1)}/5</p>
                  </div>
                </div>
                <div className="bg-card border border-border rounded-card p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-1">Total Reviews</p>
                  <p className="font-display text-2xl text-foreground">{totalReviews}</p>
                </div>
              </div>

              <div className="bg-card border border-border rounded-card p-4">
                <p className="text-xs uppercase tracking-widest text-muted-foreground font-body mb-1">Average Rating</p>
                <div className="space-y-2 mt-3">
                  {ratingBreakdown.map((item) => (
                    <div key={item.star} className="grid grid-cols-[34px_1fr_42px] items-center gap-2">
                      <span className="text-sm font-body text-foreground">{item.star}★</span>
                      <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-gold" style={{ width: `${item.percent}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground font-body text-right">{item.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {!user && (
              <p className="font-body text-sm text-muted-foreground mb-8">
                Sign in and purchase this product to leave a review.
              </p>
            )}

            {user && !eligibleOrderId && (
              <p className="font-body text-sm text-muted-foreground mb-8">
                You can review this product after purchase. One review is allowed per purchased order.
              </p>
            )}

            {topReviews.length > 0 && (
              <div className="mb-8">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-gold mb-3">Top Reviews</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {topReviews.map((review) => (
                    <article key={`top-${review.id}`} className="bg-gold/10 border border-gold/30 rounded-card p-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p className="font-body text-sm font-semibold text-foreground">{review.reviewer_name}</p>
                        <span className="text-xs text-muted-foreground font-body">
                          {new Date(review.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={`top-${review.id}-${star}`}
                            className={cn("w-4 h-4", review.rating >= star ? "text-gold fill-gold" : "text-muted")}
                          />
                        ))}
                      </div>
                      <p className="font-body text-sm text-foreground line-clamp-3">{review.review_text}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {reviewImages.length > 0 && (
              <div className="mb-8">
                <p className="font-body text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">Review Photos</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {reviewImages.map((item) => (
                    <div key={`img-${item.id}`} className="aspect-square rounded-xl overflow-hidden border border-border bg-card">
                      <OptimizedImage
                        src={item.imageUrl}
                        alt="Customer review photo"
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                        optimizeWidth={240}
                        optimizeHeight={240}
                        quality={68}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reviewsLoading ? (
              <Skeleton className="h-24 w-full" />
            ) : reviews.length === 0 ? (
              <p className="font-body text-sm text-muted-foreground">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <article key={review.id} className={cn(
                    "bg-card border border-border rounded-card p-5",
                    review.rating >= 5 ? "border-gold/40" : ""
                  )}>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-body text-sm font-semibold text-foreground">{review.reviewer_name}</p>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-body uppercase tracking-wide bg-sage/20 text-sage">
                            Verified Buyer
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={`${review.id}-${star}`}
                              className={cn(
                                "w-4 h-4",
                                review.rating >= star ? "text-gold fill-gold" : "text-muted"
                              )}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground font-body">
                        {new Date(review.created_at).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <p className="font-body text-sm text-foreground leading-relaxed whitespace-pre-line mb-3">
                      {review.review_text}
                    </p>
                    {review.review_image_url && (
                      <OptimizedImage
                        src={review.review_image_url}
                        alt="Review upload"
                        className="w-28 h-28 rounded-xl object-cover border border-border"
                        optimizeWidth={240}
                        optimizeHeight={240}
                        quality={68}
                      />
                    )}
                  </article>
                ))}
              </div>
            )}

            <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
              <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Rate this Product</DialogTitle>
                  <DialogDescription>
                    Share your purchase experience to help other customers choose confidently.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                  <div>
                    <p className="text-sm font-body text-muted-foreground mb-2">Your Rating</p>
                    <div className="flex items-center gap-2" aria-label="Select star rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={`rate-${star}`}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="w-11 h-11 rounded-full border border-border flex items-center justify-center active:scale-95 transition-transform"
                        >
                          <Star
                            className={cn(
                              "w-6 h-6 transition-colors",
                              reviewRating >= star ? "text-gold fill-gold" : "text-muted"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-body text-muted-foreground mb-2">Your Review</p>
                    <Textarea
                      placeholder="Tell us what you liked about the product"
                      className="min-h-[140px] text-base"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-body text-muted-foreground">Upload image (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setReviewImageFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-gold/15 file:px-3 file:py-2"
                    />
                    {reviewImageFile && (
                      <p className="text-xs text-muted-foreground">Selected: {reviewImageFile.name}</p>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="artisan"
                    className="w-full"
                    onClick={submitReview}
                    disabled={submittingReview || reviewsLoading}
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20 pt-12 border-t border-border">
              <h2 className="font-display text-3xl text-foreground mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map(p => (
                  <Link key={p.id} to={`/product/${p.id}`} className="group">
                    <div className="aspect-[3/4] rounded-card overflow-hidden mb-3 bg-cream-dark">
                      <OptimizedImage
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        containerClassName="w-full h-full"
                        optimizeWidth={480}
                        optimizeHeight={640}
                        quality={70}
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
        </section>
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
