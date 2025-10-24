import { Button } from "@/components/ui/button";
import collectionBanner from "@/assets/Gemini_Generated_Image_kxyqhvkxyqhvkxyq.png";
import { useNavigate } from "react-router-dom";

const CollectionBanner = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <img
              src={collectionBanner}
              alt="New beauty collection"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          <div className="order-1 md:order-2 space-y-6">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              New Collection
            </p>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              The Clothing Collection That Makes All The Difference!
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover our carefully curated selection of premium clothing designed to enhance your unique style and confidence.
            </p>
            <Button size="lg" className="uppercase tracking-wider" onClick={() => navigate('/products')}>
              Shop Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CollectionBanner;
