import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import { cn } from '@/lib/utils';


export const metadata: Metadata = {
  title: 'TradeFlow Dashboard',
  description: 'Manage your TradeFlow store.',
};

export default function DashboardRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={cn('font-body antialiased')}>
        {children}
        <Toaster />
    </div>
  );
}
