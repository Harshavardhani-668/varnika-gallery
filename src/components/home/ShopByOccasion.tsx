import { useScrollReveal } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

const occasions = [
  {
    title: "Birthday",
    subtitle: "Make Their Day Special",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&h=600&fit=crop&auto=format&q=80",
  },
  {
    title: "Anniversary",
    subtitle: "Celebrate Love",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=500&h=600&fit=crop&auto=format&q=80",
  },
  {
    title: "Wedding",
    subtitle: "Forever Begins Here",
    image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&h=600&fit=crop&auto=format&q=80",
  },
  {
    title: "Love",
    subtitle: "For Your Special One",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=500&h=600&fit=crop&auto=format&q=80",
  },
  {
    title: "Baby",
    subtitle: "Welcome Little Joy",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&h=600&fit=crop&auto=format&q=80",
  },
  {
    title: "Festivals",
    subtitle: "Celebrate Every Moment",
    image: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=500&h=600&fit=crop&auto=format&q=80",
  },
  {
    title: "Housewarming",
    subtitle: "New Beginnings",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500&h=600&fit=crop&auto=format&q=80",
  },
  {
    title: "Personalized",
    subtitle: "Made Just for Them",
    image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=500&h=600&fit=crop&auto=format&q=80",
  },
];

const ShopByOccasion = () => {
  const reveal = useScrollReveal<HTMLElement>();

  return (
    <section ref={reveal.ref} className="py-20 bg-gradient-to-b from-cream-dark via-cream to-cream-dark relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-72 h-72 rounded-full bg-pastel-pink/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-pastel-lavender/3 blur-3xl" />
      </div>

      <div className="varnika-container relative z-10">
        {/* Section Header */}
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700 ease-boutique",
            reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gold" />
            <span className="text-gold text-sm tracking-widest uppercase font-body">Curated Collections</span>
            <Sparkles className="w-5 h-5 text-gold" />
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground mb-4">
            Shop by Occasion
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto font-body text-lg">
            Thoughtfully curated for every special moment
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {occasions.map((occasion, index) => (
            <div
              key={occasion.title}
              className={cn(
                "group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-boutique",
                "shadow-lg hover:shadow-[0_20px_40px_rgba(212,175,55,0.15)] hover:-translate-y-2",
                "inline-block",
                reveal.isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              )}
              style={{
                transitionDelay: reveal.isVisible ? `${index * 100}ms` : "0ms",
              }}
            >
              {/* Image Background */}
              <img
                src={occasion.image}
                alt={occasion.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/70" />

              {/* Glass Effect Badge (top-right) */}
              <div className="absolute top-4 right-4 z-10 backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-3 py-1.5 transition-all duration-300 group-hover:bg-white/20">
                <span className="text-xs font-semibold text-white/90">Trending</span>
              </div>

              {/* Content - Bottom Left */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transition-all duration-300">
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-1 transition-transform duration-300 group-hover:translate-y-1">
                  {occasion.title}
                </h3>
                <p className="text-white/80 text-sm md:text-base font-body transition-all duration-300 group-hover:text-white/90">
                  {occasion.subtitle}
                </p>
              </div>

              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-t from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByOccasion;
