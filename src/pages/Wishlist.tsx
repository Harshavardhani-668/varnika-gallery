import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Trash2, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";

const Wishlist = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (item: typeof items[0]) => {
    await addToCart(item.product_id, item.product_name, item.price, 1, item.product_image || undefined);
    removeFromWishlist(item.product_id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-32 pb-20 px-4">
        <div className="varnika-container max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-terracotta" />
            <h1 className="font-display text-4xl text-foreground">Your Wishlist</h1>
          </div>

          {items.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <Heart className="w-16 h-16 text-muted mx-auto mb-4" />
                <h2 className="font-display text-2xl text-foreground mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-6 font-body">Save items you love to revisit them later.</p>
                <Link to="/collections">
                  <Button variant="artisan" className="button-glow">Browse Collections</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(item => (
                <Card key={item.id} className="overflow-hidden group hover-lift">
                  <Link to={`/product/${item.product_id}`}>
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={item.product_image || "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop"}
                        alt={item.product_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  <CardContent className="p-4">
                    <h3 className="font-display text-lg text-foreground mb-1 truncate">{item.product_name}</h3>
                    <p className="font-display text-gold mb-4">₹{item.price.toLocaleString("en-IN")}</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="artisan" className="flex-1 text-xs" onClick={() => handleMoveToCart(item)}>
                        <ShoppingBag className="w-3.5 h-3.5 mr-1" /> Move to Cart
                      </Button>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => removeFromWishlist(item.product_id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
