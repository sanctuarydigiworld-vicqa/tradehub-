
'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type ProductCardProps = {
  product: Product;
};

type CartItem = Product & { quantity: number };


export default function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();

  const handleAddToCart = () => {
    try {
      const cartRaw = localStorage.getItem('cart');
      const cart: CartItem[] = cartRaw ? JSON.parse(cartRaw) : [];
      
      const existingProductIndex = cart.findIndex((item) => item.id === product.id);

      if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
        toast({
          title: 'Added to cart',
          description: `Another ${product.name} has been added to your cart.`,
        });
      } else {
        cart.push({ ...product, quantity: 1 });
        toast({
          title: 'Added to cart',
          description: `${product.name} has been added to your cart.`,
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Could not add item to cart.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full aspect-[4/3] overflow-hidden">
            <Image
              src={product.image.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.image.imageHint}
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Badge variant="secondary" className="mb-2">{product.category}</Badge>
        <CardTitle className="text-lg leading-snug">
          <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-xl font-headline font-bold text-primary">
          GH₵{product.price.toFixed(2)}
        </p>
        <Button onClick={handleAddToCart}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
