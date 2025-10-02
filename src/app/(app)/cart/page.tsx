
'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

type CartItem = Product & { quantity: number };

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const cartRaw = localStorage.getItem('cart');
      const loadedCart = cartRaw ? JSON.parse(cartRaw) : [];
      setCartItems(loadedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        title: 'Error',
        description: 'Could not load your cart.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const updateCart = (newCart: CartItem[]) => {
    setCartItems(newCart);
    try {
      localStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
        console.error('Error saving cart:', error);
        toast({
          title: 'Error',
          description: 'Could not update your cart.',
          variant: 'destructive',
        });
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const newCart = cartItems.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    updateCart(newCart);
  };

  const handleRemoveItem = (productId: string) => {
    const newCart = cartItems.filter((item) => item.id !== productId);
    updateCart(newCart);
    toast({
      title: 'Item removed',
      description: 'The item has been removed from your cart.',
    });
  };

  const cartSubtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingFee = 5.00;
  const cartTotal = cartSubtotal + shippingFee;

  if (cartItems.length === 0) {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
            <h1 className="mt-4 text-3xl font-bold">Your Cart is Empty</h1>
            <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild className="mt-6">
                <Link href="/products">Start Shopping</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] hidden sm:table-cell">Product</TableHead>
                    <TableHead></TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead><span className="sr-only">Remove</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          src={item.image.imageUrl}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                          data-ai-hint={item.image.imageHint}
                        />
                      </TableCell>
                       <TableCell className="font-medium">
                        <Link href={`/products/${item.id}`} className="hover:text-primary">{item.name}</Link>
                       </TableCell>
                      <TableCell>GH₵{item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                          className="w-20 mx-auto text-center"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        GH₵{(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order before checkout.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GH₵{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>GH₵{shippingFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>GH₵{cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" size="lg">Proceed to Checkout</Button>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
