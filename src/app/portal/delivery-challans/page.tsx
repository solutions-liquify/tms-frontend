'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listDeliveryChallans } from '@/lib/actions'
import { ListDeliveryChallanOutputRecord } from '@/schemas/delivery-challan-schema'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeliveryChallans() {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [deliveryOrderIds, setDeliveryOrderIds] = useState<string[]>([])

  const deliveryChallansQuery = useQuery<ListDeliveryChallanOutputRecord[]>({
    queryKey: ['deliveryChallans', search, page, size, deliveryOrderIds],
    queryFn: () =>
      listDeliveryChallans({
        search: search,
        page: page,
        size: size,
        deliveryOrderIds: deliveryOrderIds,
      }),
    initialData: [],
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

      <div className={'my-4 flex justify-end items-center space-x-2'}>
        <Button onClick={() => setPage(page - 1)} size={'sm'} variant={'outline'} disabled={page === 1} className={'disabled:opacity-30'}>
          Previous
        </Button>
        <p className={'text-xs'}>Page: {page} </p>
        <Button
          onClick={() => setPage(page + 1)}
          size={'sm'}
          variant={'outline'}
          disabled={deliveryChallansQuery.data?.length < size}
          className={'disabled:opacity-30'}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
