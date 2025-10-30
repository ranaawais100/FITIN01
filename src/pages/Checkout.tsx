import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import emailjs from '@emailjs/browser';

const Checkout = () => {
  const { items, removeItem, updateQuantity, clear } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    zipCode: "",
    email: "",
  });

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleShippingDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = () => {
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    setShowDetailsForm(true);
  };

  const handleConfirmPayment = () => {
    const { fullName, phoneNumber, streetAddress, city, zipCode, email } = shippingDetails;

    if (!fullName || !phoneNumber || !streetAddress || !city || !zipCode || !email) {
      toast.error("Please fill in all the required shipping details.");
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      toast.error("Please enter a valid email address!");
      return;
    }

    setIsProcessing(true);

    const templateParams = {
      title: "Your FITIN Store Order Confirmation",
      name: fullName,
      email: email,
      customer_phone: phoneNumber,
      customer_address: `${streetAddress}, ${city}, ${zipCode}`,
      order_items: items.map(i => `${i.name} (x${i.quantity}) - PKR ${i.price.toFixed(2)}`).join('<br>'),
      order_total: `PKR ${total.toFixed(2)}`,
      customer_name:fullName,

    };

    emailjs.send('service_y74axjg', 'template_9s9mg3f', templateParams, 'EMY6w-vmWX9di5A9N')
    emailjs.send('service_y74axjg','template_by48xuo',templateParams, 'EMY6w-vmWX9di5A9N')
      .then((response) => {
        console.log('SUCCESS!', response.status, response.text);
        toast.success("Order placed successfully! Thank you for shopping with us.");
        clear();
        navigate("/order-confirmation");
      }, (err) => {
        console.log('FAILED...', err);
        toast.error("There was an error placing your order. Please try again.");
      }).finally(() => {
        setIsProcessing(false);
      });
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
                        <input className="w-16 p-1 border rounded" type="number" value={it.quantity} onChange={(e) => updateQuantity(idx, Number(e.target.value))} min={1} />
                        <Button variant="ghost" onClick={() => removeItem(idx)}>Remove</Button>
                      </div>
                    </div>
                    <div className="text-right font-semibold">PKR {(it.price * it.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="bg-muted/10 p-6 rounded-xl self-start sticky top-24">
              {!showDetailsForm ? (
                <>
                  <div className="text-sm text-muted-foreground mb-2">Order Summary</div>
                  <div className="border-t border-border pt-4 mt-2">
                    <div className="flex justify-between mb-2"><span className="text-sm">Subtotal</span><span className="font-medium">PKR {total.toFixed(2)}</span></div>
                    <div className="flex justify-between mb-2"><span className="text-sm">Shipping</span><span className="font-medium">Free</span></div>
                    <div className="border-t border-border pt-2 mt-2"><div className="flex justify-between"><span className="font-semibold">Total</span><span className="text-2xl font-bold text-primary">PKR {total.toFixed(2)}</span></div></div>
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <Button onClick={handleProceedToPayment} className="w-full">Proceed to Payment</Button>
                    <Button variant="outline" onClick={handleContinueShopping}>Continue Shopping</Button>
                    <Button variant="ghost" onClick={() => clear()}>Clear Cart</Button>
                  </div>
                </>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Shipping Details</h3>
                  <div className="space-y-4">
                    <input type="text" name="fullName" placeholder="Full Name" value={shippingDetails.fullName} onChange={handleShippingDetailsChange} className="w-full p-2 border rounded" required />
                    <input type="text" name="phoneNumber" placeholder="Phone Number" value={shippingDetails.phoneNumber} onChange={handleShippingDetailsChange} className="w-full p-2 border rounded" required />
                    <input type="text" name="streetAddress" placeholder="Street Address" value={shippingDetails.streetAddress} onChange={handleShippingDetailsChange} className="w-full p-2 border rounded" required />
                    <input type="text" name="city" placeholder="City" value={shippingDetails.city} onChange={handleShippingDetailsChange} className="w-full p-2 border rounded" required />
                    <input type="text" name="zipCode" placeholder="Zip Code" value={shippingDetails.zipCode} onChange={handleShippingDetailsChange} className="w-full p-2 border rounded" required />
                    <input type="email" name="email" placeholder="Email Address" value={shippingDetails.email} onChange={handleShippingDetailsChange} className="w-full p-2 border rounded" required />
                  </div>
                  <div className="mt-6 flex flex-col gap-3">
                    <Button onClick={handleConfirmPayment} disabled={isProcessing} className="w-full">
                      {isProcessing ? "Processing..." : "Confirm & Continue to Payment"}
                    </Button>
                     <Button variant="outline" onClick={() => setShowDetailsForm(false)}>Back to Summary</Button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
