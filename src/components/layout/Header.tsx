import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Heart, Search, ShoppingBag, User, LogOut, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import SearchModal from "@/components/SearchModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, signOut } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { getCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Poll cart count from localStorage
  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem('varnika_cart');
        const items = stored ? JSON.parse(stored) : [];
        setCartCount(items.reduce((sum: number, i: any) => sum + (i.quantity || 0), 0));
      } catch { setCartCount(0); }
    };
    updateCount();
    const interval = setInterval(updateCount, 1000);
    window.addEventListener('storage', updateCount);
    return () => { clearInterval(interval); window.removeEventListener('storage', updateCount); };
  }, []);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || 'U';
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Shop", href: "/collections" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-boutique",
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-soft py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="varnika-container">
          <nav className="flex items-center justify-between">
            <Link to="/" className="relative z-10">
              <span className="font-display text-2xl md:text-3xl tracking-wide text-foreground block">
                Varnika
              </span>
              <span className="hidden md:block text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-0.5 font-body">
                Handcrafted with Heart
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="font-body text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {/* Search */}
              <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setIsSearchOpen(true)} aria-label="Open search">
                <Search className="w-5 h-5 text-muted-foreground" />
              </Button>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" className="hidden md:flex relative" asChild aria-label="Open wishlist">
                <Link to="/wishlist">
                  <Heart className="w-5 h-5 text-muted-foreground" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-terracotta text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon" className="hidden md:flex relative" asChild aria-label="Open cart">
                <Link to="/cart">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-gold text-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </Button>
              
              {/* User */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="hidden md:flex rounded-full" aria-label="Open account menu">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-gold/20 text-foreground text-sm font-body">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.user_metadata?.full_name || 'My Account'}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="mr-2 h-4 w-4" />My Account
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/orders')}>
                      <Package className="mr-2 h-4 w-4" />My Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/wishlist')}>
                      <Heart className="mr-2 h-4 w-4" />Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/cart')}>
                      <ShoppingBag className="mr-2 h-4 w-4" />Cart
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="sm" className="hidden md:flex font-body" aria-label="Sign in" asChild>
                  <Link to="/login"><User className="w-4 h-4 mr-2" />Sign In</Link>
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </nav>

          {/* Mobile Menu */}
          <div
            className={cn(
              "lg:hidden fixed inset-0 top-[72px] bg-background/98 backdrop-blur-lg transition-all duration-500 ease-boutique",
              isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            )}
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-display text-3xl text-foreground hover:text-gold transition-colors duration-300"
                >
                  {link.name}
                </Link>
              ))}

              <div className="flex items-center gap-6 mt-6">
                <Button variant="ghost" size="icon" onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} aria-label="Open search">
                  <Search className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" className="relative" asChild aria-label="Open wishlist">
                  <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>
                    <Heart className="w-6 h-6" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="relative" asChild aria-label="Open cart">
                  <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)}>
                    <ShoppingBag className="w-6 h-6" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </Button>
                {user ? (
                  <>
                    <Button variant="ghost" size="icon" asChild aria-label="Open account dashboard">
                      <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}><User className="w-6 h-6" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild aria-label="Open orders">
                      <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}><Package className="w-6 h-6" /></Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }} aria-label="Sign out">
                      <LogOut className="w-6 h-6" />
                    </Button>
                  </>
                ) : (
                  <Button variant="ghost" size="icon" asChild aria-label="Sign in">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}><User className="w-6 h-6" /></Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;
