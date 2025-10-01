'use client';

import { cn } from "@/lib/utils";
import { CheckCircle, Loader, Truck, Home } from "lucide-react";

const statuses = [
  { id: 'Placed', name: 'Order Placed', icon: CheckCircle },
  { id: 'Processing', name: 'Processing', icon: Loader },
  { id: 'Shipped', name: 'Shipped', icon: Truck },
  { id: 'Delivered', name: 'Delivered', icon: Home },
];

type OrderStatusProps = {
  currentStatus: 'Placed' | 'Processing' | 'Shipped' | 'Delivered';
};

export function OrderStatus({ currentStatus }: OrderStatusProps) {
  const currentStatusIndex = statuses.findIndex(s => s.id === currentStatus);

  return (
    <div className="w-full">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {statuses.map((status, statusIdx) => (
            <li key={status.name} className={cn("relative", statusIdx !== statuses.length - 1 ? "flex-1" : "")}>
              <>
                {statusIdx <= currentStatusIndex ? (
                  <div className="flex items-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <status.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-primary">{status.name}</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-border bg-card">
                      <status.icon className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
                    </span>
                    <span className="ml-4 text-sm font-medium text-muted-foreground">{status.name}</span>
                  </div>
                )}

                {statusIdx < statuses.length - 1 ? (
                  <div className="absolute inset-0 top-5 left-5 -z-10 h-0.5 w-full bg-border" aria-hidden="true">
                    {statusIdx < currentStatusIndex && <div className="h-full w-full bg-primary" />}
                  </div>
                ) : null}
              </>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
