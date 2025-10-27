import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CollectionBanner from "@/components/CollectionBanner";
import TestimonialsSection from "@/components/TestimonialsSection";
import PromotionalBanners from "@/components/PromotionalBanners";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState, useRef } from "react";
import { getAllProducts, Product } from "@/lib/firebaseService";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductCarouselRow = ({ products }: { products: Product[] }) => {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer.current) {
      const { clientWidth } = scrollContainer.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollContainer.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <div
        ref={scrollContainer}
        className="flex gap-4 md:gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth py-4"
      >
        {products.map(product => (
          <div key={product.id} className="flex-none w-[80vw] sm:w-[45vw] md:w-[30vw] lg:w-[23vw] xl:w-[20vw] snap-center">
            <ProductCard
              name={product.name}
              price={product.price}
              image={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
              description={product.description}
            />
          </div>
        ))}
      </div>
      <div className="hidden lg:block">
        <button
          onClick={() => scroll('left')}
          className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-background/80 backdrop-blur-sm text-foreground p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};


const AllProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts);
    };
    fetchProducts();
  }, []);

  const productRows = useMemo(() => {
    if (products.length === 0) return [];
    const rows: Product[][] = [[], [], []];
    products.forEach((product, index) => {
      rows[index % 3].push(product);
    });
    return rows.filter(row => row.length > 0);
  }, [products]);

  return (
    <div className="py-16 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">Shop Our Collection</h2>
            <Link to="/shop-all" className="text-primary font-semibold hover:underline flex items-center gap-2">
                View All
                <ChevronRight className="h-4 w-4" />
            </Link>
        </div>
        <div className="space-y-8">
          {productRows.map((row, rowIndex) => (
            <ProductCarouselRow key={rowIndex} products={row} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <AllProductsSection />
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
