import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FloatingClouds from "@/components/effects/FloatingClouds";
import { usePageMeta } from "@/hooks/usePageMeta";
import { MapPin, Gift, Sparkles } from "lucide-react";

const GiftsIndia = () => {
  usePageMeta({
    title: "Handmade Gifts India | Personalized Custom Gifts Online | Varnika",
    description:
      "Shop handmade gifts in India from Varnika. Discover personalized gifts, custom gift hampers, wedding favors, and artisan-crafted presents for every celebration.",
    keywords:
      "handmade gifts India, personalized gifts India, custom gifts online India, artisan gifts India, wedding favors India"
  });

  const cities = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune", "Kolkata"];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-32 pb-14 overflow-hidden">
        <FloatingClouds count={3} />
        <div className="varnika-container relative z-10 text-center">
          <span className="text-gold text-sm tracking-widest uppercase font-body">India Delivery</span>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mt-4 mb-4">
            Handmade Gifts in India
          </h1>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Personalized handmade gifts crafted with care, shipped across India for weddings,
            anniversaries, birthdays, and festive celebrations.
          </p>
        </div>
      </section>

      <main className="pb-20">
        <div className="varnika-container max-w-5xl space-y-10">
          <section className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <Gift className="w-6 h-6 text-gold mb-3" />
              <h2 className="font-display text-2xl text-foreground mb-2">Custom Gifts</h2>
              <p className="font-body text-muted-foreground">
                One-of-a-kind gifts with names, dates, and personal touches.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Sparkles className="w-6 h-6 text-gold mb-3" />
              <h2 className="font-display text-2xl text-foreground mb-2">Festive Hampers</h2>
              <p className="font-body text-muted-foreground">
                Curated Diwali, wedding, and celebration hampers made by artisans.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <MapPin className="w-6 h-6 text-gold mb-3" />
              <h2 className="font-display text-2xl text-foreground mb-2">Pan-India Shipping</h2>
              <p className="font-body text-muted-foreground">
                Secure delivery support across major Indian cities.
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="font-display text-3xl text-foreground mb-4">Popular Delivery Cities</h2>
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <span key={city} className="px-3 py-1.5 rounded-full bg-gold/10 text-foreground text-sm font-body">
                  {city}
                </span>
              ))}
            </div>
          </section>

          <div className="text-center">
            <Button asChild className="rounded-full">
              <Link to="/collections">Explore Handmade Collections</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GiftsIndia;
