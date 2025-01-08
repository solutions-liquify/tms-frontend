'use client'

import { GalleryVerticalEnd, Home, MapPin, Package, Package2, User, Users2, LogOut, BookText, Truck } from 'lucide-react'
import Link from 'next/link'
import { redirect, usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { authService } from '@/lib/auth'

// Menu items.
export const items = [
  {
    title: 'Dashboard',
    url: '/portal/dashboard',
    icon: Home,
  },
  {
    title: 'Delivery Orders',
    url: '/portal/delivery-orders',
    icon: Package2,
  },
  {
    title: 'Delivery Challans',
    url: '/portal/delivery-challans',
    icon: BookText,
  },
]

export const metaDataItems = [
  {
    title: 'Locations',
    url: '/portal/locations',
    icon: MapPin,
  },
  {
    title: 'Parties',
    url: '/portal/parties',
    icon: Users2,
  },
  {
    title: 'Transportation',
    url: '/portal/transportation',
    icon: Truck,
  },
  {
    title: 'Materials',
    url: '/portal/materials',
    icon: Package,
  },
  {
    title: 'Employees',
    url: '/portal/employees',
    icon: User,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">TMS Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Metadata</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {metaDataItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname.startsWith(item.url)}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          variant="outline"
          onClick={() => {
            authService.clearTokens()
            redirect('/')
          }}
        >
          Logout
          <LogOut className="size-4" />
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
