import type { Category, Product, Order, Vendor } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const categories: Category[] = [
  { id: '1', name: "Church Supplies" },
  { id: '2', name: "Sacramentals" },
  { id: '3', name: "Books & Bibles" },
  { id: '4', name: "Electronics" },
  { id: '5', name: "Ladies' Fashion" },
  { id: '6', name: "Gents' Fashion" },
  { id: '7', name: "Beddings" },
  { id: '8', name: "Shoes" },
  { id: '9', name: "Jewelry" },
];

export const products: Product[] = [
  { id: '1', name: 'Hand-carved Rosary', description: 'Beautiful olive wood rosary, hand-carved in Bethlehem.', price: 29.99, category: "Sacramentals", vendor: 'Holy Land Crafts', image: PlaceHolderImages[0], features: ['Olive wood', 'Hand-carved', 'Crucifix included'] },
  { id: '2', name: 'Leather-bound Study Bible', description: 'King James Version study bible with genuine leather cover and gold-leaf pages.', price: 79.99, category: "Books & Bibles", vendor: 'Scripture Press', image: PlaceHolderImages[1], features: ['Genuine leather', 'Gold-leaf pages', 'Study notes'] },
  { id: '3', name: 'Chic Leather Handbag', description: 'A stylish and versatile leather handbag for the modern woman.', price: 120.00, category: "Ladies' Fashion", vendor: 'Vogue Accessories', image: PlaceHolderImages[2], features: ['Italian leather', 'Multiple compartments', 'Gold-plated hardware'] },
  { id: '4', name: 'Pixel 10 Pro', description: 'The latest smartphone with a stunning display and pro-grade camera system.', price: 999.00, category: "Electronics", vendor: 'TechGiant', image: PlaceHolderImages[3], features: ['120Hz OLED display', '50MP primary camera', '5G connectivity'] },
  { id: '5', name: 'Classic Oxford Shirt', description: 'A timeless white oxford shirt for any formal or casual occasion.', price: 65.00, category: "Gents' Fashion", vendor: 'Gentleman\'s Attire', image: PlaceHolderImages[4], features: ['100% cotton', 'Button-down collar', 'Slim fit'] },
  { id: '6', name: 'Egyptian Cotton Bed Set', description: 'Luxurious 1000 thread count Egyptian cotton bed set for ultimate comfort.', price: 250.00, category: "Beddings", vendor: 'Sleep Haven', image: PlaceHolderImages[5], features: ['1000 thread count', 'Egyptian cotton', 'Includes duvet cover and pillowcases'] },
  { id: '7', name: 'Pro-Runner X1 Shoes', description: 'Lightweight and responsive running shoes for professional athletes.', price: 150.00, category: "Shoes", vendor: 'Athletic Co.', image: PlaceHolderImages[6], features: ['Carbon-fiber plate', 'Breathable mesh upper', 'High-rebound foam'] },
  { id: '8', name: 'Diamond Solitaire Necklace', description: 'An elegant necklace featuring a 1-carat brilliant-cut diamond.', price: 2500.00, category: "Jewelry", vendor: 'Luxe Gems', image: PlaceHolderImages[7], features: ['1-carat diamond', '18k white gold chain', 'Certified'] },
  { id: '9', name: 'Silver-plated Chalice', description: 'An ornate silver-plated chalice for liturgical use.', price: 350.00, category: "Church Supplies", vendor: 'Altar Essentials', image: PlaceHolderImages[8], features: ['Silver-plated brass', 'Engraved patterns', 'High-polish finish'] },
];

export const orders: Order[] = [
    {
      id: 'ORD-001',
      product: products[1],
      buyerName: 'Alice Johnson',
      orderDate: '2023-10-15',
      status: 'Delivered',
      trackingNumber: '1Z999AA10123456789',
    },
    {
      id: 'ORD-002',
      product: products[3],
      buyerName: 'Bob Williams',
      orderDate: '2023-10-28',
      status: 'Shipped',
      trackingNumber: '1Z999AA10198765432',
    },
    {
        id: 'ORD-003',
        product: products[6],
        buyerName: 'Charlie Brown',
        orderDate: '2023-11-01',
        status: 'Processing',
    }
  ];

export const vendors: Vendor[] = [
    { id: 'V001', name: 'John Smith', storeName: 'Holy Land Crafts', memberSince: '2022-01-15', status: 'Active' },
    { id: 'V002', name: 'Jane Doe', storeName: 'Scripture Press', memberSince: '2022-03-20', status: 'Active' },
    { id: 'V003', name: 'Peter Jones', storeName: 'Vogue Accessories', memberSince: '2023-05-10', status: 'Pending' },
    { id: 'V004', name: 'Mary Garcia', storeName: 'TechGiant', memberSince: '2021-11-01', status: 'Active' },
    { id: 'V005', name: 'James Miller', storeName: 'Gentleman\'s Attire', memberSince: '2023-08-02', status: 'Suspended' },
]
