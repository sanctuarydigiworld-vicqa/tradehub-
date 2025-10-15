
'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';


export type CartItem = { 
  productId: string; 
  quantity: number;
};

export type CartItemWithProduct = Product & {
    quantity: number;
};

interface CartContextType {
  cart: CartItemWithProduct[];
  rawCart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: (showToast?: boolean) => void;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [rawCart, setRawCart] = useState<CartItem[]>([]);
  const { toast } = useToast();
  
  const { firestore } = useFirebase();
  const productsQuery = firestore ? collection(firestore, 'products') : null;
  const { data: allProducts } = useCollection<Product>(productsQuery);


  useEffect(() => {
    try {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        setRawCart(JSON.parse(cartData));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error);
      localStorage.removeItem('cart');
    }
  }, []);

  const updateLocalStorage = (updatedCart: CartItem[]) => {
    try {
        setRawCart(updatedCart);
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
    const existingItemIndex = rawCart.findIndex(item => item.productId === product.id);
    let newCart: CartItem[];

    if (existingItemIndex > -1) {
      newCart = [...rawCart];
      newCart[existingItemIndex].quantity += 1;
    } else {
      newCart = [...rawCart, { productId: product.id, quantity: 1 }];
    }
    
    updateLocalStorage(newCart);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  }, [rawCart, toast]);

  const removeFromCart = useCallback((productId: string) => {
    const newCart = rawCart.filter(item => item.productId !== productId);
    updateLocalStorage(newCart);
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart.',
    });
  }, [rawCart, toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) {
        removeFromCart(productId);
        return;
    };
    const newCart = rawCart.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    updateLocalStorage(newCart);
  }, [rawCart, removeFromCart]);

  const clearCart = useCallback((showToast = false) => {
    updateLocalStorage([]);
    if (showToast) {
        toast({
            title: 'Cart cleared',
            description: 'All items have been removed from your cart.',
        });
    }
  }, [toast]);
  
  const isInCart = useCallback((productId: string) => {
    return rawCart.some(item => item.productId === productId);
  }, [rawCart]);

  const cart = useMemo(() => {
    if (!allProducts) {
        return [];
    }

    const productMap = new Map<string, Product>();
    allProducts.forEach(p => productMap.set(p.id, p));
    
    return rawCart
      .map(item => {
        const product = productMap.get(item.productId);
        if (!product) return null;
        return {
          ...product,
          quantity: item.quantity,
        };
      })
      .filter((item): item is CartItemWithProduct => item !== null);
  }, [rawCart, allProducts]);


  const value = {
    cart,
    rawCart,
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
