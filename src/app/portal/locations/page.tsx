'use client'

import TableItemFilter from '@/components/table-item-filter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listDistricts, listLocations, listTalukas } from '@/lib/actions'
import { TLocation } from '@/schemas/location-schema'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Locations() {
  const router = useRouter()
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [selectedTalukas, setSelectedTalukas] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['active'])
  const [search, setSearch] = useState<string>('')
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)

  const locationsQuery = useQuery<TLocation[]>({
    queryKey: ['locations', search, selectedDistricts, selectedTalukas, page, size, selectedStatuses],
    queryFn: () =>
      listLocations({
        search: search,
        districts: selectedDistricts,
        talukas: selectedTalukas,
        statuses: selectedStatuses,
        getAll: false,
        page: page,
        size: size,
      }),
    initialData: [],
  })

  const districtsQuery = useQuery<string[]>({
    queryKey: ['districts'],
    queryFn: () => listDistricts({}),
    initialData: [],
  })

  const talukasQuery = useQuery<string[]>({
    queryKey: ['talukas', selectedDistricts],
    queryFn: () => listTalukas({ districts: selectedDistricts }),
    initialData: [],
  })

  useEffect(() => {
    setSelectedTalukas([])
  }, [selectedDistricts])

  useEffect(() => {
    setSearch('')
  }, [selectedDistricts, selectedTalukas])

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">List of all your locations</p>
        <Link href="/portal/locations/create">
          <Button size={'sm'}>Add</Button>
        </Link>
      </div>

      <div className="my-4" />

      <div className="grid sm:grid-cols-4 gap-2">
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />

        <TableItemFilter
          selectedItems={selectedDistricts}
          setSelectedItems={setSelectedDistricts}
          defaultItemsList={districtsQuery.data ?? []}
          title={'District'}
        />
        <TableItemFilter selectedItems={selectedTalukas} setSelectedItems={setSelectedTalukas} defaultItemsList={talukasQuery.data ?? []} title={'Taluka'} />

        <TableItemFilter selectedItems={selectedStatuses} setSelectedItems={setSelectedStatuses} defaultItemsList={['active', 'inactive']} title={'Status'} />
      </div>

      <div className="my-4" />

      {locationsQuery.isLoading || districtsQuery.isLoading || talukasQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead className="w-1/3">Name</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Taluka</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locationsQuery.data?.map((location, index) => (
              <TableRow
                key={location.id}
                onClick={() => router.push(`/portal/locations/${location.id}`)}
                className={`cursor-pointer ${location.status === 'inactive' ? 'line-through text-red-500' : ''}`}
              >
                <TableCell>{index + 1 + (page - 1) * size}</TableCell>
                <TableCell>{location.name}</TableCell>
                <TableCell>{location.contactNumber}</TableCell>
                <TableCell>{location.district}</TableCell>
                <TableCell>{location.taluka}</TableCell>
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
          disabled={!locationsQuery.data || locationsQuery.data?.length < size}
          className={'disabled:opacity-30'}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
