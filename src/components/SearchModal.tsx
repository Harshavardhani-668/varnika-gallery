import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, X, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";
import { cn } from "@/lib/utils";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: products } = useProducts();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (!isOpen) return; // parent handles opening
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const filtered = products?.filter(p =>
    query.length >= 2 && (
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    )
  )?.slice(0, 8) || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-card rounded-2xl shadow-elevated overflow-hidden animate-scale-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search products, categories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 shadow-none focus-visible:ring-0 font-body text-base h-auto p-0"
          />
          <button onClick={onClose} className="shrink-0 p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {query.length < 2 ? (
            <div className="px-5 py-8 text-center text-muted-foreground font-body text-sm">
              Type at least 2 characters to search...
            </div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-muted-foreground font-body text-sm">
              No products found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {filtered.map(product => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-muted/50 transition-colors group"
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100&h=100&fit=crop";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-foreground group-hover:text-gold transition-colors truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{product.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-sm text-foreground">
                      ₹{(product.salePrice || product.regularPrice).toLocaleString("en-IN")}
                    </p>
                    {product.rating > 0 && (
                      <div className="flex items-center gap-1 justify-end mt-0.5">
                        <Star className="w-3 h-3 text-gold fill-gold" />
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="px-5 py-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-body">
            {filtered.length > 0 ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}` : ''}
          </span>
          <span className="text-xs text-muted-foreground font-body">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">ESC</kbd> to close
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
