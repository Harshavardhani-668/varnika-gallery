import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Sparkles, HandHeart, Palette, Gem, Brush, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FloatingClouds from "@/components/effects/FloatingClouds";
import OptimizedImage from "@/components/ui/optimized-image";
import { cn } from "@/lib/utils";
import { useScrollReveal } from "@/hooks/useAnimations";
import { useProducts } from "@/hooks/useProducts";

const About = () => {
  const { data: products } = useProducts();
  const heroReveal = useScrollReveal<HTMLElement>({ threshold: 0.2 });
  const storyReveal = useScrollReveal<HTMLElement>({ threshold: 0.2 });
  const handmadeReveal = useScrollReveal<HTMLElement>({ threshold: 0.2 });
  const specialReveal = useScrollReveal<HTMLElement>({ threshold: 0.15 });
  const galleryReveal = useScrollReveal<HTMLElement>({ threshold: 0.15 });
  const peopleReveal = useScrollReveal<HTMLElement>({ threshold: 0.15 });
  const ctaReveal = useScrollReveal<HTMLElement>({ threshold: 0.2 });

  const features = [
    {
      icon: HandHeart,
      title: "100% Handmade",
      description: "Crafted by real hands with care and attention.",
    },
    {
      icon: Brush,
      title: "One-of-a-Kind Designs",
      description: "Every piece is unique - no duplicates.",
    },
    {
      icon: Palette,
      title: "Made Just for You",
      description: "Customised to your story and preferences.",
    },
    {
      icon: Gem,
      title: "Affordable Luxury",
      description: "Premium feel without premium pricing.",
    },
  ];

  const uniqueShopImages = Array.from(
    new Set((products ?? []).map((product) => product.imageUrl).filter(Boolean))
  );

  const fallbackGalleryImages = [
    "https://images.unsplash.com/photo-1513151233558-d860c5398176",
    "https://images.unsplash.com/photo-1518199266791-5375a83190b7",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94",
    "https://images.unsplash.com/photo-1452860606245-08befc0ff44b",
    "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4",
    "https://images.unsplash.com/photo-1616046229478-9901c5536a45",
    "https://images.unsplash.com/photo-1464349153735-7db50ed83c84",
    "https://images.unsplash.com/photo-1478144592103-25e218a04891",
  ];

  const galleryImagesBase = Array.from(
    new Set([...uniqueShopImages, ...fallbackGalleryImages])
  ).slice(0, 8);

  const galleryImages = galleryImagesBase.map((img, index) =>
    index === 3
      ? "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b"
      : img
  );

  const processImages = [
    {
      src: "https://images.unsplash.com/photo-1513151233558-d860c5398176",
      caption: "From sketch to final details, each piece is crafted with intention.",
    },
    {
      src: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b",
      caption: "Color, texture, and finishing are carefully balanced by hand.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white overflow-hidden">
      <Header />

      {/* Section 1 - Hero */}
      <section ref={heroReveal.ref} className="relative pt-28 md:pt-32 pb-20 md:pb-24 px-4">
        <FloatingClouds count={3} />

        <div className="absolute inset-0">
          <OptimizedImage
            src="https://images.unsplash.com/photo-1513885535751-8b9238bd345a"
            alt="Premium handmade gift setup"
            className="w-full h-full object-cover"
            containerClassName="w-full h-full"
            optimizeWidth={1920}
            optimizeHeight={1080}
            quality={72}
            eager
          />
          <div className="absolute inset-0 bg-gradient-to-br from-cream/85 via-cream/78 to-pastel-pink/42" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-background/15 to-transparent" />
        </div>

        <div className="varnika-container relative z-10 max-w-4xl mx-auto text-center">
          <h1
            className={cn(
              "font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-espresso mb-6 transition-all duration-700 ease-boutique",
              heroReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            )}
          >
            Crafted with Thought, Gifted with Heart 💝
          </h1>
          <p
            className={cn(
              "text-lg md:text-2xl text-mocha/90 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ease-boutique",
              heroReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "120ms" }}
          >
            We turn your memories into handmade stories - filled with meaning, creativity, and emotion.
          </p>
        </div>
      </section>

      {/* Section 2 - Our Story */}
      <section ref={storyReveal.ref} className="py-20 md:py-24 px-4 bg-white/60 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-12 right-12 w-72 h-72 rounded-full bg-pastel-pink/10 blur-3xl" />
        </div>

        <div className="varnika-container max-w-6xl mx-auto relative z-10">
          <h2 className="font-display text-4xl md:text-5xl text-espresso text-center mb-12 md:mb-14">
            Our Story
          </h2>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div
              className={cn(
                "relative order-2 lg:order-1 transition-all duration-700 ease-boutique lg:max-w-[540px] w-full",
                storyReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
            >
              <div className="relative aspect-[5/6] rounded-3xl overflow-hidden shadow-soft border border-pastel-lavender/20 bg-cream">
                <OptimizedImage
                  src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b"
                  alt="Handmade creation process with tools and materials"
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                  optimizeWidth={900}
                  optimizeHeight={1120}
                  quality={72}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/15 via-transparent to-transparent" />
              </div>
            </div>

            <div
              className={cn(
                "space-y-7 text-lg md:text-xl text-muted-foreground leading-relaxed order-1 lg:order-2 transition-all duration-700 ease-boutique",
                storyReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}
              style={{ transitionDelay: "120ms" }}
            >
              <p>
                Varnika began as a simple dream between friends -
                a shared love for creating something meaningful by hand.
              </p>
              <p>
                What started with threads, colors, and creativity
                slowly grew into a space where every gift carries emotion.
              </p>
              <div className="pt-1">
                <p className="text-foreground text-2xl md:text-3xl font-display leading-relaxed">
                  Each piece we create is not just a product -
                  it&apos;s a story waiting to be gifted.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-1 text-pastel-pink">
                <Sparkles className="w-6 h-6" />
                <p className="text-base md:text-lg font-medium text-espresso/85">
                  Thoughtful design, carefully crafted details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 - Why Handmade Matters */}
      <section ref={handmadeReveal.ref} className="py-20 md:py-24 px-4 bg-cream/70">
        <div className="varnika-container max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl text-espresso mb-8">
            Why Handmade Matters
          </h2>
          <p className="font-body text-lg md:text-2xl text-mocha leading-relaxed whitespace-pre-line">
            {"In a world full of mass production,\nwe choose to slow down.\n\nTo create something personal.\nSomething that feels truly yours.\n\nBecause the best gifts aren't just bought -\nthey are felt."}
          </p>
        </div>
      </section>

      {/* Section 4 - What Makes Us Special */}
      <section ref={specialReveal.ref} className="py-20 md:py-24 px-4 bg-white">
        <div className="varnika-container max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-espresso text-center mb-6">
            What Makes Us Special
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-14 md:mb-16 max-w-2xl mx-auto">
            Designed to feel premium, personal, and warm.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className={cn(
                  "bg-white rounded-2xl p-8 shadow-soft hover:shadow-md transition-all duration-500 border border-pastel-lavender/20 group hover:-translate-y-1",
                  specialReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 90}ms` }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pastel-pink to-pastel-lavender flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-espresso mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-3">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5 - Design Gallery */}
      <section ref={galleryReveal.ref} className="py-20 md:py-24 px-4 bg-gradient-to-br from-pastel-pink/10 via-cream to-pastel-lavender/10">
        <div className="varnika-container max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-espresso text-center mb-5">
            Our Handmade Creations ✨
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12 md:mb-14 max-w-2xl mx-auto">
            Every piece tells a story - and no story is ever repeated.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {galleryImages.map((img, index) => (
              <div
                key={`${img}-${index}`}
                className={cn(
                  "group relative aspect-square rounded-2xl overflow-hidden bg-cream border border-white/60 shadow-soft",
                  galleryReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                <OptimizedImage
                  src={img}
                  alt={`Varnika design ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  containerClassName="w-full h-full"
                  optimizeWidth={800}
                  optimizeHeight={800}
                  quality={70}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6 - Brand Personal Touch */}
      <section ref={peopleReveal.ref} className="py-20 md:py-24 px-4 bg-white relative">
        <div className="absolute inset-0 pointer-events-none">
          <FloatingClouds count={2} />
        </div>

        <div className="varnika-container max-w-6xl mx-auto relative z-10">
          <h2 className="font-display text-4xl md:text-5xl text-espresso text-center mb-5">
            Made with Love, by Real People
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Behind every order is a team that cares deeply about craft, quality, and your moments.
          </p>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {processImages.map((image, index) => (
              <figure
                key={image.src}
                className={cn(
                  "rounded-3xl overflow-hidden shadow-soft border border-pastel-lavender/20 bg-card",
                  peopleReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${index * 110}ms` }}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <OptimizedImage
                    src={image.src}
                    alt={image.caption}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                    optimizeWidth={1000}
                    optimizeHeight={700}
                    quality={72}
                  />
                </div>
                <figcaption className="px-5 py-4 text-sm md:text-base text-muted-foreground font-body leading-relaxed flex items-start gap-2">
                  <Camera className="w-4 h-4 mt-0.5 text-gold flex-shrink-0" />
                  <span>{image.caption}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7 - Final CTA */}
      <section ref={ctaReveal.ref} className="py-20 md:py-24 px-4 bg-gradient-to-r from-foreground to-espresso-light">
        <div className="varnika-container max-w-4xl mx-auto text-center">
          <h2
            className={cn(
              "font-display text-4xl md:text-5xl text-primary-foreground mb-6 transition-all duration-700 ease-boutique",
              ctaReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Let&apos;s Create Something Beautiful Together ✨
          </h2>
          <p
            className={cn(
              "text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto transition-all duration-700 ease-boutique",
              ctaReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "100ms" }}
          >
            Turn your memories into meaningful handmade gifts.
          </p>

          <div
            className={cn(
              "transition-all duration-700 ease-boutique",
              ctaReveal.isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            <Button
              size="lg"
              asChild
              className="bg-gradient-to-r from-pastel-pink to-pastel-lavender hover:opacity-90 text-white font-medium px-8 py-6 text-lg rounded-full shadow-soft hover:shadow-md transition-all duration-300"
            >
              <Link to="/collections">Explore Designs</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
