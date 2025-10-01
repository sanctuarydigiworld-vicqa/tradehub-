import Link from 'next/link';
import { Package } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-secondary-foreground border-t">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline text-lg">
                VicqaTradeHub
              </span>
            </Link>
            <p className="text-sm">
              A modern marketplace for vendors and buyers.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/dashboard/products" className="hover:text-primary transition-colors">Products</Link>
              <Link href="/register" className="hover:text-primary transition-colors">Become a Vendor</Link>
              <Link href="/login" className="hover:text-primary transition-colors">Login</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link href="#" className="hover:text-primary transition-colors">FAQ</Link>
              <Link href="#" className="hover:text-primary transition-colors">Contact Us</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Stay Connected</h4>
            <p className="text-sm">
                Follow us on social media for the latest updates.
            </p>
             {/* Add social media icons here later */}
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {year} VicqaTradeHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
