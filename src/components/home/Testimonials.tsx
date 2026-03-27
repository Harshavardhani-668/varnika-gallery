import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useAnimations";
import OptimizedImage from "@/components/ui/optimized-image";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  quote: string;
  image: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    location: "Delhi",
    quote: "The gift I received from Varnika was breathtaking. You could feel the love in every detail. It wasn't just a present — it was a memory I'll treasure forever.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    rating: 5,
  },
  {
    id: "2",
    name: "Rajesh Menon",
    location: "Mumbai",
    quote: "I've never seen such attention to detail. Varnika turned my simple idea into something extraordinary. The personalization made all the difference.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    rating: 5,
  },
  {
    id: "3",
    name: "Ananya Krishnan",
    location: "Bangalore",
    quote: "The custom piece they created for our anniversary exceeded every expectation. Working with them was magical — we now have a gift that tells our love story.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    rating: 5,
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionReveal = useScrollReveal<HTMLElement>();
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Only check for prefers-reduced-motion, allow animations on mobile
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section
      id="reviews"
      ref={sectionReveal.ref}
      className="py-24 bg-foreground text-primary-foreground overflow-hidden relative"
    >
      <div className="varnika-container relative z-10">
        <div
          className={cn(
            "text-center mb-16 transition-all duration-700 ease-boutique",
            sectionReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-gold text-sm tracking-widest uppercase font-body">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl text-primary-foreground mt-4 mb-2">
            Loved by Our Customers
          </h2>
          <p className="text-primary-foreground/60 font-body">
            Real stories from hearts we've touched.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <Quote className="absolute -top-6 left-0 w-12 h-12 text-gold/15" />

          <div className="relative min-h-[280px]">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  "absolute inset-0 flex flex-col items-center text-center transition-all duration-700 ease-boutique",
                  index === currentIndex
                    ? "opacity-100 translate-x-0 pointer-events-auto"
                    : index < currentIndex
                    ? "opacity-0 -translate-x-16 pointer-events-none"
                    : "opacity-0 translate-x-16 pointer-events-none"
                )}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gold/40 mb-6">
                  <OptimizedImage
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                    optimizeWidth={200}
                    optimizeHeight={200}
                    quality={68}
                  />
                </div>

                <blockquote className="font-display text-xl md:text-2xl leading-relaxed text-primary-foreground/90 italic mb-8 max-w-2xl">
                  "{testimonial.quote}"
                </blockquote>

                <div className="flex items-center gap-1 mb-4" aria-label={`${testimonial.rating} star review`}>
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star key={starIndex} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                <div>
                  <p className="font-display text-lg text-gold">
                    {testimonial.name}
                  </p>
                  <p className="text-primary-foreground/50 text-sm font-body mt-1">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={prev}
              aria-label="Show previous testimonial"
              className="text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    index === currentIndex
                      ? "bg-gold w-8"
                      : "w-1.5 bg-primary-foreground/20 hover:bg-primary-foreground/40"
                  )}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              aria-label="Show next testimonial"
              className="text-primary-foreground/50 hover:text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
