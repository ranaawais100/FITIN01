import React, { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id?: number | string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  quantity: number;
}

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("cart:v1");
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart:v1", JSON.stringify(items));
    } catch (error) {
      // Silently handle localStorage errors
      console.warn('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  const addItem = (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const qty = item.quantity ?? 1;
      // merge by id + size when possible
      const idx = prev.findIndex((p) => p.id === item.id && p.size === item.size && p.name === item.name);
      if (idx > -1) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
        return next;
      }
      return [...prev, { ...item, quantity: qty } as CartItem];
    });
  };

  const removeItem = (index: number) => setItems((p) => p.filter((_, i) => i !== index));

  const updateQuantity = (index: number, qty: number) =>
    setItems((p) => p.map((it, i) => (i === index ? { ...it, quantity: Math.max(1, Math.floor(qty)) } : it)));

  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clear }}>{children}</CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export default CartProvider;
