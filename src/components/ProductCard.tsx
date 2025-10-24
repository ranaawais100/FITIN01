import { ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as Dialog from "@/components/ui/dialog";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  onSale?: boolean;
  description?: string;
}

const ProductCard = ({
  image,
  name,
  price,
  originalPrice,
  rating = 5,
  onSale = false,
  description,
}: ProductCardProps) => {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<string | undefined>(undefined);
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const navigate = useNavigate();

  const handleAdd = () => {
    cart.addItem({ id: name, name, price, image, size, quantity: qty });
    setOpen(false);
  };

  const handleBuyNow = () => {
    cart.addItem({ id: name, name, price, image, size, quantity: qty });
    navigate("/checkout");
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="group relative bg-card rounded-xl overflow-hidden shadow-sm cursor-pointer">
        <div className="relative">
          <div className="aspect-[3/4] w-full overflow-hidden bg-muted/10">
            <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          </div>

          {/* Footer overlay */}
          <div className="bg-muted/20 p-4">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{name}</p>
          </div>
        </div>

        <div className="p-4 bg-muted/10 flex flex-col gap-3">
          <h3 className="font-semibold text-foreground text-lg">{name}</h3>

          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <span className="px-2 py-1 border border-border rounded text-xs">S</span>
              <span className="px-2 py-1 border border-border rounded text-xs">M</span>
              <span className="px-2 py-1 border border-border rounded text-xs">L</span>
              <span className="px-2 py-1 border border-border rounded text-xs">XL</span>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-muted border border-border" />
              <div className="h-3 w-3 rounded-full bg-muted border border-border" />
            </div>
          </div>

          <div className="mt-2 border-t border-border pt-3 flex items-center">
            <div className="text-2xl font-bold text-primary">PKR {price.toFixed(2)}</div>
            <Button variant="ghost" size="icon" className="ml-auto text-primary bg-transparent border border-border hover:bg-muted/20">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog.Dialog open={open} onOpenChange={setOpen}>
  <Dialog.DialogContent>
          <Dialog.DialogHeader>
            <Dialog.DialogTitle>{name}</Dialog.DialogTitle>
            <Dialog.DialogDescription>Product details</Dialog.DialogDescription>
          </Dialog.DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img src={image} alt={name} className="w-full h-64 sm:h-80 md:h-96 object-cover rounded" />
            </div>
            <div>
              <div className="text-2xl font-bold">PKR {price.toFixed(2)}</div>
              {originalPrice && <div className="text-sm line-through text-muted-foreground">PKR {originalPrice.toFixed(2)}</div>}
              <p className="mt-4 text-sm text-muted-foreground">
                {description || "High quality product with premium materials. Add a short description here to make this card feel professional."}
              </p>

              <div className="mt-4">
                <label className="text-sm block mb-2">Size</label>
                <select value={size} onChange={(e) => setSize(e.target.value)} className="p-2 border border-border rounded w-40">
                  <option value="">Select size</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <label className="text-sm">Quantity</label>
                <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value)))} className="w-20 p-2 border rounded" />
              </div>

              <div className="mt-6 flex items-center gap-3">
                <Button onClick={handleAdd}>Add to cart</Button>
                <Button variant="outline" onClick={handleBuyNow}>Buy now</Button>
                <Dialog.DialogClose asChild>
                  <Button variant="ghost" className="ml-auto">Close</Button>
                </Dialog.DialogClose>
              </div>
            </div>
          </div>
        </Dialog.DialogContent>
      </Dialog.Dialog>
    </>
  );
};

export default ProductCard;
