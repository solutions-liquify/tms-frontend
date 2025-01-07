'use client'

import StatusBadge from '@/components/status-badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listDeliveryOrders, listParties } from '@/lib/actions'
import { DeliveryOrderRecord } from '@/schemas/delivery-order-schema'
import { TParty } from '@/schemas/party-schema'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import PartyTableFilter from '@/components/party-table-filter'
import TableItemFilter from '@/components/table-item-filter'

export default function DeliveryOrders() {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [page, setPage] = useState<number>(1)
  const [size, setSize] = useState<number>(10)
  const [fromDate, setFromDate] = useState<number | null>(null)
  const [toDate, setToDate] = useState<number | null>(null)

  const deliveryOrdersQuery = useQuery<DeliveryOrderRecord[]>({
    queryKey: ['deliveryOrders', search, selectedPartyIds, selectedStatuses, page, size, fromDate, toDate],
    queryFn: () =>
      listDeliveryOrders({
        search: search,
        page: page,
        size: size,
        partyIds: selectedPartyIds,
        statuses: selectedStatuses,
        fromDate: fromDate,
        toDate: toDate,
      }),
    initialData: [],
  })

  const partiesQuery = useQuery<TParty[]>({
    queryKey: ['parties'],
    queryFn: () => listParties({ getAll: true }),
    initialData: [],
  })

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

      <div className="grid sm:grid-cols-4 gap-2">
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:col-span-4" />

        <TableItemFilter
          selectedItems={selectedStatuses}
          setSelectedItems={setSelectedStatuses}
          defaultItemsList={['delivered', 'pending', 'cancelled']}
          title={'Status'}
        />

        <PartyTableFilter selectedItems={selectedPartyIds} setSelectedItems={setSelectedPartyIds} defaultItemsList={partiesQuery.data || []} title={'Party'} />

        <Input
          type={'date'}
          value={fromDate ? new Date(fromDate * 1000).toISOString().split('T')[0] : ''}
          onChange={(e) => setFromDate(Math.floor(new Date(e.target.value).getTime() / 1000))}
        />

        <Input
          type={'date'}
          value={toDate ? new Date(toDate * 1000).toISOString().split('T')[0] : ''}
          onChange={(e) => setToDate(Math.floor(new Date(e.target.value).getTime() / 1000))}
        />
      </div>

      <div className="my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr. No.</TableHead>
            <TableHead>DO ID</TableHead>
            <TableHead>Contract ID</TableHead>
            <TableHead>Party</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Date of Contract</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryOrdersQuery.data?.map((deliveryOrder, index) => (
            <TableRow key={deliveryOrder.id} onClick={() => router.push(`/portal/delivery-orders/${deliveryOrder.id}`)} className="cursor-pointer">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{deliveryOrder.id}</TableCell>
              <TableCell>{deliveryOrder.contractId}</TableCell>
              <TableCell>{deliveryOrder.partyName}</TableCell>
              <TableCell>
                {deliveryOrder.grandTotalQuantity} |<span className="text-green-500"> {deliveryOrder.grandTotalDeliveredQuantity}</span>
              </TableCell>
              <TableCell>{deliveryOrder.dateOfContract ? new Date(deliveryOrder.dateOfContract * 1000).toLocaleDateString('en-GB') : ''}</TableCell>
              <TableCell>
                <StatusBadge status={deliveryOrder.status} />
              </TableCell>
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
          disabled={!deliveryOrdersQuery.data || deliveryOrdersQuery.data?.length < size}
          className={'disabled:opacity-30'}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
