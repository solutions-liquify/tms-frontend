'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { listEmployees } from '@/lib/actions'
import { TEmployee } from '@/schemas/employee-schema'
import { useState } from 'react'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function Employees() {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')

  const employeesQuery = useQuery<TEmployee[]>({
    queryKey: ['employees'],
    queryFn: () =>
      listEmployees({
        search: search,
      }),
  })

  if (employeesQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (employeesQuery.isError) {
    return <div>Error loading employees. Please try again later.</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground text-sm">List of all your employees</p>
        <Link href="/portal/employees/create">
          <Button size={'sm'}>Add</Button>
        </Link>
      </div>

      <div className="my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr. No.</TableHead>
            <TableHead className="w-1/3">Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact Number</TableHead>
            <TableHead>Roles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employeesQuery.data?.map((employee, index) => (
            <TableRow key={employee.id} onClick={() => router.push(`/portal/employees/${employee.id}`)} className="cursor-pointer">
              <TableCell>{index + 1}</TableCell>
              <TableCell className="capitalize">{employee.name.toLowerCase()}</TableCell>
              <TableCell>{employee.email}</TableCell>
              <TableCell>{employee.contactNumber}</TableCell>
              <TableCell className="capitalize">{employee.role?.toLowerCase()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
