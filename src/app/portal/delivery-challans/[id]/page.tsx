'use client'

import React from 'react'
import DeliveryChallanForm from '@/app/portal/delivery-challans/delivery-challan-form'
import { useQuery } from '@tanstack/react-query'
import { getDeliveryChallan } from '@/lib/actions'
import { TDeliveryChallan } from '@/schemas/delivery-challan-schema'

interface IDeliveryChallanPageProps {
  params: Promise<{
    id: string
  }>
}

export default function DeliveryChallanPage({ params }: IDeliveryChallanPageProps) {
  const unwrappedParams = React.use(params)
  const deliveryChallanQuery = useQuery<TDeliveryChallan>({
    queryKey: ['deliveryChallan', unwrappedParams.id],
    queryFn: () => getDeliveryChallan(unwrappedParams.id),
    initialData: undefined,
    enabled: !!unwrappedParams.id,
  })

  if (deliveryChallanQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (deliveryChallanQuery.isError) {
    return <div>Error loading delivery challan. Please try again later.</div>
  }

  if (!deliveryChallanQuery.data) {
    return <div>Delivery challan not found.</div>
  }

  return <DeliveryChallanForm enableEdit={false} deliveryChallan={deliveryChallanQuery.data} />
}
