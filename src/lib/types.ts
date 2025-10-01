import type { ImagePlaceholder } from './placeholder-images';

export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  vendor: string;
  image: ImagePlaceholder;
  features?: string[];
};

export type Order = {
  id: string;
  product: Product;
  buyerName: string;
  orderDate: string;
  status: 'Placed' | 'Processing' | 'Shipped' | 'Delivered';
  trackingNumber?: string;
};

export type Vendor = {
  id: string;
  name: string;
  storeName: string;
  memberSince: string;
  status: 'Active' | 'Pending' | 'Suspended';
};
