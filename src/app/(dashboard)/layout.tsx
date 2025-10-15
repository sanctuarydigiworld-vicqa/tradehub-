
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import '../globals.css';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase';


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
    <FirebaseClientProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=PT+Sans:wght@400;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className={cn('font-body antialiased bg-muted/40')}>
          {children}
          <Toaster />
        </body>
      </html>
    </FirebaseClientProvider>
  );
}
