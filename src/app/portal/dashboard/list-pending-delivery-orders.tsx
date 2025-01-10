'use client'

import { useQuery } from '@tanstack/react-query'

import { listPendingDeliveryOrderItems } from '@/lib/actions'
import { TDeliveryOrderItem } from '@/schemas/delivery-order-schema'
import { useState } from 'react'
import { TMaterial } from '@/schemas/material-schema'
import { TLocation } from '@/schemas/location-schema'
import StatusBadge from '@/components/status-badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface ListPendingDeliveryOrdersProps {
  materials: TMaterial[]
  locations: TLocation[]
}

export default function ListPendingDeliveryOrders({ materials, locations }: ListPendingDeliveryOrdersProps) {
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)

  const pendingDeliveryOrderItemsQuery = useQuery<TDeliveryOrderItem[]>({
    queryKey: ['pending-delivery-orders', page, size],
    queryFn: () => listPendingDeliveryOrderItems({ page, size }),
  })

  if (pendingDeliveryOrderItemsQuery.isLoading) return <div>Loading...</div>
  if (pendingDeliveryOrderItemsQuery.isError) return <div>Error</div>

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              #
            </th>
            <th scope="col" className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              DO
            </th>
            <th scope="col" className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              District
            </th>
            <th scope="col" className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Taluka
            </th>
            <th scope="col" className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th scope="col" className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Material
            </th>
            <th scope="col" className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
            </th>

            <th scope="col" className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th scope="col" className="p-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {pendingDeliveryOrderItemsQuery.data?.map((item: TDeliveryOrderItem, index: number) => (
            <tr key={item.id}>
              <td className="p-2 whitespace-nowrap text-sm text-left">{index + 1 + (page - 1) * size}</td>
              <td className="p-2 whitespace-nowrap text-sm text-left">
                <Link href={`/portal/delivery-orders/${item.deliveryOrderId}`} className="hover:text-blue-500 hover:underline text-xs">
                  {item.deliveryOrderId}
                </Link>
              </td>
              <td className="p-2 whitespace-nowrap text-sm text-left">{item.district}</td>
              <td className="p-2 whitespace-nowrap text-sm text-left">{item.taluka}</td>
              <td className="p-2 whitespace-nowrap text-sm text-left">{locations.find((location) => location.id === item.locationId)?.name}</td>
              <td className="p-2 whitespace-nowrap text-sm text-left">{materials.find((material) => material.id === item.materialId)?.name}</td>
              <td className="p-2 whitespace-nowrap text-sm text-left">
                {item.quantity} | <span className="text-green-500">{item.deliveredQuantity}</span>
              </td>
              <td className="p-2 whitespace-nowrap text-sm text-left">{item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-GB') : ''}</td>
              <td className="p-2 whitespace-nowrap text-sm text-left">
                <StatusBadge
                  status={item.deliveredQuantity >= item.quantity ? 'delivered' : item.dueDate && new Date(item.dueDate) < new Date() ? 'overdue' : 'pending'}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-4" />

      <div className={'my-4 flex justify-end items-center space-x-2'}>
        <Button onClick={() => setPage(page - 1)} size={'sm'} variant={'outline'} disabled={page === 1} className={'disabled:opacity-30'}>
          Previous
        </Button>
        <p className={'text-xs'}>Page: {page} </p>
        <Button
          onClick={() => setPage(page + 1)}
          size={'sm'}
          variant={'outline'}
          disabled={!pendingDeliveryOrderItemsQuery.data || pendingDeliveryOrderItemsQuery.data?.length < size}
          className={'disabled:opacity-30'}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
