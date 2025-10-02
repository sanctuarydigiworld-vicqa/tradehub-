
'use client';

import { products } from '@/lib/placeholder-data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ProductCard from '@/components/product-card';
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Share2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { useEffect, useState } from 'react';

// SVG for WhatsApp icon as it's not in lucide-react
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );

export default function ProductPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState<Product[]>(products);

  useEffect(() => {
    try {
      const localProductsRaw = localStorage.getItem('products');
      if (localProductsRaw) {
        const localProducts = JSON.parse(localProductsRaw);
        const mappedLocalProducts: Product[] = localProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: parseFloat(p.price || 0),
          category: p.category || 'Uncategorized',
          vendor: 'Current Vendor',
          image: {
            id: p.id,
            imageUrl: p.image,
            imageHint: 'custom product',
            description: p.name
          }
        }));

        const productMap = new Map();
        products.forEach(p => productMap.set(p.id, p));
        mappedLocalProducts.forEach(p => productMap.set(p.id, p));
        setAllProducts(Array.from(productMap.values()));
      }
    } catch(e) {
      console.error("Could not parse products from local storage", e);
      setAllProducts(products);
    }
  }, []);

  const product = allProducts.find((p) => p.id === params.id);

  if (!product) {
    return notFound();
  }
  
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this product: ${product.name}`;

  const relatedProducts = allProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);
  
  const getShareUrl = (platform: string) => {
    switch (platform) {
      case 'Twitter':
        return `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(shareText)}`;
      case 'Facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`;
      case 'WhatsApp':
        return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + productUrl)}`;
      case 'LinkedIn':
        return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(productUrl)}&title=${encodeURIComponent(product.name)}&summary=${encodeURIComponent(product.description)}`;
      case 'Email':
        return `mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`I thought you might like this product: ${productUrl}`)}`;
      default:
        return '#';
    }
  };

  const socialLinks = [
    { icon: Twitter, name: 'Twitter', color: 'hover:text-[#1DA1F2]' },
    { icon: Facebook, name: 'Facebook', color: 'hover:text-[#1877F2]' },
    { icon: WhatsAppIcon, name: 'WhatsApp', color: 'hover:text-[#25D366]' },
    { icon: Instagram, name: 'Instagram', color: 'hover:text-[#E4405F]' },
    { icon: Linkedin, name: 'LinkedIn', color: 'hover:text-[#0A66C2]' },
    { icon: Mail, name: 'Email', color: 'hover:text-gray-500' },
  ];
  
  const handleAddToCart = () => {
    try {
      const cartRaw = localStorage.getItem('cart');
      const cart = cartRaw ? JSON.parse(cartRaw) : [];
      
      const existingProductIndex = cart.findIndex((item: Product) => item.id === product.id);

      if (existingProductIndex > -1) {
        toast({
          title: 'Already in cart',
          description: `${product.name} is already in your cart.`,
        });
      } else {
        cart.push({ ...product, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        toast({
          title: 'Added to cart',
          description: `${product.name} has been added to your cart.`,
        });
      }
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative group overflow-hidden rounded-lg aspect-square">
            <Image
              src={product.image.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              data-ai-hint={product.image.imageHint}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <Badge variant="secondary" className="w-fit mb-2">{product.category}</Badge>
          <h1 className="text-4xl font-headline font-bold mb-4">{product.name}</h1>
          <p className="text-muted-foreground text-lg mb-6">{product.description}</p>
          
          <div className="flex items-center justify-between mb-8">
            <p className="text-4xl font-headline font-bold text-primary">
              GH₵{product.price.toFixed(2)}
            </p>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <Button size="lg" className="flex-grow" onClick={handleAddToCart}>Add to Cart</Button>
            <Button size="lg" variant="outline">Buy Now</Button>
          </div>

          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Share2 className="w-4 h-4" /> Share:</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={getShareUrl(social.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn("text-muted-foreground transition-colors", social.color)}
                  aria-label={`Share on ${social.name}`}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function generateStaticParams() {
    // We combine placeholder products with a generic approach for dynamic ones
    const staticIds = products.map((product) => ({
        id: product.id,
    }));
    
    // This function runs at build time, so we can't access localStorage here.
    // Next.js will fallback to on-demand rendering for any ID not in this list.
    return staticIds;
}
