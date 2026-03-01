import { Heart, Sparkles, Award } from "lucide-react";
import { useScrollReveal } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";

const reasons = [
  {
    icon: Heart,
    title: "Handcrafted with Heart",
    description: "Each piece is individually created, never mass produced.",
  },
  {
    icon: Sparkles,
    title: "Made Just for You",
    description: "Personalization that makes every gift meaningful.",
  },
  {
    icon: Award,
    title: "Premium Finishing",
    description: "Elegant presentation designed to impress.",
  },
];

const WhyVarnika = () => {
  const sectionReveal = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionReveal.ref}
      className="py-24 bg-cream-dark relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-pastel-pink/5 blur-3xl" />
      </div>

      <div className="varnika-container relative z-10">
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700 ease-boutique",
            sectionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-gold text-sm tracking-widest uppercase font-body">
            Our Promise
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-4">
            Why Choose Varnika?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className={cn(
                "bg-card rounded-card p-8 text-center card-lift transition-all duration-700 ease-boutique",
                sectionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              )}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                <reason.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-display text-xl text-foreground mb-3">
                {reason.title}
              </h3>
              <p className="font-body text-muted-foreground text-sm leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyVarnika;
