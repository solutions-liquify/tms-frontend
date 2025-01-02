'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { listDeliveryOrders } from '@/lib/actions'
import { ListDeliveryOrderItem } from '@/schemas/delivery-order-schema'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function DeliveryOrders() {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')

  const deliveryOrdersQuery = useQuery<ListDeliveryOrderItem[]>({
    queryKey: ['deliveryOrders'],
    queryFn: () =>
      listDeliveryOrders({
        search: search,
        page: 1,
        pageSize: 10,
        partyIds: [],
        statuses: [],
      }),
  })

  if (deliveryOrdersQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (deliveryOrdersQuery.isError) {
    return <div>Error loading delivery orders. Please try again later.</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">List of all your delivery orders</p>
        <Link href="/portal/delivery-orders/create">
          <Button size={'sm'}>Add</Button>
        </Link>
      </div>

      <div className="my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr. No.</TableHead>
            <TableHead>Contract ID</TableHead>
            <TableHead>Party ID</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryOrdersQuery.data?.map((deliveryOrder, index) => (
            <TableRow key={deliveryOrder.id} onClick={() => router.push(`/portal/delivery-orders/${deliveryOrder.id}`)} className="cursor-pointer">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{deliveryOrder.contractId}</TableCell>
              <TableCell>{deliveryOrder.partyName}</TableCell>
              <TableCell>{deliveryOrder.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
