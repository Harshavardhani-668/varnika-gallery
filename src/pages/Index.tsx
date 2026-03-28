import { lazy, Suspense, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import EmojiFlow from "@/components/effects/EmojiFlow";

const TrustStrip = lazy(() => import("@/components/home/TrustStrip"));
const ShopByOccasion = lazy(() => import("@/components/home/ShopByOccasion"));
const HowItWorks = lazy(() => import("@/components/home/HowItWorks"));
const GalleryGrid = lazy(() => import("@/components/home/GalleryGrid"));
const Testimonials = lazy(() => import("@/components/home/Testimonials"));
const InstagramSection = lazy(() => import("@/components/home/InstagramSection"));
const FinalCTA = lazy(() => import("@/components/home/FinalCTA"));
const Newsletter = lazy(() => import("@/components/home/Newsletter"));

const Index = () => {
  const [emojiEnabled, setEmojiEnabled] = useState(true);

  return (
    <div className="min-h-screen relative">
      <EmojiFlow enabled={emojiEnabled} />
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={<div className="py-16" />}>
          <TrustStrip />
          <ShopByOccasion />
          <HowItWorks />
          <GalleryGrid />
          <Testimonials />
          <InstagramSection />
          <FinalCTA />
          <Newsletter />
        </Suspense>
      </main>
      <Footer />
      {/* Emoji toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setEmojiEnabled((p) => !p);
        }}
        className="fixed bottom-6 right-6 z-[60] w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-card shadow-elevated flex items-center justify-center text-lg hover:scale-110 transition-transform border border-border"
        aria-label="Toggle emoji effects"
        title={emojiEnabled ? "Disable emoji effects" : "Enable emoji effects"}
      >
        {emojiEnabled ? "🎁" : "💤"}
      </button>
    </div>
  );
};

export default Index;
