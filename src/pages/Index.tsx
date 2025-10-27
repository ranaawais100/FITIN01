import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CollectionBanner from "@/components/CollectionBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import PromotionalBanners from "@/components/PromotionalBanners";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { getFeaturedProducts, Product } from "@/lib/firebaseService";
import ProductCard from "@/components/ProductCard";

const FeaturedProductsSection = ({ title, featuredType }: { title: string, featuredType: 'best-selling' | 'trending-now' }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getFeaturedProducts(featuredType);
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, [featuredType]);

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">{title}</h2>
        </div>

        <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-6">
          <div className="flex gap-4 md:gap-8">
            {products.map((product) => (
              <div key={product.id} className="flex-none w-[45%] sm:w-[280px] md:w-[320px] snap-start">
                <ProductCard
                  name={product.name}
                  price={product.price}
                  image={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
                  description={product.description}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <FeaturedProductsSection title="Best Selling" featuredType="best-selling" />
        <FeaturedProductsSection title="Trending Now" featuredType="trending-now" />
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
