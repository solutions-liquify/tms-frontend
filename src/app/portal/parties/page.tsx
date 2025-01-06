'use client'

import TableItemFilter from '@/components/employee-table-item-filter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listParties } from '@/lib/actions'
import { TParty } from '@/schemas/party-schema'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Parties() {
  const router = useRouter()

  const [search, setSearch] = useState<string>('')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['active'])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)

  const partiesQuery = useQuery<TParty[]>({
    queryKey: ['parties', search, selectedStatuses, page, size],
    queryFn: () =>
      listParties({
        search: search,
        statuses: selectedStatuses,
        page: page,
        size: size,
        getAll: false,
      }),
    initialData: [],
  })

  if (partiesQuery.isError) {
    return <div>Error loading parties. Please try again later.</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">List of all your parties</p>
        <Link href="/portal/parties/create">
          <Button size={'sm'}>Add</Button>
        </Link>
      </div>

      <div className="my-4" />

      <div className="grid sm:grid-cols-4 gap-2">
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:col-span-2" />
        <TableItemFilter selectedItems={selectedStatuses} setSelectedItems={setSelectedStatuses} defaultItemsList={['active', 'inactive']} title={'Status'} />
      </div>

      <div className="my-4" />

      {partiesQuery.isLoading ? (
        <div className="flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>POC</TableHead>
              <TableHead>Contact Number</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {partiesQuery.data?.map((party, index) => (
              <TableRow
                key={party.id}
                onClick={() => router.push(`/portal/parties/${party.id}`)}
                className={`cursor-pointer ${party.status === 'inactive' ? 'line-through text-red-500' : ''}`}
              >
                <TableCell>{index + 1 + (page - 1) * size}</TableCell>
                <TableCell>{party.name}</TableCell>
                <TableCell>{party.pointOfContact || '-'}</TableCell>
                <TableCell>{party.contactNumber || '-'}</TableCell>
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
          disabled={!partiesQuery.data || partiesQuery.data?.length < size}
          className={'disabled:opacity-30'}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
