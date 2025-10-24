import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import CollectionBanner from "@/components/CollectionBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import PromotionalBanners from "@/components/PromotionalBanners";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
  <Hero />
        <ProductsSection />
        <CollectionBanner />
        <TestimonialsSection />
        <PromotionalBanners />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
