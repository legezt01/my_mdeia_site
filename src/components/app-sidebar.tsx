
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bot,
  Bookmark,
  FileText,
  Gamepad2,
  Image as ImageIcon,
  Lock,
  LogOut,
  Music,
  Settings,
  User,
  Youtube,
  Newspaper,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarHeader
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { href: '/', label: 'Trending News', icon: Newspaper },
  { href: '/legezttube', label: 'LegeztTube', icon: Youtube },
  { href: '/legeztify', label: 'Legeztify', icon: Music },
  { href: '/legezterest', label: 'Legezterest', icon: ImageIcon },
  { href: '/ai-chat', label: 'AI Chat', icon: Bot },
  { href: '/pdf-ai', label: 'PDF AI', icon: FileText },
  { href: '/profile', label: 'Dashboard', icon: User },
  { href: '/saved', label: 'Saved Content', icon: Bookmark },
  { href: '/games', label: 'LegeztPlay', icon: Gamepad2 },
];

const bottomMenuItems = [
    { href: '/settings', label: 'Settings', icon: Settings },
    { href: '/lock', label: 'App Lock', icon: Lock },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarHeader className="p-2 justify-center">
        <Link href="/" className="flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-8 w-8 text-primary"
            >
                <path d="M4 4h12v4H8v12H4V4z" />
            </svg>
            <h1 className="font-headline text-2xl font-bold group-data-[collapsible=icon]:hidden">Legezt</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-0">
        <SidebarMenu className="px-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    className="w-full"
                    tooltip={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="truncate">{item.label}</span>
                  </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-0">
        <SidebarMenu className="px-2">
            {bottomMenuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                    <Link href={item.href}>
                        <SidebarMenuButton
                            isActive={pathname.startsWith(item.href)}
                            className="w-full"
                            tooltip={item.label}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="truncate">{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
            <Separator className="my-2" />
            <SidebarMenuItem>
                <Link href="/logout">
                    <SidebarMenuButton className="w-full" tooltip="Logout">
                        <LogOut className="h-5 w-5" />
                        <span className="truncate">Logout</span>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
