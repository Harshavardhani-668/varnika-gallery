import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import GalleryGrid from "@/components/home/GalleryGrid";
import StoryBanner from "@/components/home/StoryBanner";
import WhyVarnika from "@/components/home/WhyVarnika";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";

const Index = () => {
  return (
    <div className="min-h-screen">
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
    </div>
  );
};

export default Index;
