import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';
  import { OrderStatus } from '@/components/order-status';
  import { orders } from '@/lib/placeholder-data';
  import Image from 'next/image';
  import { Separator } from '@/components/ui/separator';
  import { notFound } from 'next/navigation';
  
  export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    const order = orders.find(o => o.id === params.id);
  
    if (!order) {
      notFound();
    }
  
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl">Order Details</CardTitle>
            <CardDescription>
              Tracking for order #{order.id}. Placed on {order.orderDate}.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="p-6 bg-secondary/50 rounded-lg">
                <OrderStatus currentStatus={order.status} />
            </div>
            
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 rounded-lg overflow-hidden">
                <Image
                  src={order.product.image.imageUrl}
                  alt={order.product.name}
                  fill
                  sizes="100px"
                  className="object-cover"
                  data-ai-hint={order.product.image.imageHint}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{order.product.name}</h3>
                <p className="text-muted-foreground">{order.product.category}</p>
                <p className="text-lg font-bold text-primary mt-1">${order.product.price.toFixed(2)}</p>
              </div>
            </div>
            
            <Separator />

            <div className="grid sm:grid-cols-2 gap-6 text-sm">
                <div>
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-muted-foreground">
                        {order.buyerName}<br/>
                        123 Market St.<br/>
                        Anytown, USA 12345
                    </p>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">Billing Information</h3>
                    <p className="text-muted-foreground">
                        Same as shipping address<br/>
                        Visa ending in 1234
                    </p>
                </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
              <p className="text-sm text-muted-foreground">Thank you for your purchase!</p>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  export function generateStaticParams() {
    return orders.map((order) => ({
      id: order.id,
    }));
  }
  