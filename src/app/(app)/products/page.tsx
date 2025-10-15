
'use client';

import ProductCard from '@/components/product-card';
import type { Product } from '@/lib/types';
import { useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection } from 'firebase/firestore';


export default function AllProductsPage() {
  const { firestore } = useFirebase();
  const productsQuery = firestore ? collection(firestore, 'products') : null;
  const { data: products, isLoading } = useCollection<Product>(productsQuery);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {isLoading && Array.from({ length: 8 }).map((_, i) => <ProductCard.Skeleton key={i} />)}
        {!isLoading && products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {!isLoading && (!products || products.length === 0) && (
        <div className="col-span-full text-center py-16">
          <p className="text-muted-foreground">No products have been added yet.</p>
        </div>
      )}
    </div>
  );
}
