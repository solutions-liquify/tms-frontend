'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { listDeliveryChallans } from '@/lib/actions'
import { ListDeliveryChallanOutputRecord } from '@/schemas/delivery-challan-schema'
import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function DeliveryChallans() {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')

  const deliveryChallansQuery = useQuery<ListDeliveryChallanOutputRecord[]>({
    queryKey: ['deliveryChallans'],
    queryFn: () =>
      listDeliveryChallans({
        search: search,
        page: 1,
        size: 10,
        deliveryOrderIds: ['ffcdfabb-8124-4654-a60c-72c32b631129'],
      }),
  })

  if (deliveryChallansQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (deliveryChallansQuery.isError) {
    return <div>Error loading delivery challans. Please try again later.</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">List of all your delivery challans</p>
      </div>

      <div className="my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr. No.</TableHead>
            <TableHead>Delivery Order</TableHead>
            <TableHead>Party Name</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead className="text-center">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryChallansQuery.data?.map((deliveryChallan, index) => (
            <TableRow key={deliveryChallan.id} onClick={() => router.push(`/portal/delivery-challans/${deliveryChallan.id}`)} className="cursor-pointer">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{deliveryChallan.deliveryOrderId}</TableCell>
              <TableCell>{deliveryChallan.partyName}</TableCell>
              <TableCell>{deliveryChallan.totalDeliveringQuantity}</TableCell>
              <TableCell className="text-center capitalize">{deliveryChallan.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
