import { useScrollReveal } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";
import OptimizedImage from "@/components/ui/optimized-image";

const StoryBanner = () => {
  const imageReveal = useScrollReveal<HTMLDivElement>();
  const contentReveal = useScrollReveal<HTMLDivElement>();

  return (
    <section className="py-24 bg-cream-dark overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-gold/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-pastel-pink/3 blur-3xl" />
      </div>

      <div className="varnika-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <div
            ref={imageReveal.ref}
            className={cn(
              "relative transition-all duration-1000 ease-boutique",
              imageReveal.isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            )}
          >
            <div className="relative aspect-[4/5] rounded-card overflow-hidden floating-shadow">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=1000&fit=crop"
                alt="Varnika crafting journey"
                className="w-full h-full object-cover transition-transform duration-700 ease-boutique hover:scale-[1.03]"
                containerClassName="w-full h-full"
                optimizeWidth={900}
                optimizeHeight={1100}
                quality={70}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </div>
            
            {/* Decorative border */}
            <div className="absolute -top-3 -left-3 w-20 h-20 border-2 border-gold/20 rounded-card -z-10" />
          </div>

          {/* Content Side */}
          <div
            ref={contentReveal.ref}
            className={cn(
              "lg:pl-8 transition-all duration-1000 ease-boutique",
              contentReveal.isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <span className="text-gold text-sm tracking-widest uppercase font-body">
              Our Story
            </span>
            
            <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-8 leading-[1.1]">
              Our Crafting Journey
            </h2>

            <div className="space-y-5 text-muted-foreground font-body leading-relaxed text-base">
              <p>
                Varnika was born from a simple belief — that gifts should feel personal, not purchased.
              </p>
              <p>
                Each creation begins with emotion, is shaped by careful hands, and finished with thoughtful detail.
              </p>
              <p>
                From selecting materials to elegant packaging, every piece carries warmth, care, and intention.
              </p>
              <p className="italic text-gold/80">
                Because the most beautiful gifts are the ones that speak without words.
              </p>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-border">
              {[
                { label: "Handmade with precision" },
                { label: "Personalized with care" },
                { label: "Delivered with love" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-sm text-foreground font-body font-medium">{item.label}</p>
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
