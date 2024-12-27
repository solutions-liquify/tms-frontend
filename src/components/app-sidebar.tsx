'use client'

import { Home, MapPin, Package, Users2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

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
    icon: Package,
  },
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
    title: 'Materials',
    url: '/portal/materials',
    icon: Package,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>TMS Portal</SidebarGroupLabel>
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
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
