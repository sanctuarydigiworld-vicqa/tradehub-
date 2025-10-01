
import { categories, products } from '@/lib/placeholder-data';
import ProductCard from '@/components/product-card';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const AnimatedCart = () => (
  <div className="relative w-24 h-24 mb-4 text-primary">
    <svg viewBox="0 0 100 100" className="absolute inset-0">
      {/* Cart Body */}
      <path
        d="M20 80 L30 80 L35 40 L80 40 L75 60 L40 60 L35 80 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animateTransform
          attributeName="transform"
          type="translate"
          from="-100 0"
          to="0 0"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
          fill="freeze"
        />
      </path>
      {/* Wheels */}
      <circle cx="40" cy="85" r="4" fill="currentColor">
        <animateTransform
          attributeName="transform"
          type="translate"
          from="-100 0"
          to="0 0"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
          fill="freeze"
        />
      </circle>
      <circle cx="70" cy="85" r="4" fill="currentColor">
        <animateTransform
          attributeName="transform"
          type="translate"
          from="-100 0"
          to="0 0"
          dur="1.5s"
          begin="0s"
          repeatCount="indefinite"
          fill="freeze"
        />
      </circle>
      {/* Plus sign */}
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        <line x1="60" y1="20" x2="80" y2="20">
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.5s"
            begin="1s"
            repeatCount="indefinite"
            fill="freeze"
          />
        </line>
        <line x1="70" y1="10" x2="70" y2="30">
          <animate
            attributeName="opacity"
            from="0"
            to="1"
            dur="0.5s"
            begin="1s"
            repeatCount="indefinite"
            fill="freeze"
          />
        </line>
      </g>
    </svg>
  </div>
);

export default function Home() {
  return (
    <>
      <section className="relative bg-secondary/50 py-24 md:py-32 lg:py-40">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtYXJrZXRwbGFjZXxlbnwwfHx8fDE3NTkyODU5NDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Marketplace"
            fill
            className="object-cover opacity-20"
            data-ai-hint="marketplace products"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        <div className="container relative mx-auto text-center flex flex-col items-center">
          <AnimatedCart />
          <h1 className="text-4xl font-headline font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Discover & Sell Unique Goods
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            VicqaTradeHub is your modern marketplace for unique products from
            talented vendors. Buy what you love, sell what you make.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/">Start Shopping</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/register">Start Selling</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Featured Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Browse by category</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="flex flex-col space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg text-foreground hover:bg-secondary transition-colors duration-200 group"
                    >
                      <span className="font-medium">{category.name}</span>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-transform duration-200 group-hover:translate-x-1" />
                    </Link>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </>
  );
}
