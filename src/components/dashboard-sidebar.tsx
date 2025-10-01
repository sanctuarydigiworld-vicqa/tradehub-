

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Package,
  Home,
  ShoppingBag,
  Users,
  Settings,
  Bot,
  ShieldCheck,
  PanelLeft,
  Badge,
} from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import Header from './header';

type DashboardSidebarProps = {
  userType: 'vendor' | 'admin';
};

const vendorNavItems = [
  { href: '/dashboard', icon: Home, label: 'Overview' },
  { href: '/dashboard/products', icon: ShoppingBag, label: 'Products' },
  { href: '/dashboard/products/new', icon: Bot, label: 'AI Tools' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const adminNavItems = [
  { href: '/admin', icon: Users, label: 'Vendors', badge: 3 },
  { href: '/admin/moderation', icon: ShieldCheck, label: 'Moderation', badge: 1 },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

function MobileHeader() {
    return (
      <header className="md:hidden sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
        <SidebarTrigger className="text-foreground">
          <PanelLeft />
          <span className="sr-only">Toggle Sidebar</span>
        </SidebarTrigger>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <Package className="h-6 w-6 text-primary" />
            <span className="">VicqaTradeHub</span>
        </Link>
      </header>
    );
  }

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  // For this template, we assume a vendor role.
  // In a real app, you'd determine this from user authentication.
  const navItems = vendorNavItems; 
  const pathname = usePathname();

  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col">
            <div className='hidden md:block'>
                <Header />
            </div>
            <MobileHeader />
            <div className="flex-1 md:grid md:grid-cols-[auto_1fr]">
                <Sidebar>
                <SidebarHeader className='hidden md:flex'>
                    <div className="flex items-center gap-2">
                    <SidebarTrigger className="text-sidebar-foreground">
                        <PanelLeft />
                    </SidebarTrigger>
                    <h1 className="text-lg font-headline font-semibold">Dashboard</h1>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                        <Link href={item.href}>
                            <SidebarMenuButton
                            isActive={pathname === item.href}
                            tooltip={item.label}
                            >
                            <item.icon />
                            <span>{item.label}</span>
                            {item.badge && <Badge className="ml-auto">{item.badge}</Badge>}
                            </SidebarMenuButton>
                        </Link>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                        variant="ghost"
                        className="group/menu-button flex w-full items-center justify-start gap-2 overflow-hidden rounded-md p-2 text-left text-sm"
                        >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://picsum.photos/seed/avatar/100" />
                            <AvatarFallback>V</AvatarFallback>
                        </Avatar>
                        <div className="truncate group-data-[collapsible=icon]:hidden">
                            <p className="font-medium">Vendor Name</p>
                            <p className="text-xs text-muted-foreground">
                            vendor@example.com
                            </p>
                        </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Support</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
                </Sidebar>
                <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-secondary/50">
                {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  );
}

export function AdminDashboardSidebar({ children }: { children: React.ReactNode }) {
    const navItems = adminNavItems;
    const pathname = usePathname();
  
    return (
      <SidebarProvider>
         <div className="flex min-h-screen w-full flex-col">
            <div className='hidden md:block'>
                <Header />
            </div>
            <MobileHeader />
            <div className="flex-1 md:grid md:grid-cols-[auto_1fr]">
                <Sidebar>
                <SidebarHeader className="hidden md:flex">
                    <div className="flex items-center gap-2">
                    <SidebarTrigger className="text-sidebar-foreground">
                        <PanelLeft />
                    </SidebarTrigger>
                    <h1 className="text-lg font-headline font-semibold">Admin Panel</h1>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                    {navItems.map((item) => (
                        <SidebarMenuItem key={item.href}>
                        <Link href={item.href}>
                            <SidebarMenuButton
                            isActive={pathname === item.href}
                            tooltip={item.label}
                            >
                            <item.icon />
                            <span>{item.label}</span>
                            {item.badge && <Badge className={cn("ml-auto", pathname === item.href ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground" )}>{item.badge}</Badge>}
                            </SidebarMenuButton>
                        </Link>
                        </SidebarMenuItem>
                    ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                        variant="ghost"
                        className="group/menu-button flex w-full items-center justify-start gap-2 overflow-hidden rounded-md p-2 text-left text-sm"
                        >
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="https://picsum.photos/seed/admin-avatar/100" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>
                        <div className="truncate group-data-[collapsible=icon]:hidden">
                            <p className="font-medium">Admin User</p>
                            <p className="text-xs text-muted-foreground">
                            admin@VicqaTradeHub.com
                            </p>
                        </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="start" className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarFooter>
                </Sidebar>
                <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-secondary/50">
                    {children}
                </main>
            </div>
        </div>
      </SidebarProvider>
    );
  }
