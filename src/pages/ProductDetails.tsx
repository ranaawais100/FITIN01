import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getProductById, Product } from '@/lib/firebaseService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    try {
      const fetchedProduct = await getProductById(id);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        if (fetchedProduct.images && fetchedProduct.images.length > 0) {
            setMainImage(fetchedProduct.images[0]);
        } else {
            setMainImage('/placeholder.svg');
        }
      } else {
        toast.error('Product not found.');
      }
    } catch (error) {
      toast.error('Failed to fetch product details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading product...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="text-muted-foreground">The product you are looking for does not exist.</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="main-image-container border rounded-lg overflow-hidden">
              <img src={mainImage || '/placeholder.svg'} alt={product.name} className="w-full h-auto object-cover" />
            </div>
            <div className="thumbnail-images-container grid grid-cols-4 gap-2">
              {product.images && product.images.map((image, index) => (
                <button key={index} onClick={() => setMainImage(image)} className={`border rounded-lg overflow-hidden ${mainImage === image ? 'border-primary' : ''}`}>
                  <img src={image} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-container">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-xl text-primary mb-4">PKR {product.price.toFixed(2)}</p>
            <p className="text-muted-foreground mb-4">{product.description}</p>
            <div className="flex items-center gap-4 mb-4">
              <span className="font-semibold">Sizes:</span>
              <div className="flex gap-2">
                {product.sizes.map(size => (
                  <span key={size} className="px-3 py-1 border rounded-md">{size}</span>
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Category: {product.category}</p>
            <p className="text-sm text-muted-foreground">Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
