import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useAnimations";
import SparkleParticles from "@/components/effects/SparkleParticles";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  image: string;
  artworkPurchased: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Delhi",
    quote: "The 'Whispers of Dawn' painting has transformed our living room into a sanctuary. Every morning, I find myself lost in its colors. It's not just art—it's become a member of our family.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    artworkPurchased: "Whispers of Dawn",
  },
  {
    id: "2",
    name: "Rajesh Menon",
    location: "Mumbai",
    quote: "I've collected art for 20 years, but Varnika's curation is unparalleled. The attention to the artist's story, the quality of craftsmanship—it's a gallery experience delivered to your doorstep.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    artworkPurchased: "Terra Vessels Collection",
  },
  {
    id: "3",
    name: "Ananya Krishnan",
    location: "Bangalore",
    quote: "The custom piece they created for our anniversary exceeded every expectation. Working directly with the artisan was magical—we now have art that tells our love story.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    artworkPurchased: "Custom Commission",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionReveal = useScrollReveal<HTMLElement>();

  // Auto-advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section
      ref={sectionReveal.ref}
      className="py-24 bg-espresso text-cream overflow-hidden relative"
    >
      {/* Sparkle effects */}
      <SparkleParticles count={12} />

      <div className="varnika-container relative z-10">
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700",
            sectionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-gold text-sm tracking-[0.3em] uppercase font-body">
            Collector's Words
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-cream mt-4">
            Stories From Our Patrons
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Quote Icon */}
          <Quote className="absolute -top-8 left-0 w-16 h-16 text-gold/20 animate-sparkle-pulse" />

          {/* Testimonials */}
          <div className="relative min-h-[300px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  "absolute inset-0 flex flex-col items-center text-center transition-all duration-700 ease-smooth",
                  index === currentIndex
                    ? "opacity-100 translate-x-0 scale-100 pointer-events-auto"
                    : index < currentIndex
                    ? "opacity-0 -translate-x-20 scale-95 pointer-events-none"
                    : "opacity-0 translate-x-20 scale-95 pointer-events-none"
                )}
              >
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold mb-6 floating-shadow">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Quote */}
                <blockquote className="font-display text-xl md:text-2xl lg:text-3xl leading-relaxed text-cream/90 italic mb-8 max-w-3xl">
                  "{testimonial.quote}"
                </blockquote>

                {/* Attribution */}
                <div>
                  <p className="font-display text-lg text-gold">
                    {testimonial.name}
                  </p>
                  <p className="text-cream/60 text-sm font-body mt-1">
                    {testimonial.location} • Acquired "{testimonial.artworkPurchased}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              className="text-cream/60 hover:text-cream hover:bg-cream/10 interactive-element"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-500",
                    index === currentIndex
                      ? "bg-gold w-10"
                      : "w-2 bg-cream/30 hover:bg-cream/50"
                  )}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="text-cream/60 hover:text-cream hover:bg-cream/10 interactive-element"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;