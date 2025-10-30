import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate("/products");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="text-center p-8 bg-muted/10 rounded-xl">
          <h1 className="text-2xl font-bold mb-4">Your order has been placed successfully!</h1>
          <p className="text-lg mb-6">Our team will contact you soon.</p>
          <Button onClick={handleContinueShopping}>Continue Shopping</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
