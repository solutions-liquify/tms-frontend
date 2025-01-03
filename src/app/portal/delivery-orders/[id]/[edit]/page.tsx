'use client'

import React from 'react'
import DeliveryOrderForm from '@/app/portal/delivery-orders/delivery-order-form'
import { useQuery } from '@tanstack/react-query'
import { getDeliveryOrder } from '@/lib/actions'
import { TDeliveryOrder } from '@/schemas/delivery-order-schema'

interface IDeliveryOrderPageProps {
  params: Promise<{
    id: string
  }>
}

export default function DeliveryOrderPage({ params }: IDeliveryOrderPageProps) {
  const unwrappedParams = React.use(params)
  const deliveryOrderQuery = useQuery<TDeliveryOrder>({
    queryKey: ['deliveryOrder', unwrappedParams.id],
    queryFn: () => getDeliveryOrder(unwrappedParams.id),
    initialData: undefined,
    enabled: !!unwrappedParams.id,
  })

  if (deliveryOrderQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (deliveryOrderQuery.isError) {
    return <div>Error loading delivery order. Please try again later.</div>
  }

  return <DeliveryOrderForm enableEdit={true} deliveryOrder={deliveryOrderQuery.data} />
}
