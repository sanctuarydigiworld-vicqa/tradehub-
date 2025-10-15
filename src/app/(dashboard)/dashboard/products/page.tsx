
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
import { MoreHorizontal, Trash2, UploadCloud, Pencil } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { Product } from '@/lib/types';
import { useUser, useFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { collection, writeBatch, doc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMemoFirebase } from '@/firebase/provider';


export default function ProductsPage() {
  const { firestore } = useFirebase();
  const { user } = useUser();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const productsQuery = useMemoFirebase(() => {
    if (firestore && user) {
        // Query products created by the current user
        // Note: This requires a Firestore index. The app will prompt you to create it if it doesn't exist.
        // return query(collection(firestore, 'products'), where('vendor', '==', user.uid));
        // For simplicity now, we fetch all products. In a multi-vendor app, you'd filter by user.uid
        return collection(firestore, 'products');
    }
    return null;
  }, [firestore, user]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  const seedData = async () => {
    if (!firestore || !user) {
        toast({
            title: 'Error',
            description: 'You must be logged in to seed data.',
            variant: 'destructive'
        });
        return;
    };
    setIsSeeding(true);
    try {
      const batch = writeBatch(firestore);
      const productsCol = collection(firestore, 'products');

      initialProducts.forEach(product => {
        // Create a new document reference for each placeholder product
        const docRef = doc(productsCol, product.id);
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

  const handleDeleteProduct = async () => {
    if (!firestore || !productToDelete) return;
    setIsDeleting(true);

    try {
        const docRef = doc(firestore, 'products', productToDelete.id);
        await deleteDoc(docRef);
        toast({
            title: 'Product Deleted',
            description: `${productToDelete.name} has been successfully removed.`,
        });
        setProductToDelete(null);
    } catch (error) {
        console.error('Error deleting product:', error);
        toast({
            title: 'Error Deleting Product',
            description: 'There was a problem deleting the product.',
            variant: 'destructive'
        });
    } finally {
        setIsDeleting(false);
    }
  }


  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Products</CardTitle>
          <CardDescription>Manage your product inventory.</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Button onClick={seedData} variant="outline" disabled={isSeeding || (products && products.length > 0)}>
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
              <TableHead className="hidden md:table-cell">Category</TableHead>
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
                  {product.category}
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
                      <DropdownMenuItem asChild>
                          <Link href={`/dashboard/products/edit/${product.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setProductToDelete(product)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
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
     <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                product <span className="font-semibold">{productToDelete?.name}</span> and remove its data from our servers.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} disabled={isDeleting} className="bg-destructive hover:bg-destructive/90">
                {isDeleting ? 'Deleting...' : 'Yes, delete it'}
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
