
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

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  // For this template, we assume a vendor role.
  // In a real app, you'd determine this from user authentication.
  const navItems = vendorNavItems; 
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="md:flex">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <SidebarTrigger>
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
        <main className="flex-1 bg-secondary/50 p-4 md:p-6 lg:p-8 ml-0 md:ml-[3rem] group-data-[state=expanded]:md:ml-[16rem] transition-[margin-left] duration-200 ease-linear">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}

export function AdminDashboardSidebar({ children }: { children: React.ReactNode }) {
    const navItems = adminNavItems;
    const pathname = usePathname();
  
    return (
      <SidebarProvider>
        <div className="md:flex">
            <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                  <SidebarTrigger>
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
            <main className="flex-1 bg-secondary/50 p-4 pt-20 md:p-6 lg:p-8 ml-0 md:ml-[3rem] group-data-[state=expanded]:md:ml-[16rem] transition-[margin-left] duration-200 ease-linear">
            {children}
            </main>
        </div>
      </SidebarProvider>
    );
  }
