'use client'

import StatusBadge from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { getDeliveryOrder, getParty, listDeliveryChallans, listLocations, listMaterials } from '@/lib/actions'
import { DeliveryChallanOutputRecord } from '@/schemas/delivery-challan-schema'
import { TAssociatedDeliverChallanItemMetadata, TDeliveryOrder } from '@/schemas/delivery-order-schema'
import { TLocation } from '@/schemas/location-schema'
import { TMaterial } from '@/schemas/material-schema'
import { TParty } from '@/schemas/party-schema'
import Link from 'next/link'
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

  const materialQuantities = React.useMemo(() => {
    const materialMap: Record<string, { quantity: number; deliveredQuantity: number }> = {}

    if (deliveryOrderQuery.data?.deliveryOrderSections) {
      deliveryOrderQuery.data.deliveryOrderSections.forEach((section) => {
        section.deliveryOrderItems?.forEach((item) => {
          const materialId = item.materialId ?? 'unknown'
          if (!materialMap[materialId]) {
            materialMap[materialId] = { quantity: 0, deliveredQuantity: 0 }
          }
          materialMap[materialId].quantity += item.quantity
          materialMap[materialId].deliveredQuantity += item.deliveredQuantity
        })
      })
    }
    console.log(materialMap)

    return materialMap
  }, [deliveryOrderQuery.data])

  const partyQuery = useQuery<TParty>({
    queryKey: ['party', deliveryOrderQuery.data?.partyId],
    queryFn: () => getParty(deliveryOrderQuery.data?.partyId ?? ''),
    initialData: undefined,
    enabled: !!deliveryOrderQuery.data?.partyId,
  })

  const locationsQuery = useQuery<TLocation[]>({
    queryKey: ['locations'],
    queryFn: () => listLocations({ getAll: true }),
    initialData: [],
  })

  const materialsQuery = useQuery<TMaterial[]>({
    queryKey: ['materials'],
    queryFn: () => listMaterials(),
    initialData: [],
  })

  const deliveryChallansQuery = useQuery<DeliveryChallanOutputRecord[]>({
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
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold">Delivery Order Details</h1>
        <Button type="button" size="sm" onClick={() => router.push(`/portal/delivery-orders/${unwrappedParams.id}/edit`)}>
          Edit
        </Button>
      </div>

      {/* Contract Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Summary </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
            <div className="space-y-3">
              <div className="flex space-x-2">
                <p className="text-sm font-medium text-gray-600">DO Number:</p>
                <p className="text-sm">{deliveryOrderQuery.data?.id}</p>
              </div>
              <div className="flex space-x-2">
                <p className="text-sm font-medium text-gray-600">Client Contract Number:</p>
                <p className="text-sm">{deliveryOrderQuery.data?.contractId}</p>
              </div>
              <div className="flex space-x-2">
                <p className="text-sm font-medium text-gray-600">Party:</p>
                <p className="text-sm">{partyQuery.data?.name}</p>
              </div>
              <div className="flex space-x-2">
                <p className="text-sm font-medium text-gray-600">Date Of Contract:</p>
                <p className="text-sm">
                  {deliveryOrderQuery.data?.dateOfContract ? new Date(deliveryOrderQuery.data.dateOfContract * 1000).toLocaleDateString('en-GB') : ''}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex space-x-2">
                <p className="text-sm font-medium text-gray-600">Total Quantity:</p>
                <p className="text-sm font-semibold">
                  {deliveryOrderQuery.data?.grandTotalQuantity} | <span className="text-green-500">{deliveryOrderQuery.data?.grandTotalDeliveredQuantity}</span>
                </p>
              </div>

              <div className="flex space-x-2">
                <p className="text-sm font-medium text-gray-600">Total DCs:</p>
                <p className="text-sm font-semibold">{deliveryChallansQuery.data?.length}</p>
              </div>
            </div>

            <div className="space-y-3">
              {materialQuantities &&
                Object.entries(materialQuantities).map(([key, { quantity, deliveredQuantity }]) => (
                  <div key={key} className="flex space-x-2">
                    <p className="text-sm font-medium text-gray-600">{materialsQuery.data?.find((material) => material.id === key)?.name}:</p>
                    <p className="text-sm font-semibold">
                      {quantity} | <span className="text-green-500">{deliveredQuantity}</span>
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      {/* Delivery Order Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Delivery Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taluka</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DC</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveryOrderQuery.data?.deliveryOrderSections?.map((section, sectionIndex) => (
                  <React.Fragment key={`section-${sectionIndex}`}>
                    {section.deliveryOrderItems?.map((item, itemIndex) => (
                      <tr key={`${sectionIndex}-${itemIndex}`} className="hover:bg-gray-100 cursor-pointer">
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          {sectionIndex + 1}.{itemIndex + 1}
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">{item.taluka}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          {locationsQuery.data?.find((location) => location.id === item.locationId)?.name}
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          {materialsQuery.data?.find((material) => material.id === item.materialId)?.name}
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          {item.quantity} | <span className="text-green-500">{item.deliveredQuantity}</span>
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">{item.rate}</td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          {item.dueDate ? new Date(item.dueDate * 1000).toLocaleDateString('en-GB') : '-'}
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          <StatusBadge status={item.deliveredQuantity >= item.quantity ? 'delivered' : 'pending'} />
                        </td>
                        <td className="px-3 py-2 text-sm whitespace-nowrap">
                          {item.associatedDeliveryChallanItems?.map((metadata: TAssociatedDeliverChallanItemMetadata) => (
                            <div key={metadata.id}>
                              <Link href={`/portal/delivery-challans/${metadata.deliveryChallanId}`} className="hover:text-blue-500 hover:underline text-xs">
                                {metadata.deliveryChallanId}{' '}
                                <span className={metadata.status === 'delivered' ? 'text-green-500' : 'text-red-500'}>({metadata.deliveringQuantity})</span>
                              </Link>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                    <tr key={`section-summary-${sectionIndex}`} className="bg-gray-50">
                      <td className="px-3 py-2"></td>
                      <td colSpan={3} className="px-3 py-2 text-sm whitespace-nowrap font-semibold">
                        {section.district}
                      </td>
                      <td className="px-3 py-2 text-sm whitespace-nowrap font-semibold" colSpan={5}>
                        {section.totalQuantity} | <span className="text-green-500">{section.totalDeliveredQuantity}</span>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-4" />

      {/* Delivery Challans Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Delivery Challans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transportation</th>
                  {/* <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th> */}
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {deliveryChallansQuery.data?.map((challan, index) => (
                  <tr key={challan.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => router.push(`/portal/delivery-challans/${challan.id}`)}>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">{index + 1}</td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">{challan.id}</td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">
                      {challan.dateOfChallan ? new Date(challan.dateOfChallan * 1000).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">{challan.totalDeliveringQuantity || 0}</td>
                    <td className="px-3 py-2 text-sm whitespace-nowrap">{challan.transportationCompanyName}</td>
                    {/* <td className="px-3 py-2 text-sm whitespace-nowrap">{challan.driverName}</td> */}
                    <td className="px-3 py-2 text-sm whitespace-nowrap">
                      <StatusBadge status={challan.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
