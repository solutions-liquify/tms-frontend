'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { listLocations } from '@/lib/actions'
import { TLocation } from '@/schemas/location-schema'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'

export default function Locations() {
  const router = useRouter()
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [selectedTalukas, setSelectedTalukas] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [search, setSearch] = useState<string>('')

  const locationsQuery = useQuery<TLocation[]>({
    queryKey: ['locations'],
    queryFn: () =>
      listLocations({
        search: search,
        states: selectedStates,
        districts: selectedDistricts,
        talukas: selectedTalukas,
        cities: selectedCities,
      }),
  })

  if (locationsQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (locationsQuery.isError) {
    return <div>Error loading locations. Please try again later.</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">List of all your locations</p>
        <Link href="/portal/locations/create">
          <Button size={'sm'}>Add</Button>
        </Link>
      </div>

      <Separator className="my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr. No.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead>District</TableHead>
            <TableHead>Taluka</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locationsQuery.data?.map((location, index) => (
            <TableRow key={location.id} onClick={() => router.push(`/portal/locations/${location.id}`)} className="cursor-pointer">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{location.name}</TableCell>
              <TableCell>{location.contactNumber}</TableCell>
              <TableCell>{location.district}</TableCell>
              <TableCell>{location.taluka}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
