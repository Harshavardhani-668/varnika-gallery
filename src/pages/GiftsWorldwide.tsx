import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FloatingClouds from "@/components/effects/FloatingClouds";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Globe, ShieldCheck, Package } from "lucide-react";

const GiftsWorldwide = () => {
  usePageMeta({
    title: "Worldwide Handmade Gifts | Personalized Artisan Gifts | Varnika",
    description:
      "Discover globally inspired handmade gifts from Varnika. Shop personalized artisan gifts and custom hampers for international gifting occasions.",
    keywords:
      "handmade gifts worldwide, personalized gifts global, artisan gifts international, custom hampers global delivery"
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-32 pb-14 overflow-hidden">
        <FloatingClouds count={3} />
        <div className="varnika-container relative z-10 text-center">
          <span className="text-gold text-sm tracking-widest uppercase font-body">Global Audience</span>
          <h1 className="font-display text-4xl md:text-6xl text-foreground mt-4 mb-4">
            Handmade Gifts for a Global Community
          </h1>
          <p className="text-muted-foreground font-body max-w-2xl mx-auto">
            Thoughtful, artisan-crafted gifts designed in India for modern celebrations worldwide.
          </p>
        </div>
      </section>

      <main className="pb-20">
        <div className="varnika-container max-w-5xl grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <Globe className="w-6 h-6 text-gold mb-3" />
            <h2 className="font-display text-2xl text-foreground mb-2">Global Gifting</h2>
            <p className="font-body text-muted-foreground">
              International-friendly gifting concepts for modern lifestyles.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <ShieldCheck className="w-6 h-6 text-gold mb-3" />
            <h2 className="font-display text-2xl text-foreground mb-2">Secure Payments</h2>
            <p className="font-body text-muted-foreground">
              Trusted checkout and protected transactions for confident shopping.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <Package className="w-6 h-6 text-gold mb-3" />
            <h2 className="font-display text-2xl text-foreground mb-2">Careful Packaging</h2>
            <p className="font-body text-muted-foreground">
              Handmade quality preserved with secure, gift-ready packaging.
            </p>
          </div>
        </div>

        <div className="varnika-container text-center mt-10">
          <Button asChild className="rounded-full">
            <Link to="/gallery">View Artisan Gallery</Link>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GiftsWorldwide;
