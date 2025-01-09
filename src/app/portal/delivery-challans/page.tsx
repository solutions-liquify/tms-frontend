'use client'

import StatusBadge from '@/components/status-badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listDeliveryChallans, listParties, listTransportationCompanies } from '@/lib/actions'
import { DeliveryChallanOutputRecord } from '@/schemas/delivery-challan-schema'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { TParty } from '@/schemas/party-schema'
import { TTransportationCompany } from '@/schemas/transportation-company-schema'
import PartyTableFilter from '@/components/party-table-filter'
import TransportationTableFilter from '@/components/transportation-table-filter'

export default function DeliveryChallans() {
  const router = useRouter()

  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [size, setSize] = useState<number>(10)
  const [fromDate, setFromDate] = useState<number | null>(null)
  const [toDate, setToDate] = useState<number | null>(null)
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>([])
  const [selectedTransportationCompanyIds, setSelectedTransportationCompanyIds] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedDeliveryOrderIds, setSelectedDeliveryOrderIds] = useState<string[]>([])

  const partiesQuery = useQuery<TParty[]>({
    queryKey: ['parties'],
    queryFn: () => listParties({ getAll: true }),
    initialData: [],
  })

  const transportationCompaniesQuery = useQuery<TTransportationCompany[]>({
    queryKey: ['transportationCompanies'],
    queryFn: () => listTransportationCompanies({ getAll: true }),
    initialData: [],
  })

  const deliveryChallansQuery = useQuery<DeliveryChallanOutputRecord[]>({
    queryKey: [
      'deliveryChallans',
      search,
      page,
      size,
      fromDate,
      toDate,
      selectedPartyIds,
      selectedTransportationCompanyIds,
      selectedStatuses,
      selectedDeliveryOrderIds,
    ],
    queryFn: () =>
      listDeliveryChallans({
        search: search,
        page: page,
        size: size,
        fromDate: fromDate,
        toDate: toDate,
        partyIds: selectedPartyIds,
        transportationCompanyIds: selectedTransportationCompanyIds,
        statuses: selectedStatuses,
        deliveryOrderIds: selectedDeliveryOrderIds,
        getAll: false,
      }),
  })

  if (deliveryChallansQuery.isError) {
    return <div>Error loading delivery challans. Please try again later.</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">List of all your delivery challans</p>
        <Link href="/portal/delivery-challans/create">
          <Button size={'sm'}>Add</Button>
        </Link>
      </div>

      <div className="my-4" />

      <div className="grid sm:grid-cols-4 gap-4">
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:col-span-3" />

        <p
          className="text-xs text-muted-foreground my-2 hover:cursor-pointer hover:underline"
          onClick={() => {
            setSearch('')
            setFromDate(null)
            setToDate(null)
          }}
        >
          Reset filters
        </p>

        <PartyTableFilter selectedItems={selectedPartyIds} setSelectedItems={setSelectedPartyIds} defaultItemsList={partiesQuery.data || []} title={'Party'} />

        <TransportationTableFilter
          selectedItems={selectedTransportationCompanyIds}
          setSelectedItems={setSelectedTransportationCompanyIds}
          defaultItemsList={transportationCompaniesQuery.data || []}
          title={'Transportation'}
        />

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

      {deliveryChallansQuery.isLoading ? (
        <div className="flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Challan ID</TableHead>
              <TableHead>DO ID</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Transportation</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveryChallansQuery.data?.map((deliveryChallan, index) => (
              <TableRow key={deliveryChallan.id} onClick={() => router.push(`/portal/delivery-challans/${deliveryChallan.id}`)} className="cursor-pointer">
                <TableCell>{index + 1}</TableCell>
                <TableCell>{deliveryChallan.id}</TableCell>
                <TableCell>{deliveryChallan.deliveryOrderId}</TableCell>
                <TableCell>{deliveryChallan.partyName}</TableCell>
                <TableCell>{deliveryChallan.transportationCompanyName}</TableCell>
                <TableCell>{deliveryChallan.totalDeliveringQuantity}</TableCell>
                <TableCell>{deliveryChallan.dateOfChallan ? new Date(deliveryChallan.dateOfChallan * 1000).toLocaleDateString('en-GB') : ''}</TableCell>
                <TableCell>
                  <StatusBadge status={deliveryChallan.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className={'my-4 flex justify-end items-center space-x-2'}>
        <Button onClick={() => setPage(page - 1)} size={'sm'} variant={'outline'} disabled={page === 1} className={'disabled:opacity-30'}>
          Previous
        </Button>
        <p className={'text-xs'}>Page: {page} </p>
        <Button
          onClick={() => setPage(page + 1)}
          size={'sm'}
          variant={'outline'}
          disabled={!deliveryChallansQuery.data || deliveryChallansQuery.data?.length < size}
          className={'disabled:opacity-30'}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
