import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Sparkles, Heart, Palette, Gem, Star, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const features = [
    {
      icon: Heart,
      title: "100% Handmade",
      description: "Every piece is crafted by human hands with love, not machines. You get authentic artistry with soul.",
      badge: "Unique & Authentic"
    },
    {
      icon: Sparkles,
      title: "Personal Touch",
      description: "We customize every order to your heart's desire. Your vision becomes our beautiful reality.",
      badge: "Made Just For You"
    },
    {
      icon: Palette,
      title: "Unique Designs",
      description: "No two pieces are identical. You'll never find these designs anywhere else in the world.",
      badge: "One-of-a-Kind"
    },
    {
      icon: Gem,
      title: "Affordable Luxury",
      description: "Premium quality at friendship prices. Luxury shouldn't break the bank!",
      badge: "Best Value"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="varnika-container max-w-4xl mx-auto text-center">
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-espresso mb-6 animate-fade-in">
            Welcome to Varnika Handmade Gifts
          </h1>
          <p className="text-2xl md:text-3xl text-mocha font-light mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Crafted with thought, gifted with heart.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            At Varnika, we bring a touch of love, creativity, and calm to every handmade piece. 
            Each creation tells a story — of joy, art, and heartfelt gifting.
          </p>
          <div className="flex items-center justify-center gap-3 text-pastel-pink mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Heart className="w-6 h-6 fill-current" />
            <p className="text-lg font-medium">Explore our pastel universe of handmade beauty!</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base text-espresso animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <span className="font-medium">Handcrafted</span>
            <span className="text-pastel-lavender">•</span>
            <span className="font-medium">Customizable</span>
            <span className="text-pastel-lavender">•</span>
            <span className="font-medium">Made with love</span>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="varnika-container max-w-4xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-espresso text-center mb-12">
            Our Story
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Varnika began as a dream between friends who loved to create — one thread, 
              brushstroke, and sparkle at a time. Every product we make is handmade with 
              patience, joy, and soul.
            </p>
            <p>
              We believe gifts should feel personal — crafted with care, not mass-produced. 
              From delicate embroidery to resin sparkles and painted cards, each piece is a 
              reflection of our love for art and handmade stories.
            </p>
            <div className="flex items-center justify-center gap-3 pt-6 text-pastel-pink">
              <Sparkles className="w-6 h-6" />
              <p className="text-xl font-medium">
                Because every gift should carry a little piece of heart.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Varnika Section */}
      <section className="py-20 px-4">
        <div className="varnika-container max-w-6xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-espresso text-center mb-6">
            Why Choose Varnika?
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-16">
            <Star className="w-5 h-5 inline-block text-pastel-peach mr-2" />
            Join thousands of happy customers who chose handmade happiness!
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-md transition-all duration-300 border border-pastel-lavender/20 group"
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
                    <div className="flex items-center gap-2 text-sm text-pastel-pink font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{feature.badge}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/collections">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-pastel-pink to-pastel-lavender hover:opacity-90 text-white font-medium px-8 py-6 text-lg rounded-full shadow-soft hover:shadow-md transition-all duration-300"
              >
                Explore more handmade designs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Design Gallery CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-pastel-pink/10 via-pastel-lavender/10 to-pastel-peach/10">
        <div className="varnika-container max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl text-espresso mb-6">
            ✨ Our Design Gallery
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
            Every piece tells a unique story! Browse through our collection of one-of-a-kind 
            handmade treasures. Each design is crafted with love and will never be repeated - 
            making your gift truly special! 🎨💕
          </p>
          <Link to="/collections">
            <Button 
              size="lg"
              variant="outline"
              className="border-2 border-pastel-pink text-pastel-pink hover:bg-pastel-pink hover:text-white font-medium px-8 py-6 text-lg rounded-full transition-all duration-300"
            >
              View Gallery
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
