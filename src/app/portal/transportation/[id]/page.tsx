'use client'

import React from 'react'
import TransportationForm from '@/app/portal/transportation/transportation-form'
import { useQuery } from '@tanstack/react-query'
import { getTransportationCompany } from '@/lib/actions'
import { TTransportationCompany } from '@/schemas/transportation-company-schema'

interface ITransportationPageProps {
  params: Promise<{
    id: string
  }>
}

export default function TransportationPage({ params }: ITransportationPageProps) {
  const unwrappedParams = React.use(params)
  const transportationCompanyQuery = useQuery<TTransportationCompany>({
    queryKey: ['transportationCompany', unwrappedParams.id],
    queryFn: () => getTransportationCompany(unwrappedParams.id),
    initialData: undefined,
    enabled: !!unwrappedParams.id,
  })

  if (transportationCompanyQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (transportationCompanyQuery.isError) {
    return <div>Error loading transportation company. Please try again later.</div>
  }

  return <TransportationForm enableEdit={false} transportationCompany={transportationCompanyQuery.data} />
}
