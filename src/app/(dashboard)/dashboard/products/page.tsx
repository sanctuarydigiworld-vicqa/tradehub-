
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
import { MoreHorizontal, UploadCloud } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { Product } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';


export default function ProductsPage() {
  const { firestore } = useFirebase();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);

  const productsQuery = user ? collection(firestore, 'products') : null;
  const { data: products, isLoading } = useCollection<Product>(productsQuery as any);

  const seedData = async () => {
    if (!firestore || !user) return;
    setIsSeeding(true);
    try {
      const batch = writeBatch(firestore);
      const productsRef = collection(firestore, 'products');

      initialProducts.forEach(product => {
        const docRef = collection(productsRef).doc();
        batch.set(docRef, { ...product, vendor: user.uid });
      });

      await batch.commit();
      toast({
        title: 'Success!',
        description: 'Placeholder products have been added to your store.',
      });
    } catch (error) {
      console.error("Error seeding data:", error);
      toast({
        title: 'Error',
        description: 'Could not seed placeholder products.',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Products</CardTitle>
          <CardDescription>Manage your product inventory.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={seedData} variant="outline" disabled={isSeeding}>
              <UploadCloud className="mr-2 h-4 w-4" />
              {isSeeding ? 'Seeding...' : 'Seed Products'}
            </Button>
            <Button asChild>
              <Link href="/dashboard/products/new">Add Product</Link>
            </Button>
        </div>
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
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center">Loading products...</TableCell>
              </TableRow>
            )}
            {!isLoading && products && products.map((product) => (
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
                  Just now
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
             {!isLoading && (!products || products.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <p className="font-semibold">No products found.</p>
                  <p className="text-muted-foreground text-sm">Click "Seed Products" to add the default items, or add a new product.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
