import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllProducts, type Product } from "@/lib/firebaseService";

const sizes = ["Any Size", "S", "M", "L", "XL"];
const sortOptions = [
  { id: "relevance", label: "Relevance" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
];

function ShopAll() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(["All Categories"]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All Categories");
  const [size, setSize] = useState<string>(sizes[0]);
  const [sort, setSort] = useState<string>(sortOptions[0].id);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const productsData = await getAllProducts();
      
      if (productsData && productsData.length > 0) {
        setAllProducts(productsData);
        
        const uniqueCategories = Array.from(
          new Set(productsData.map(p => p.category).filter(Boolean))
        );
        setCategories(["All Categories", ...uniqueCategories]);
      } else {
        setAllProducts([]);
        setCategories(["All Categories", "Hoodies", "Shirts", "Track Pants", "Trouser"]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let items = allProducts.slice();

    if (category !== "All Categories") {
      items = items.filter((p) => p.category === category);
    }

    if (size !== "Any Size") {
      items = items.filter((p) => p.sizes?.includes(size));
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (sort === "price-asc") items.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") items.sort((a, b) => b.price - a.price);

    return items;
  }, [query, category, size, sort, allProducts]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-2 sm:px-4 py-6 md:py-12">
          <nav className="text-xs sm:text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="font-medium">Shop All</span>
          </nav>

          <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Shop All</h1>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">Browse our full collection of men's apparel.</p>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="lg:hidden"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {loading ? "Loading..." : `${filtered.length} results`}
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="p-2 text-xs sm:text-sm border border-border rounded">
                {sortOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </header>

          <div className="relative">
            {isFilterOpen && (
              <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsFilterOpen(false)} />
            )}

            <div className="flex gap-4 md:gap-6 lg:gap-8">
              <aside className={`fixed lg:relative inset-y-0 left-0 z-50 w-[85vw] max-w-[320px] lg:w-auto lg:max-w-none lg:flex-shrink-0 transform transition-transform duration-300 lg:transform-none ${
                isFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
              }`}>
                <div className="h-full lg:h-auto bg-background lg:bg-muted/10 rounded-none lg:rounded-xl p-4 sm:p-6 lg:sticky lg:top-24 overflow-y-auto shadow-xl lg:shadow-none">
                  <div className="flex items-center justify-between mb-4 lg:hidden">
                    <h3 className="font-semibold text-base">Filters</h3>
                    <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <h3 className="font-semibold mb-4 text-sm sm:text-base hidden lg:block">Filters</h3>

                <label className="block text-xs sm:text-sm mb-1 font-medium">Search</label>
                <input 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="Search products..." 
                  className="w-full p-2 mb-4 text-xs sm:text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary" 
                />

                <label className="block text-xs sm:text-sm mb-1 font-medium">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)} 
                  className="w-full p-2 mb-4 text-xs sm:text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-background"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-background text-foreground">
                      {c}
                    </option>
                  ))}
                </select>

                <label className="block text-xs sm:text-sm mb-1 font-medium">Size</label>
                <select 
                  value={size} 
                  onChange={(e) => setSize(e.target.value)} 
                  className="w-full p-2 mb-4 text-xs sm:text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-background"
                >
                  {sizes.map((s) => (
                    <option key={s} value={s} className="bg-background text-foreground">
                      {s}
                    </option>
                  ))}
                </select>

                <button 
                  onClick={() => {
                    setQuery("");
                    setCategory("All Categories");
                    setSize(sizes[0]);
                    setSort(sortOptions[0].id);
                    setIsFilterOpen(false);
                  }} 
                  className="w-full py-2.5 mt-2 text-xs sm:text-sm font-medium bg-primary text-primary-foreground border border-primary rounded hover:bg-primary/90 transition-colors"
                >
                  Reset filters
                </button>
              </div>
              </aside>
            
            <div className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading products...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                  {filtered.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      name={product.name}
                      price={product.price}
                      image={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.svg'}
                      description={product.description}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ShopAll;