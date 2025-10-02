
'use client';

import { products as initialProducts } from '@/lib/placeholder-data';
import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function AllProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

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
        initialProducts.forEach(p => productMap.set(p.id, p));
        mappedLocalProducts.forEach(p => productMap.set(p.id, p));
        setProducts(Array.from(productMap.values()));
      }
    } catch(e) {
      console.error("Could not parse products from local storage", e);
      setProducts(initialProducts);
    }
  }, []);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
