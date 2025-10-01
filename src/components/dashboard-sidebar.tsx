'use client';

import React from 'react';
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
  Store,
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
import { Separator } from './ui/separator';

const vendorNavItems = [
  { href: '/', icon: Store, label: 'View Store' },
  { href: '/dashboard', icon: Home, label: 'Overview' },
  { href: '/dashboard/products', icon: ShoppingBag, label: 'Products' },
  { href: '/dashboard/products/new', icon: Bot, label: 'AI Tools' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

const adminNavItems = [
    { href: '/', icon: Store, label: 'View Site' },
    { href: '/admin', icon: Users, label: 'Vendors', badge: 3 },
    { href: '/admin/moderation', icon: ShieldCheck, label: 'Moderation', badge: 1 },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

function MobileHeader() {
    return (
      <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
        <SidebarTrigger className="text-foreground">
          <PanelLeft />
          <span className="sr-only">Toggle Sidebar</span>
        </SidebarTrigger>
      </header>
    );
  }

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const navItems = vendorNavItems; 
  const pathname = usePathname();

  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                 <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
                    <Package className="h-6 w-6 text-sidebar-primary" />
                    <span className="group-data-[collapsible=icon]:hidden">Dashboard</span>
                </Link>
                <SidebarTrigger className="ml-auto text-sidebar-foreground hidden md:flex">
                    <PanelLeft />
                </SidebarTrigger>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                {navItems.map((item, index) => (
                    <React.Fragment key={item.href}>
                    {index === 1 && <Separator className='my-2 bg-sidebar-border'/>}
                    <SidebarMenuItem>
                    <Link href={item.href} target={item.href.startsWith('/') ? '_self' : '_blank'}>
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
                    </React.Fragment>
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
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <MobileHeader />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
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
         <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <Sidebar>
            <SidebarHeader>
                <div className="flex items-center gap-2">
                 <Link href="/admin" className="flex items-center gap-2 font-semibold text-sidebar-foreground">
                    <Package className="h-6 w-6 text-sidebar-primary" />
                    <span className="group-data-[collapsible=icon]:hidden">Admin Panel</span>
                </Link>
                <SidebarTrigger className="ml-auto text-sidebar-foreground hidden md:flex">
                    <PanelLeft />
                </SidebarTrigger>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                {navItems.map((item, index) => (
                     <React.Fragment key={item.href}>
                     {index === 1 && <Separator className='my-2 bg-sidebar-border'/>}
                    <SidebarMenuItem>
                    <Link href={item.href} target={item.href.startsWith('/') ? '_self' : '_blank'}>
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
                    </React.Fragment>
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
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <MobileHeader />
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
      </SidebarProvider>
    );
  }
