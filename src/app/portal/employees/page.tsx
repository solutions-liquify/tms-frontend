'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listEmployees } from '@/lib/actions'
import { TEmployee } from '@/schemas/employee-schema'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import EmployeeTableItemFilter from './employee-table-item-filter'

export default function Employees() {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(5)

  const employeesQuery = useQuery<TEmployee[]>({
    queryKey: ['employees', search, selectedRoles, selectedStatuses, page, size],
    queryFn: () =>
      listEmployees({
        search: search,
        roles: selectedRoles,
        statuses: selectedStatuses,
        page: page,
        size: size,
      }),
  })

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

      <div className="grid sm:grid-cols-4 gap-2">
        <Input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} className="sm:col-span-2" />

        <EmployeeTableItemFilter selectedItems={selectedRoles} setSelectedItems={setSelectedRoles} defaultItemsList={['ADMIN', 'STAFF']} title={'Role'} />
        <EmployeeTableItemFilter
          selectedItems={selectedStatuses}
          setSelectedItems={setSelectedStatuses}
          defaultItemsList={['active', 'inactive']}
          title={'Status'}
        />
      </div>

      <div className="my-4" />

      {employeesQuery.isLoading ? (
        <div className="flex justify-center items-center">
          <p>Loading...</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr. No.</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contact Number</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employeesQuery.data?.map((employee, index) => (
              <TableRow key={employee.id} onClick={() => router.push(`/portal/employees/${employee.id}`)} className="cursor-pointer">
                <TableCell>{index + 1 + (page - 1) * size}</TableCell>
                <TableCell className="capitalize">{employee.name.toLowerCase()}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.contactNumber}</TableCell>
                <TableCell className="capitalize">{employee.role?.toLowerCase()}</TableCell>
                <TableCell className="capitalize">{employee.status.toLowerCase()}</TableCell>
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
          disabled={!employeesQuery.data || employeesQuery.data?.length < size}
          className={'disabled:opacity-30'}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
