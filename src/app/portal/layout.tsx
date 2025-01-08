'use client'
import { AppSidebar, items, metaDataItems } from '@/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { authService } from '@/lib/auth'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const fetchAccessToken = async () => {
      const accessToken = await authService.getAccessToken()
      if (!accessToken) {
        router.push('/')
      }
    }
    fetchAccessToken()
  }, [])

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
                if (pathname === '/portal/employees') return 'Employees List'
                if (pathname === '/portal/employees/create') return 'Create Employee'
                if (pathname.startsWith('/portal/employees/')) return 'Employee'
                if (pathname === '/portal/delivery-challans') return 'Delivery Challans List'
                if (pathname === '/portal/delivery-challans/create') return 'Create Delivery Challan'
                if (pathname.startsWith('/portal/delivery-challans/')) return 'Delivery Challan'
                if (pathname === '/portal/transportation') return 'Transportation List'
                if (pathname === '/portal/transportation/create') return 'Create Transportation'
                if (pathname.startsWith('/portal/transportation/')) return 'Transportation'
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
