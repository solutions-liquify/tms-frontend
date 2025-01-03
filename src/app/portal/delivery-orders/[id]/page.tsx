'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getDeliveryOrder, getParty, listDeliveryChallans, listLocations, listMaterials } from '@/lib/actions'
import { ListDeliveryChallanOutputRecord } from '@/schemas/delivery-challan-schema'
import { TDeliveryOrder } from '@/schemas/delivery-order-schema'
import { TLocation } from '@/schemas/location-schema'
import { TMaterial } from '@/schemas/material-schema'
import { TParty } from '@/schemas/party-schema'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import React from 'react'
interface IDeliveryOrderPageProps {
  params: Promise<{
    id: string
  }>
}

export default function DeliveryOrderPage({ params }: IDeliveryOrderPageProps) {
  const router = useRouter()
  const unwrappedParams = React.use(params)
  const deliveryOrderQuery = useQuery<TDeliveryOrder>({
    queryKey: ['deliveryOrder', unwrappedParams.id],
    queryFn: () => getDeliveryOrder(unwrappedParams.id),
    initialData: undefined,
    enabled: !!unwrappedParams.id,
  })

  const partyQuery = useQuery<TParty>({
    queryKey: ['party', deliveryOrderQuery.data?.partyId],
    queryFn: () => getParty(deliveryOrderQuery.data?.partyId ?? ''),
    initialData: undefined,
    enabled: !!deliveryOrderQuery.data?.partyId,
  })

  const locationsQuery = useQuery<TLocation[]>({
    queryKey: ['locations'],
    queryFn: () => listLocations({}),
    initialData: [],
  })

  const materialsQuery = useQuery<TMaterial[]>({
    queryKey: ['materials'],
    queryFn: () => listMaterials(),
    initialData: [],
  })

  const deliveryChallansQuery = useQuery<ListDeliveryChallanOutputRecord[]>({
    queryKey: ['deliveryChallans', deliveryOrderQuery?.data?.id],
    queryFn: () =>
      listDeliveryChallans({
        deliveryOrderIds: [deliveryOrderQuery?.data?.id ?? ''],
      }),
    enabled: !!deliveryOrderQuery?.data?.id,
  })

  if (deliveryOrderQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (deliveryOrderQuery.isError) {
    return <div>Error loading delivery order. Please try again later.</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="font-semibold underline">Delivery Order Details</p>
        <Button type="button" size="sm" onClick={() => router.push(`/portal/delivery-orders/${unwrappedParams.id}/edit`)}>
          Edit
        </Button>
      </div>

      <div className="my-4" />

      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
        <div className={'grid grid-cols-1 gap-4'}>
          <div className="flex space-x-2">
            <p className="text-sm text-muted-foreground">Contract Number: </p>
            <p className="text-sm">{deliveryOrderQuery.data?.contractId}</p>
          </div>
          <div className="flex space-x-2">
            <p className="text-sm text-muted-foreground">Party: </p>
            <p className="text-sm">{partyQuery.data?.name}</p>
          </div>
          <div className="flex space-x-2">
            <p className="text-sm text-muted-foreground">Date Of Contract: </p>
            <p className="text-sm">
              {deliveryOrderQuery.data?.dateOfContract ? new Date(deliveryOrderQuery.data.dateOfContract * 1000).toLocaleDateString('en-GB') : ''}
            </p>
          </div>
        </div>

        <div className={'grid grid-cols-1 gap-4'}>
          <div className="flex space-x-2">
            <p className="text-sm text-muted-foreground">Total Quantity: </p>
            <p className="text-sm font-semibold">{deliveryOrderQuery.data?.grandTotalQuantity}</p>
          </div>
          <div className="flex space-x-2">
            <p className="text-sm text-muted-foreground">Total Delivered Quantity: </p>
            <p className="text-sm text-amber-500 font-semibold">{deliveryOrderQuery.data?.grandTotalDeliveredQuantity}</p>
          </div>
          <div className="flex space-x-2">
            <p className="text-sm text-muted-foreground">Total In Progress Quantity: </p>
            <p className="text-sm text-green-500 font-semibold">{deliveryOrderQuery.data?.grandTotalInProgressQuantity}</p>
          </div>
        </div>

        <div className={'grid grid-cols-1 gap-4'}>
          <div className="flex space-x-2">
            <p className="text-sm text-muted-foreground">Total DCs: </p>
            <p className="text-sm font-semibold">{deliveryChallansQuery.data?.length}</p>
          </div>
          <div className="flex space-x-2">
            <p className="text-sm text-muted-foreground">DCs Delivered:</p>
            <p className="text-sm font-semibold text-amber-500">{deliveryChallansQuery.data?.filter((dc) => dc.status === 'delivered').length}</p>
          </div>
          <div className="flex space-x-2">
            <p className="text-sm text-muted-foreground">DCs In-Progress:</p>
            <p className="text-sm font-semibold text-green-500">{deliveryChallansQuery.data?.filter((dc) => dc.status === 'in-progress').length}</p>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <p className="font-semibold underline">Delivery Order</p>
      <div className="my-4" />
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taluka</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deliveryOrderQuery.data?.deliveryOrderSections?.map((section, sectionIndex) => (
              <React.Fragment key={`section-${sectionIndex}`}>
                {section.deliveryOrderItems?.map((item, itemIndex) => (
                  <tr key={`${sectionIndex}-${itemIndex}`} className="hover:bg-gray-100 cursor-pointer">
                    <td className="py-2 text-sm whitespace-nowrap">
                      {sectionIndex + 1}.{itemIndex + 1}
                    </td>
                    <td className="py-2 text-sm whitespace-nowrap">{item.taluka}</td>
                    <td className="py-2 text-sm whitespace-nowrap">{locationsQuery.data?.find((location) => location.id === item.locationId)?.name}</td>
                    <td className="py-2 text-sm whitespace-nowrap">{materialsQuery.data?.find((material) => material.id === item.materialId)?.name}</td>
                    <td className="py-2 text-sm whitespace-nowrap">
                      {item.quantity} | <span className="text-amber-500">{item.deliveredQuantity}</span> |{' '}
                      <span className="text-green-500">{item.inProgressQuantity}</span>
                    </td>
                    <td className="py-2 text-sm whitespace-nowrap">{item.rate}</td>
                    <td className="py-2 text-sm whitespace-nowrap">{item.dueDate ? new Date(item.dueDate * 1000).toLocaleDateString('en-GB') : '-'}</td>
                    <td className="py-2 text-sm whitespace-nowrap capitalize">{item.status}</td>
                  </tr>
                ))}
                <tr key={`section-summary-${sectionIndex}`} className="bg-gray-50">
                  <td></td>
                  <td colSpan={3} className="py-2 text-sm whitespace-nowrap font-semibold">
                    {section.district}
                  </td>
                  <td className="py-2 text-sm whitespace-nowrap font-semibold" colSpan={4}>
                    {section.totalQuantity} | <span className="text-amber-500">{section.totalDeliveredQuantity}</span> |{' '}
                    <span className="text-green-500">{section.totalInProgressQuantity}</span>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Separator className="my-4" />

      <p className="font-semibold underline">Delivery Challans</p>

      <div className="my-4" />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deliveryChallansQuery.data?.map((challan, index) => (
              <tr key={challan.id} className="hover:bg-gray-100 cursor-pointer">
                <td className="py-2 text-sm whitespace-nowrap">{index + 1}</td>
                <td className="py-2 text-sm whitespace-nowrap">{challan.id}</td>
                <td className="py-2 text-sm whitespace-nowrap">
                  {challan.dateOfChallan ? new Date(challan.dateOfChallan * 1000).toLocaleDateString('en-GB') : '-'}
                </td>
                <td className="py-2 text-sm whitespace-nowrap">{challan.totalDeliveringQuantity || 0}</td>
                <td className="py-2 text-sm whitespace-nowrap capitalize">{challan.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
