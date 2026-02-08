import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";
import FloatingClouds from "@/components/effects/FloatingClouds";

const StoryBanner = () => {
  const imageReveal = useScrollReveal<HTMLDivElement>();
  const contentReveal = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-24 bg-cream-dark overflow-hidden relative pastel-clouds">
      <FloatingClouds count={3} />
      
      {/* Decorative bg blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-pastel-lavender/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-pastel-mint/5 blur-3xl" />
      </div>

      <div className="varnika-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div
            ref={imageReveal.ref}
            className={cn(
              "relative transition-all duration-1000",
              imageReveal.isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-12"
            )}
          >
            <div className="relative aspect-[4/5] rounded-sm overflow-hidden floating-shadow">
              <img
                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=1000&fit=crop"
                alt="Artisan at work"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/30 to-transparent" />
            </div>
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -right-6 lg:-right-12 bg-card p-6 shadow-elevated max-w-[280px] floating-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center animate-sparkle-pulse">
                  <span className="font-display text-xl text-gold">25+</span>
                </div>
                <div>
                  <p className="font-body text-sm text-muted-foreground">Years of</p>
                  <p className="font-display text-espresso">Craftsmanship</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground font-body">
                Every brushstroke, every chisel mark tells a story of dedication.
              </p>
            </div>

            {/* Decorative Element */}
            <div className="absolute -top-4 -left-4 w-24 h-24 border-2 border-gold/30 rounded-sm -z-10" />
          </div>

          {/* Content Side */}
          <div
            ref={contentReveal.ref}
            className={cn(
              "lg:pl-8 transition-all duration-1000 delay-200",
              contentReveal.isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-12"
            )}
          >
            <span className="text-gold text-sm tracking-[0.3em] uppercase font-body">
              Our Philosophy
            </span>
            
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-espresso mt-4 mb-8 leading-[1.1]">
              Art That Holds
              <br />
              <span className="text-gold italic">Your Stories</span>
            </h2>

            <div className="space-y-6 text-muted-foreground font-body leading-relaxed">
              <p>
                At Varnika, we believe that true art isn't just seen—it's felt. Each piece
                in our collection carries within it the heartbeat of its creator, the whispers
                of tradition, and an invitation to become part of your personal narrative.
              </p>
              <p>
                We work directly with master artisans across India, ensuring that ancient
                techniques are preserved while allowing creative expression to flourish.
                When you bring a Varnika piece into your home, you're not just acquiring
                art—you're becoming a patron of living tradition.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Button variant="artisan" size="lg" className="group interactive-element">
                Meet Our Artisans
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" className="interactive-element">
                Read Our Story
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-border">
              {[
                { value: "150+", label: "Artisans" },
                { value: "2000+", label: "Artworks" },
                { value: "50+", label: "Art Forms" },
              ].map((stat, i) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl text-gold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground font-body mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoryBanner;