'use client'

import React from 'react'
import EmployeeForm from '@/app/portal/employees/employee-form'
import { useQuery } from '@tanstack/react-query'
import { getEmployee } from '@/lib/actions'
import { TEmployee } from '@/schemas/employee-schema'

interface IEmployeePageProps {
  params: Promise<{
    id: string
  }>
}

export default function EmployeePage({ params }: IEmployeePageProps) {
  const unwrappedParams = React.use(params)
  const employeeQuery = useQuery<TEmployee>({
    queryKey: ['employee', unwrappedParams.id],
    queryFn: () => getEmployee(unwrappedParams.id),
    initialData: undefined,
    enabled: !!unwrappedParams.id,
  })

  if (employeeQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (employeeQuery.isError) {
    return <div>Error loading employee. Please try again later.</div>
  }

  return <EmployeeForm enableEdit={false} employee={employeeQuery.data} />
}
