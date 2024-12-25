'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { listParties } from '@/lib/actions'
import { TParty } from '@/schemas/party-schema'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function Parties() {
  const router = useRouter()
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([])
  const [selectedTalukas, setSelectedTalukas] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [search, setSearch] = useState<string>('')

  const partiesQuery = useQuery<TParty[]>({
    queryKey: ['parties'],
    queryFn: () =>
      listParties({
        search: search,
        states: selectedStates,
        districts: selectedDistricts,
        talukas: selectedTalukas,
        cities: selectedCities,
      }),
  })

  if (partiesQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (partiesQuery.isError) {
    return <div>Error loading parties. Please try again later.</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Parties</p>
        <Link href="/portal/parties/create">
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
          {partiesQuery.data?.map((party, index) => (
            <TableRow key={party.id} onClick={() => router.push(`/portal/parties/${party.id}`)} className="cursor-pointer">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{party.name}</TableCell>
              <TableCell>{party.contactNumber}</TableCell>
              <TableCell>{party.district}</TableCell>
              <TableCell>{party.taluka}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
