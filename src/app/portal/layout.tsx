'use client'
import { AppSidebar, items, metaDataItems } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="font-semibold">
              {(() => {
                if (pathname === '/portal/parties') return 'Parties List'
                if (pathname === '/portal/parties/create') return 'Create Party'
                if (pathname.startsWith('/portal/parties/')) return 'Party'
                if (pathname === '/portal/locations') return 'Locations List'
                if (pathname === '/portal/locations/create') return 'Create Location'
                if (pathname.startsWith('/portal/locations/')) return 'Location'
                if (pathname === '/portal/materials') return 'Materials List'
                if (pathname === '/portal/materials/create') return 'Create Material'
                if (pathname.startsWith('/portal/materials/')) return 'Material'
                if (pathname === '/portal/delivery-orders') return 'Delivery Orders List'
                if (pathname === '/portal/delivery-orders/create') return 'Create Delivery Order'
                if (pathname.startsWith('/portal/delivery-orders/')) return 'Delivery Order'
                if (pathname === '/portal/dashboard') return 'Dashboard'
                return [...items, ...metaDataItems].find((item) => pathname.startsWith(item.url))?.title
              })()}
            </h1>
          </header>
          <Separator />
          <div className="p-4">{children}</div>
        </SidebarInset>
      </main>
    </SidebarProvider>
  )
}
