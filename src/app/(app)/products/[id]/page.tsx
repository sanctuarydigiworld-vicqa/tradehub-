
'use client';

import { products as placeholderProducts } from '@/lib/placeholder-data';
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
  Check,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { useCart } from '@/hooks/use-cart.tsx';
import { useFirebase } from '@/firebase';
import { useDoc } from '@/firebase/firestore/use-doc';
import { useCollection } from '@/firebase/firestore/use-collection';
import { doc, collection, query, where, limit } from 'firebase/firestore';

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
  const { firestore } = useFirebase();
  const { addToCart, isInCart } = useCart();
  
  const productRef = firestore ? doc(firestore, 'products', params.id) : null;
  const { data: product, isLoading: isProductLoading } = useDoc<Product>(productRef);

  const isProductInCart = product ? isInCart(product.id) : false;

  const relatedProductsQuery = firestore && product
    ? query(
        collection(firestore, 'products'),
        where('category', '==', product.category),
        where('__name__', '!=', product.id), // Exclude the current product
        limit(3)
      )
    : null;
  const { data: relatedProducts, isLoading: areRelatedLoading } = useCollection<Product>(relatedProductsQuery);

  if (isProductLoading) {
    return <ProductPage.Skeleton />;
  }

  if (!product) {
    return notFound();
  }
  
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Check out this product: ${product.name}`;
  
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
            <Button size="lg" className="flex-grow" onClick={() => addToCart(product)} disabled={isProductInCart}>
                {isProductInCart ? (
                    <>
                        <Check className="mr-2 h-4 w-4" /> Added to Cart
                    </>
                ) : 'Add to Cart'
                }
            </Button>
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
      {relatedProducts && relatedProducts.length > 0 && (
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

ProductPage.Skeleton = function ProductPageSkeleton() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
            <div className="grid md:grid-cols-2 gap-12">
                <div className="bg-muted rounded-lg aspect-square"></div>
                <div className="flex flex-col justify-center space-y-4">
                    <div className="h-6 w-24 bg-muted rounded"></div>
                    <div className="h-10 w-3/4 bg-muted rounded"></div>
                    <div className="space-y-2">
                        <div className="h-4 w-full bg-muted rounded"></div>
                        <div className="h-4 w-full bg-muted rounded"></div>
                        <div className="h-4 w-5/6 bg-muted rounded"></div>
                    </div>
                    <div className="h-12 w-1/3 bg-muted rounded"></div>
                    <div className="flex gap-4">
                        <div className="h-12 flex-grow bg-muted rounded"></div>
                        <div className="h-12 w-24 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
