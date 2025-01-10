'use client'

import { useQuery } from '@tanstack/react-query'
import { TMaterial } from '@/schemas/material-schema'
import ListPendingDeliveryOrders from './list-pending-delivery-orders'
import { listLocations, listMaterials } from '@/lib/actions'
import { TLocation } from '@/schemas/location-schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Page() {
  const materialsQuery = useQuery<TMaterial[]>({
    queryKey: ['materials'],
    queryFn: () => listMaterials(),
  })

  const locationsQuery = useQuery<TLocation[]>({
    queryKey: ['locations'],
    queryFn: () => listLocations({ getAll: true }),
  })

  if (materialsQuery.isLoading || locationsQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (materialsQuery.isError || locationsQuery.isError) {
    return <div>Error loading materials or locations. Please try again later.</div>
  }

  if (!materialsQuery.data || !locationsQuery.data) {
    return <div>No data found. Please try again later.</div>
  }

  return (
    <div>
      <h1 className="font-semibold bg-gray-50 p-4 w-full">Dashboard: Pending Implementations</h1>

      <div className="my-4" />

      <Card>
        <CardHeader>
          <CardTitle>Approaching Due Date</CardTitle>
        </CardHeader>
        <CardContent>
          <ListPendingDeliveryOrders materials={materialsQuery.data} locations={locationsQuery.data} />
        </CardContent>
      </Card>
    </div>
  )
}
