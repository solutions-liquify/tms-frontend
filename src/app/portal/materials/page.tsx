'use client'

import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listMaterials } from '@/lib/actions'
import { TMaterial } from '@/schemas/material-schema'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Materials() {
  const router = useRouter()

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
        <p className="text-muted-foreground text-sm">List of all your materials</p>
        <Link href="/portal/materials/create">
          <Button size={'sm'}>Add</Button>
        </Link>
      </div>

      <div className="my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr. No.</TableHead>
            <TableHead className="w-5/6">Name</TableHead>
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
