
import { products } from '@/lib/placeholder-data';
import ProductCard from '@/components/product-card';
import { notFound } from 'next/navigation';
import { SearchIcon } from 'lucide-react';

export default function SearchPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
  };
}) {
  const searchQuery = searchParams?.q || '';

  if (!searchQuery) {
    notFound();
  }

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const recommendedProducts = products.slice(0, 4);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Search Results</h1>
      <p className="text-center text-muted-foreground mb-12">
        {filteredProducts.length > 0 
          ? `Found ${filteredProducts.length} results for `
          : `No results found for `
        }
        <span className="font-semibold text-foreground">&quot;{searchQuery}&quot;</span>
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div>
            <div className="text-center py-16 border-b">
                <SearchIcon className="mx-auto h-16 w-16 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-semibold">No products found</h2>
                <p className="mt-2 text-muted-foreground">
                    We couldn&apos;t find any products matching your search. Try a different keyword.
                </p>
            </div>
            <div className="mt-16">
                <h3 className="text-3xl font-bold text-center mb-8">You May Also Like</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {recommendedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
