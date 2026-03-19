import { Instagram } from "lucide-react";
import { useScrollReveal } from "@/hooks/useAnimations";
import { cn } from "@/lib/utils";
import OptimizedImage from "@/components/ui/optimized-image";

const posts = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&h=800&fit=crop&auto=format&q=80",
    alt: "Pastel handmade birthday gift setup",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&h=800&fit=crop&auto=format&q=80",
    alt: "Romantic handcrafted anniversary gift",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&h=800&fit=crop&auto=format&q=80",
    alt: "Graduation themed personalised gift",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=800&fit=crop&auto=format&q=80",
    alt: "Cute baby keepsake handmade decor",
  },
];

const instagramUrl = "https://www.instagram.com/varnika_atelier/";

const InstagramSection = () => {
  const reveal = useScrollReveal<HTMLElement>();

  return (
    <section ref={reveal.ref} className="py-20 bg-cream-dark/60">
      <div className="varnika-container">
        <div
          className={cn(
            "text-center mb-12 transition-all duration-700 ease-boutique",
            reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <span className="text-gold text-sm tracking-widest uppercase font-body">Instagram</span>
          <h2 className="font-display text-4xl md:text-5xl text-foreground mt-4 mb-3">
            Follow @varnika_atelier
          </h2>
          <p className="text-muted-foreground font-body max-w-xl mx-auto">
            A peek into our latest handmade creations and personalised gift stories.
          </p>
        </div>

        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          aria-label="Open Instagram profile @varnika_atelier"
        >
          {posts.map((post, index) => (
            <div
              key={post.id}
              className={cn(
                "group relative aspect-square rounded-2xl overflow-hidden border border-white/30 shadow-[0_10px_28px_rgba(0,0,0,0.08)] transition-all duration-500 ease-boutique hover:-translate-y-1",
                reveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <OptimizedImage
                src={post.image}
                alt={post.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                optimizeWidth={700}
                optimizeHeight={700}
                quality={70}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center">
                <Instagram className="w-4 h-4 text-foreground" />
              </div>
            </div>
          ))}
        </a>
      </div>
    </section>
  );
};

export default InstagramSection;
