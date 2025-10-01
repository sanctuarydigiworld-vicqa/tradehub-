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

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 3);

  const socialLinks = [
    { icon: Twitter, name: 'Twitter', color: 'hover:text-[#1DA1F2]' },
    { icon: Facebook, name: 'Facebook', color: 'hover:text-[#1877F2]' },
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
            <Button size="lg" className="flex-grow">Add to Cart</Button>
            <Button size="lg" variant="outline">Buy Now</Button>
          </div>

          <div className="flex items-center space-x-4">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Share2 className="w-4 h-4" /> Share:</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href="#"
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
    return products.map((product) => ({
        id: product.id,
    }));
}
