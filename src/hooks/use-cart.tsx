
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export type CartItem = Product & { quantity: number };

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        setCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
      // Handle error, maybe clear corrupt data
      localStorage.removeItem('cart');
    }
  }, []);

  const updateLocalStorage = (updatedCart: CartItem[]) => {
    try {
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
        console.error('Failed to save cart to localStorage', error);
        toast({
            title: 'Error',
            description: 'Could not update your cart.',
            variant: 'destructive'
        });
    }
  };

  const addToCart = useCallback((product: Product) => {
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    let newCart: CartItem[];

    if (existingItemIndex > -1) {
      newCart = [...cart];
      newCart[existingItemIndex].quantity += 1;
    } else {
      newCart = [...cart, { ...product, quantity: 1 }];
    }
    
    updateLocalStorage(newCart);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  }, [cart, toast]);

  const removeFromCart = useCallback((productId: string) => {
    const newCart = cart.filter(item => item.id !== productId);
    updateLocalStorage(newCart);
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart.',
    });
  }, [cart, toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    };
    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    updateLocalStorage(newCart);
  }, [cart, removeFromCart]);

  const clearCart = useCallback(() => {
    updateLocalStorage([]);
    toast({
        title: 'Cart cleared',
        description: 'All items have been removed from your cart.',
    });
  }, [toast]);
  
  const isInCart = useCallback((productId: string) => {
    return cart.some(item => item.id === productId);
  }, [cart]);


  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
