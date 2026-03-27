import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";

const FinalCTA = () => {
  const reveal = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={reveal.ref}
      className="relative py-24 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-foreground via-espresso-light to-foreground" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-10 right-20 w-72 h-72 rounded-full bg-pastel-pink/5 blur-3xl" />
      </div>

      <div className="varnika-container relative z-10">
        <div
          className={cn(
            "max-w-2xl mx-auto text-center transition-all duration-700 ease-boutique",
            reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-6 leading-tight">
            Create a Personalised Gift Today
          </h2>
          <p className="font-body text-primary-foreground/70 text-lg mb-10 max-w-lg mx-auto">
            Turn your favourite photos and memories into handcrafted art pieces that last a lifetime.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="reserve" size="xl" className="group w-full sm:w-auto min-w-0 sm:min-w-[220px]" asChild>
              <Link to="/collections" className="w-full sm:w-auto">
                Start Custom Order
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          <p className="font-body text-primary-foreground/40 text-sm mt-8">
            Our artist will contact you before production begins.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
