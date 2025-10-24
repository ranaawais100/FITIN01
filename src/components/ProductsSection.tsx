import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { getAllProducts, type Product } from "@/lib/firebaseService";
import { Loader2 } from "lucide-react";
import product1 from "@/assets/Gemini_Generated_Image_k2tpopk2tpopk2tp copy.png";
import product2 from "@/assets/Gemini_Generated_Image_arg08xarg08xarg0.png";
import product3 from "@/assets/Gemini_Generated_Image_jgsml6jgsml6jgsm.png";
import product4 from "@/assets/Gemini_Generated_Image_k2tpopk2tpopk2tp.png";

// Sample/fallback products when Firebase is empty
const sampleProducts: Product[] = [
  { id: "sample-1", name: "Sweat Shirt", price: 4499.99, category: "Hoodies", sizes: ["S", "M", "L"], stock: 50, image: product1, description: "Stay cozy and stylish with our premium sweatshirt, crafted from soft, breathable fabric for all-day comfort. Designed with a modern fit and durable stitching, it's perfect for casual wear, workouts, or layering during chilly days. Available in multiple colors, this sweatshirt combines comfort, versatility, and timeless style — making it a must-have for every wardrobe." },
  { id: "sample-2", name: "China Tracksuit", price: 4200, category: "Track Pants", sizes: ["M", "L"], stock: 100, image: product2, description: "Elevate your everyday look with our premium tracksuit, designed for both comfort and performance. Made from soft, breathable fabric with a perfect balance of stretch, it offers a relaxed yet athletic fit. Whether you're hitting the gym, running errands, or lounging in style, this tracksuit keeps you comfortable and confident all day long. Available in multiple colors with sleek detailing for a modern touch." },
  { id: "sample-3", name: "Sweat Shirt", price: 3199.99, category: "Hoodies", sizes: ["M", "L", "XL"], stock: 75, image: product4, description: "Stay cozy and stylish with our premium sweatshirt, crafted from soft, breathable fabric for all-day comfort. Designed with a modern fit and durable stitching, it's perfect for casual wear, workouts, or layering during chilly days. Available in multiple colors, this sweatshirt combines comfort, versatility, and timeless style — making it a must-have for every wardrobe." },
  { id: "sample-4", name: "Tracksuit", price: 3200, category: "Track Pants", sizes: ["M", "L"], stock: 60, image: product3, description: "Elevate your everyday look with our premium tracksuit, designed for both comfort and performance. Made from soft, breathable fabric with a perfect balance of stretch, it offers a relaxed yet athletic fit. Whether you're hitting the gym, running errands, or lounging in style, this tracksuit keeps you comfortable and confident all day long. Available in multiple colors with sleek detailing for a modern touch." },
  { id: "sample-5", name: "Sweat Shirt", price: 1899.0, category: "Hoodies", sizes: ["S", "M", "L", "XL"], stock: 80, image: product4, description: "Stay cozy and stylish with our premium sweatshirt, crafted from soft, breathable fabric for all-day comfort. Designed with a modern fit and durable stitching, it's perfect for casual wear, workouts, or layering during chilly days. Available in multiple colors, this sweatshirt combines comfort, versatility, and timeless style — making it a must-have for every wardrobe." },
  { id: "sample-6", name: "Tracksuit", price: 3200, category: "Track Pants", sizes: ["S", "M", "L"], stock: 90, image: product2, description: "Elevate your everyday look with our premium tracksuit, designed for both comfort and performance. Made from soft, breathable fabric with a perfect balance of stretch, it offers a relaxed yet athletic fit. Whether you're hitting the gym, running errands, or lounging in style, this tracksuit keeps you comfortable and confident all day long. Available in multiple colors with sleek detailing for a modern touch." },
  { id: "sample-7", name: "Track Suit", price: 3200, category: "Track Pants", sizes: ["M", "L", "XL"], stock: 70, image: product3, description: "Elevate your everyday look with our premium tracksuit, designed for both comfort and performance. Made from soft, breathable fabric with a perfect balance of stretch, it offers a relaxed yet athletic fit. Whether you're hitting the gym, running errands, or lounging in style, this tracksuit keeps you comfortable and confident all day long. Available in multiple colors with sleek detailing for a modern touch." },
  { id: "sample-8", name: "Sweat Shirt", price: 3299.0, category: "Hoodies", sizes: ["S", "M", "L", "XL"], stock: 40, image: product1, description: "Stay cozy and stylish with our premium sweatshirt, crafted from soft, breathable fabric for all-day comfort. Designed with a modern fit and durable stitching, it's perfect for casual wear, workouts, or layering during chilly days. Available in multiple colors, this sweatshirt combines comfort, versatility, and timeless style — making it a must-have for every wardrobe." },
  { id: "sample-9", name: "Tracksuit", price: 3200, category: "Track Pants", sizes: ["S", "M"], stock: 120, image: product2, description: "Elevate your everyday look with our premium tracksuit, designed for both comfort and performance. Made from soft, breathable fabric with a perfect balance of stretch, it offers a relaxed yet athletic fit. Whether you're hitting the gym, running errands, or lounging in style, this tracksuit keeps you comfortable and confident all day long. Available in multiple colors with sleek detailing for a modern touch." },
  { id: "sample-10", name: "Tracksuit", price: 3200, category: "Track Pants", sizes: ["M", "L"], stock: 55, image: product3, description: "Elevate your everyday look with our premium tracksuit, designed for both comfort and performance. Made from soft, breathable fabric with a perfect balance of stretch, it offers a relaxed yet athletic fit. Whether you're hitting the gym, running errands, or lounging in style, this tracksuit keeps you comfortable and confident all day long. Available in multiple colors with sleek detailing for a modern touch." },
  { id: "sample-11", name: "Sweat Shirt", price: 1599.0, category: "Hoodies", sizes: ["M", "L", "XL"], stock: 65, image: product4, description: "Stay cozy and stylish with our premium sweatshirt, crafted from soft, breathable fabric for all-day comfort. Designed with a modern fit and durable stitching, it's perfect for casual wear, workouts, or layering during chilly days. Available in multiple colors, this sweatshirt combines comfort, versatility, and timeless style — making it a must-have for every wardrobe." },
  { id: "sample-12", name: "Sweat Shirt", price: 799.0, category: "Hoodies", sizes: ["S", "M", "L"], stock: 100, image: product1, description: "Stay cozy and stylish with our premium sweatshirt, crafted from soft, breathable fabric for all-day comfort. Designed with a modern fit and durable stitching, it's perfect for casual wear, workouts, or layering during chilly days. Available in multiple colors, this sweatshirt combines comfort, versatility, and timeless style — making it a must-have for every wardrobe." },
];

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const productsData = await getAllProducts();
      // Use Firebase products if available, otherwise use sample products
      if (productsData && productsData.length > 0) {
        setProducts(productsData);
      } else {
        setProducts(sampleProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // On error, use sample products
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  // Get trending products (first 6 products)
  const trendingProducts = products.slice(0, 6);
  
  // Get best sellers (next 6 products or repeat if not enough)
  const bestSellers = products.length > 6 
    ? products.slice(6, 12)
    : products.slice(0, 6);

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading products...</span>
      </div>
    );
  }

  return (
    <>
      {/* Trending Now Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
              Popular Products
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">Trending Now</h2>
          </div>

          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-6">
            <div className="flex gap-4 md:gap-8">
              {trendingProducts.map((product) => (
                <div key={product.id} className="flex-none w-[45%] sm:w-[280px] md:w-[320px] snap-start">
                  <ProductCard 
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    description={product.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Best Selling Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-2">
              Shop
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">Best Selling</h2>
          </div>

          <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-6">
            <div className="flex gap-4 md:gap-8">
              {bestSellers.map((product) => (
                <div key={product.id} className="flex-none w-[45%] sm:w-[280px] md:w-[320px] snap-start">
                  <ProductCard 
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    description={product.description}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductsSection;

