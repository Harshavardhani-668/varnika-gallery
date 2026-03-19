import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import ShopByOccasion from "@/components/home/ShopByOccasion";
import BestSellers from "@/components/home/BestSellers";
import HowItWorks from "@/components/home/HowItWorks";
import GalleryGrid from "@/components/home/GalleryGrid";
import StoryBanner from "@/components/home/StoryBanner";
import WhyVarnika from "@/components/home/WhyVarnika";
import Testimonials from "@/components/home/Testimonials";
import FinalCTA from "@/components/home/FinalCTA";
import Newsletter from "@/components/home/Newsletter";
import WhatsAppButton from "@/components/WhatsAppButton";
import EmojiFlow from "@/components/effects/EmojiFlow";

const Index = () => {
  const [emojiEnabled, setEmojiEnabled] = useState(true);

  return (
    <div className="min-h-screen relative">
      <EmojiFlow enabled={emojiEnabled} />
      <Header />
      <main>
        <HeroSection />
        <TrustStrip />
        <ShopByOccasion />
        <BestSellers />
        <HowItWorks />
        <GalleryGrid />
        <StoryBanner />
        <WhyVarnika />
        <Testimonials />
        <FinalCTA />
        <Newsletter />
      </main>
      <Footer />
      <WhatsAppButton />
      {/* Emoji toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setEmojiEnabled((p) => !p);
        }}
        className="fixed bottom-6 right-6 z-[60] w-10 h-10 rounded-full bg-card shadow-elevated flex items-center justify-center text-lg hover:scale-110 transition-transform border border-border"
        aria-label="Toggle emoji effects"
        title={emojiEnabled ? "Disable emoji effects" : "Enable emoji effects"}
      >
        {emojiEnabled ? "🎁" : "💤"}
      </button>
    </div>
  );
};

export default Index;
