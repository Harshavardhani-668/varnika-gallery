import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";
import OptimizedImage from "@/components/ui/optimized-image";

const occasions = [
  {
    name: "Birthday Gifts",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=500&fit=crop",
    filter: "Birthday",
  },
  {
    name: "Anniversary Gifts",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=500&fit=crop",
    filter: "Anniversary",
  },
  {
    name: "Graduation Gifts",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=900&h=1200&fit=crop&auto=format&q=85",
    filter: "Graduation",
  },
  {
    name: "Baby Gifts",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=500&fit=crop",
    filter: "Baby",
  },
  {
    name: "Home Decor",
    image: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=400&h=500&fit=crop",
    filter: "Home Decor",
  },
];

const ShopByOccasion = () => {
  const reveal = useScrollReveal<HTMLElement>();

  return (
    <section ref={reveal.ref} className="py-20 bg-cream-dark relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-72 h-72 rounded-full bg-pastel-pink/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
      </div>

      <div className="varnika-container relative z-10">
        <div
          className={cn(
            "text-center mb-14 transition-all duration-700 ease-boutique",
            reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-gold text-sm tracking-widest uppercase font-body">
            Find the Perfect Gift
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-4">
            Shop by Occasion
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-body">
            Thoughtfully curated collections for every special moment in life.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {occasions.map((occ, i) => (
            <Link
              key={occ.name}
              to={`/collections?category=${encodeURIComponent(occ.filter)}`}
              className={cn(
                "group relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-700 ease-boutique border border-white/25 shadow-[0_12px_30px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.14)]",
                reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              )}
              style={{ transitionDelay: `${(i + 1) * 120}ms` }}
            >
              <OptimizedImage
                src={occ.image}
                alt={occ.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-boutique group-hover:scale-110"
                containerClassName="absolute inset-0"
                optimizeWidth={600}
                optimizeHeight={800}
                quality={70}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-display text-lg text-primary-foreground group-hover:text-gold transition-colors duration-300">
                  {occ.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByOccasion;
