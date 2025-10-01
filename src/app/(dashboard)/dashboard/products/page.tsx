'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { products as initialProducts } from '@/lib/placeholder-data';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    try {
      const localProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const combinedProducts = [...initialProducts];
      
      localProducts.forEach((localProduct: any) => {
          if(!combinedProducts.find(p => p.id === localProduct.id)) {
            // Mapping local storage structure to Product type
            combinedProducts.push({
              id: localProduct.id,
              name: localProduct.name,
              description: localProduct.description || '',
              price: localProduct.price || 0,
              category: localProduct.category || 'Uncategorized',
              vendor: 'Current Vendor',
              image: {
                id: localProduct.id,
                imageUrl: localProduct.image, // The data URI from localStorage
                imageHint: 'custom product',
                description: localProduct.name
              }
            });
          }
      });
      // By using a function with setProducts, we ensure we have the latest state.
      setProducts(prevProducts => {
          const productMap = new Map();
          [...initialProducts, ...localProducts.map((localProduct: any) => ({
                id: localProduct.id,
                name: localProduct.name,
                description: localProduct.description || '',
                price: parseFloat(localProduct.price || 0),
                category: localProduct.category || 'Uncategorized',
                vendor: 'Current Vendor',
                image: {
                  id: localProduct.id,
                  imageUrl: localProduct.image,
                  imageHint: 'custom product',
                  description: localProduct.name
                }
          }))].forEach(p => productMap.set(p.id, p));
          return Array.from(productMap.values());
      });
    } catch(e) {
      console.error("Could not parse products from local storage", e);
      setProducts(initialProducts);
    }
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Products</CardTitle>
          <CardDescription>Manage your product inventory.</CardDescription>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">Add Product</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt={product.name}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={product.image.imageUrl}
                    width="64"
                    data-ai-hint={product.image.imageHint}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">Active</Badge>
                </TableCell>
                <TableCell>GH₵{product.price.toFixed(2)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  2023-07-12 10:42 AM
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>              
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
