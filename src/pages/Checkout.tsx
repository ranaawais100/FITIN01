import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Checkout = () => {
  const { items, removeItem, updateQuantity, clear } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleProceedToPayment = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Order placed successfully! Thank you for shopping with us.");
      clear();
      navigate("/");
    }, 2000);
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-8 bg-muted/10 rounded-xl inline-block">
              <p className="text-xl mb-4">Your cart is empty.</p>
              <Button onClick={handleContinueShopping}>Continue Shopping</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ul className="space-y-4">
                {items.map((it, idx) => (
                  <li key={idx} className="flex items-center gap-4 p-4 bg-background rounded">
                    {it.image && <img src={it.image} alt={it.name} className="w-20 h-20 object-cover rounded" />}
                    <div className="flex-1">
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-muted-foreground">Size: {it.size ?? "-"}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <input className="w-16 p-1 border rounded" type="number" value={it.quantity} onChange={(e) => updateQuantity(idx, Number(e.target.value))} />
                        <Button variant="ghost" onClick={() => removeItem(idx)}>Remove</Button>
                      </div>
                    </div>
                    <div className="text-right font-semibold">PKR {(it.price * it.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="bg-muted/10 p-6 rounded-xl">
              <div className="text-sm text-muted-foreground mb-2">Order Summary</div>
              <div className="border-t border-border pt-4 mt-2">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Subtotal</span>
                  <span className="font-medium">PKR {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">PKR {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3">
                <Button 
                  onClick={handleProceedToPayment} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Proceed to Payment"}
                </Button>
                <Button variant="outline" onClick={handleContinueShopping}>Continue Shopping</Button>
                <Button variant="ghost" onClick={() => clear()}>Clear Cart</Button>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
