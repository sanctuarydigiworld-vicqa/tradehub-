
'use client';

import '../globals.css';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CartProvider } from '@/hooks/use-cart.tsx';
import { Toaster } from '@/components/ui/toaster';

export default function AppRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CartProvider>
        <html lang="en" suppressHydrationWarning>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap"
            rel="stylesheet"
            />
        </head>
        <body className={cn('font-body antialiased')}>
            <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            </div>
            <Toaster />
        </body>
        </html>
    </CartProvider>
  );
}
