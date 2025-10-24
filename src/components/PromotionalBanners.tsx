import { Button } from "@/components/ui/button";
import clothingBanner1 from "@/assets/Gemini_Generated_Image_tgpn39tgpn39tgpn.png";
import clothingBanner2 from "@/assets/Gemini_Generated_Image_tsr9x1tsr9x1tsr9.png";
import { useNavigate } from "react-router-dom";

const PromotionalBanners = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Fashion Collection Banner */}
          <div className="relative overflow-hidden rounded-lg aspect-[4/5] group">
            <img
              src={clothingBanner1}
              alt="Premium Fashion Collection"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-xs uppercase tracking-widest mb-2">
                New Collections
              </p>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                Premium Fashion Collection
              </h3>
              <p className="text-sm mb-4 opacity-90">Find your unique style.</p>
              <Button variant="secondary" className="uppercase tracking-wider" onClick={() => navigate('/products')}>
                Shop Now
              </Button>
            </div>
          </div>

          {/* Trendy Apparel Banner */}
          <div className="relative overflow-hidden rounded-lg aspect-[4/5] group">
            <img
              src={clothingBanner2}
              alt="Trendy Apparel Collection"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <p className="text-xs uppercase tracking-widest mb-2">
                New Collections
              </p>
              <h3 className="text-3xl md:text-4xl font-bold mb-2">
                Trendy Apparel Collection
              </h3>
              <p className="text-sm mb-4 opacity-90">Express yourself boldly.</p>
              <Button variant="secondary" className="uppercase tracking-wider" onClick={() => navigate('/products')}>
                Shop Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
