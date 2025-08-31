import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";

const Index = () => {
  return (
    <>
      <SEO />
      <div className="min-h-screen">
        <Header />
        <main>
          <HeroSection />
          <FeaturesSection />
          <PricingSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
