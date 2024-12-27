'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { listMaterials } from '@/lib/actions'
import { TMaterial } from '@/schemas/material-schema'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function Materials() {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')

  const materialsQuery = useQuery<TMaterial[]>({
    queryKey: ['materials'],
    queryFn: () => listMaterials(),
  })

  if (materialsQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (materialsQuery.isError) {
    return <div>Error loading materials. Please try again later.</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">List of all your materials</p>
        <Link href="/portal/materials/create">
          <Button size={'sm'}>Add</Button>
        </Link>
      </div>

      <Separator className="my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr. No.</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materialsQuery.data?.map((material, index) => (
            <TableRow key={material.id} onClick={() => router.push(`/portal/materials/${material.id}`)} className="cursor-pointer">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{material.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
