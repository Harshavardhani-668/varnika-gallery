import { Heart, Palette, Truck, Star } from "lucide-react";
import { useScrollReveal } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";

const trustItems = [
  { icon: Heart, label: "Handmade with Love", sub: "Every piece crafted by hand" },
  { icon: Palette, label: "Customisable", sub: "Make it truly yours" },
  { icon: Truck, label: "Safe Delivery", sub: "Careful packaging guaranteed" },
  { icon: Star, label: "5-Star Reviews", sub: "Loved by 2,000+ customers" },
];

const TrustStrip = () => {
  const reveal = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={reveal.ref}
      className="py-10 bg-card border-y border-border"
    >
      <div className="varnika-container">
        <div
          className={cn(
            "grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 transition-all duration-700 ease-boutique",
            reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}
        >
          {trustItems.map((item, i) => (
            <div
              key={item.label}
              className="flex flex-col items-center text-center gap-2"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mb-1">
                <item.icon className="w-5 h-5 text-gold" />
              </div>
              <p className="font-body text-sm font-medium text-foreground">{item.label}</p>
              <p className="font-body text-xs text-muted-foreground">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustStrip;
