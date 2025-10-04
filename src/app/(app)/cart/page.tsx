
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Trash2, ShoppingCart, Tag } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart.tsx';
import { usePaystackPayment } from 'react-paystack';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

const COUPONS = [
  { code: 'SAVE10', type: 'percentage', value: 10 },
  { code: 'VICQA20', type: 'fixed', value: 20 },
];


export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const { toast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = customer.name && customer.email && customer.phone && customer.address;

  const cartSubtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingFee = 5.00;
  const cartTotal = cartSubtotal + shippingFee - discount;

  const config = {
    reference: (new Date()).getTime().toString(),
    email: customer.email,
    amount: Math.round(cartTotal * 100),
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_fbad5dcf56a1f9c927b19b1fb64fff73a688b8a3',
    currency: 'GHS',
     metadata: {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      cart: JSON.stringify(cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity }))),
    },
  };

  const initializePayment = usePaystackPayment(config);


  const onPaymentSuccess = (reference: any) => {
    toast({
      title: 'Payment Successful',
      description: `Your payment was successful. Reference: ${reference.reference}`,
    });
    clearCart();
    // Here you would typically save the order to your database
  };

  const onPaymentClose = () => {
    toast({
      title: 'Payment Canceled',
      description: 'You closed the payment popup.',
      variant: 'destructive',
    });
  };

  const handleApplyCoupon = () => {
    const coupon = COUPONS.find(c => c.code.toUpperCase() === couponCode.toUpperCase());

    if (coupon) {
      let discountValue = 0;
      if (coupon.type === 'percentage') {
        discountValue = (cartSubtotal * coupon.value) / 100;
      } else {
        discountValue = coupon.value;
      }
      setDiscount(discountValue);
      setAppliedCoupon(coupon.code);
      toast({
        title: 'Coupon Applied!',
        description: `You've received a discount of GH₵${discountValue.toFixed(2)}.`,
      });
    } else {
      setDiscount(0);
      setAppliedCoupon('');
      toast({
        title: 'Invalid Coupon',
        description: 'The coupon code you entered is not valid.',
        variant: 'destructive',
      });
    }
  };


  if (cart.length === 0) {
    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 text-center">
            <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
            <h1 className="mt-4 text-3xl font-bold">Your Cart is Empty</h1>
            <p className="mt-2 text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild className="mt-6">
                <Link href="/products">Start Shopping</Link>
            </Button>
        </div>
    )
  }

  const handleCheckout = () => {
    if (!isFormValid) {
        toast({
            title: 'Missing Information',
            description: 'Please fill out all customer details before checking out.',
            variant: 'destructive'
        });
        return;
    }
    const freshConfig = {
        ...config,
        reference: (new Date()).getTime().toString(),
        email: customer.email,
        amount: Math.round(cartTotal * 100),
        metadata: {
            name: customer.name,
            phone: customer.phone,
            address: customer.address,
            cart: JSON.stringify(cart.map(item => ({ id: item.id, name: item.name, quantity: item.quantity }))),
        },
    };
    initializePayment({onSuccess: onPaymentSuccess, onClose: onPaymentClose, config: freshConfig});
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] hidden sm:table-cell">Product</TableHead>
                    <TableHead></TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead><span className="sr-only">Remove</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          src={item.image.imageUrl}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="rounded-md object-cover"
                          data-ai-hint={item.image.imageHint}
                        />
                      </TableCell>
                       <TableCell className="font-medium">
                        <Link href={`/products/${item.id}`} className="hover:text-primary">{item.name}</Link>
                       </TableCell>
                      <TableCell>GH₵{item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10))}
                          className="w-20 mx-auto text-center"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        GH₵{(item.price * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-8">
           <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Please provide your details for delivery.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="John Doe" value={customer.name} onChange={handleCustomerChange} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="you@example.com" value={customer.email} onChange={handleCustomerChange} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="+233 12 345 6789" value={customer.phone} onChange={handleCustomerChange} required />
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input id="address" name="address" placeholder="123 Market St, Accra" value={customer.address} onChange={handleCustomerChange} required />
                </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>Review your order before checkout.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
               <div className="flex items-center gap-2">
                <Input 
                  placeholder="Coupon Code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={!!appliedCoupon}
                />
                <Button onClick={handleApplyCoupon} disabled={!couponCode || !!appliedCoupon}>
                  Apply
                </Button>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GH₵{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>GH₵{shippingFee.toFixed(2)}</span>
              </div>
                {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon})</span>
                  <span>-GH₵{discount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>GH₵{cartTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" size="lg" onClick={handleCheckout} disabled={!isFormValid}>
                  Proceed to Checkout
                </Button>
                <Button asChild variant="outline" className="w-full">
                    <Link href="/products">Continue Shopping</Link>
                </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
