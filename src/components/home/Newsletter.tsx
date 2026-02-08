import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useScrollReveal } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";
import SparkleParticles from "@/components/effects/SparkleParticles";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const sectionReveal = useScrollReveal<HTMLElement>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setEmail("");
    toast.success("Welcome to the Varnika family!", {
      description: "You'll receive our curated art stories soon.",
    });
  };

  return (
    <section
      ref={sectionReveal.ref}
      className="py-24 bg-cream relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-terracotta blur-3xl" />
      </div>
      
      <SparkleParticles count={10} />

      <div className="varnika-container relative z-10">
        <div
          className={cn(
            "max-w-2xl mx-auto text-center transition-all duration-700",
            sectionReveal.isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          )}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-6 glow-hover">
            <Sparkles className="w-4 h-4 text-gold animate-sparkle-pulse" />
            <span className="text-sm text-gold font-body tracking-wide">
              Join 5,000+ Art Lovers
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl text-espresso mb-6">
            Stories, Not Just Sales
          </h2>
          
          <p className="text-muted-foreground font-body text-lg mb-10 max-w-lg mx-auto">
            Receive curated stories of artisans, behind-the-scenes glimpses, and 
            exclusive first access to new collections. Art appreciation, not spam.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 px-6 bg-card border-border focus:border-gold focus:ring-gold/20 font-body"
              required
            />
            <Button
              type="submit"
              variant="artisan"
              size="lg"
              disabled={isLoading}
              className="h-14 px-8 shrink-0 group interactive-element"
            >
              {isLoading ? (
                "Joining..."
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground font-body mt-6">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;