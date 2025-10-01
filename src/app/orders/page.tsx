import Link from 'next/link';
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
import { Button } from '@/components/ui/button';
import { orders } from '@/lib/placeholder-data';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OrdersPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>My Orders</CardTitle>
          <CardDescription>A list of all your recent orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.product.name}</TableCell>
                  <TableCell>{order.orderDate}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn({
                        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300': order.status === 'Delivered',
                        'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300': order.status === 'Shipped',
                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300': order.status === 'Processing',
                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300': order.status === 'Placed',
                      })}
                      variant="outline"
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    ${order.product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/orders/${order.id}`}>
                        <ArrowUpRight className="h-4 w-4" />
                        <span className="sr-only">View Order</span>
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
