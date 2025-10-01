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

export default function Home() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <h1 className="text-3xl lg:text-4xl font-bold mb-6">Discover Products</h1>
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
  );
}
