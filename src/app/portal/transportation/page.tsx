'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listTransportationCompanies } from '@/lib/actions'
import { TTransportationCompany } from '@/schemas/transportation-company-schema'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import TableItemFilter from '@/components/table-item-filter'

export default function TransportationCompanies() {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['active'])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)

  const transportationCompaniesQuery = useQuery<TTransportationCompany[]>({
    queryKey: ['transportationCompanies', search, selectedStatuses, page, size],
    queryFn: () =>
      listTransportationCompanies({
        search: search,
        statuses: selectedStatuses,
        page: page,
        size: size,
      }),
  })

  if (transportationCompaniesQuery.isError) {
    return <div>Error loading transportation companies. Please try again later.</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">List of all transportation companies</p>
        <Link href="/portal/transportation/create">
          <Button size={'sm'}>Add</Button>
        </Link>
      </div>

      <div className="my-4" />

      <div className="grid sm:grid-cols-4 gap-2">
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:col-span-2" />
        <TableItemFilter selectedItems={selectedStatuses} setSelectedItems={setSelectedStatuses} defaultItemsList={['active', 'inactive']} title={'Status'} />
      </div>

      <div className="my-4" />

      {transportationCompaniesQuery.isLoading ? (
        <div className="flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Company Name</TableHead>
              <TableHead>Point of Contact</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transportationCompaniesQuery.data?.map((company, index) => (
              <TableRow key={company.id} onClick={() => router.push(`/portal/transportation/${company.id}`)} className="cursor-pointer">
                <TableCell>{index + 1 + (page - 1) * size}</TableCell>
                <TableCell className="capitalize">{company.companyName.toLowerCase()}</TableCell>
                <TableCell>{company.pointOfContact}</TableCell>
                <TableCell>{company.contactNumber}</TableCell>
                <TableCell>{company.email}</TableCell>
                <TableCell className="capitalize">{company.status.toLowerCase()}</TableCell>
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
          disabled={!transportationCompaniesQuery.data || transportationCompaniesQuery.data?.length < size}
          className={'disabled:opacity-30'}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
