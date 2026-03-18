import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import GalleryGrid from "@/components/home/GalleryGrid";
import StoryBanner from "@/components/home/StoryBanner";
import WhyVarnika from "@/components/home/WhyVarnika";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import EmojiFlow from "@/components/effects/EmojiFlow";

const Index = () => {
  const [emojiEnabled, setEmojiEnabled] = useState(true);

  return (
    <div className="min-h-screen relative">
      <EmojiFlow enabled={emojiEnabled} />
      <Header />
      <main>
        <HeroSection />
        <GalleryGrid />
        <StoryBanner />
        <WhyVarnika />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
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
