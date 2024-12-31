'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { listDistricts, listLocations, listMaterials, listTalukas } from '@/lib/actions'
import { TDeliveryOrder, TDeliveryOrderSection } from '@/schemas/delivery-order-schema'
import { TLocation } from '@/schemas/location-schema'
import { TMaterial } from '@/schemas/material-schema'
import { useQuery } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { DeliveryOrderItem } from './delivery-order-item'

interface DeliveryOrderSectionProps {
  section: TDeliveryOrderSection
  index: number
  removeSection: (index: number) => void
  isLoading: boolean
  editMode: boolean
  form: UseFormReturn<TDeliveryOrder>
}

export default function DeliveryOrderSection({ index, removeSection, isLoading, editMode, form }: DeliveryOrderSectionProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const districtsQuery = useQuery<string[]>({
    queryKey: ['districts'],
    queryFn: () => listDistricts({}),
    initialData: [],
  })

  const materialsQuery = useQuery<TMaterial[]>({
    queryKey: ['materials'],
    queryFn: () => listMaterials(),
    initialData: [],
  })

  const locationsQuery = useQuery<TLocation[]>({
    queryKey: ['locations'],
    queryFn: () => listLocations({}),
    initialData: [],
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `deliveryOrderSections.${index}.deliveryOrderItems`,
  })
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith(`deliveryOrderSections.${index}.deliveryOrderItems`)) {
        const totalQuantity = value.deliveryOrderSections?.[index]?.deliveryOrderItems?.reduce((acc, item) => acc + (item?.quantity || 0), 0) || 0
        const totalDeliveredQuantity =
          value.deliveryOrderSections?.[index]?.deliveryOrderItems?.reduce((acc, item) => acc + (item?.deliveredQuantity || 0), 0) || 0
        const totalInProgressQuantity =
          value.deliveryOrderSections?.[index]?.deliveryOrderItems?.reduce((acc, item) => acc + (item?.inProgressQuantity || 0), 0) || 0
        form.setValue(`deliveryOrderSections.${index}.totalQuantity`, totalQuantity)
        form.setValue(`deliveryOrderSections.${index}.totalDeliveredQuantity`, totalDeliveredQuantity)
        form.setValue(`deliveryOrderSections.${index}.totalInProgressQuantity`, totalInProgressQuantity)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, index])

  const handleSaveItem = () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    const formData = form.getValues(`deliveryOrderSections.${index}.deliveryOrderItems.${-1}`)
    append(
      formData || {
        id: '',
        taluka: '',
        locationId: '',
        materialId: '',
        quantity: 0,
        unit: '',
        rate: 0,
        dueDate: null,
        pendingQuantity: 0,
        deliveredQuantity: 0,
        status: '',
        inProgressQuantity: 0,
      },
    )

    setIsSubmitting(false)
    setIsDialogOpen(false)
    form.unregister(`deliveryOrderSections.${index}.deliveryOrderItems.${-1}`)
  }

  return (
    <div>
      {/* District selection and remove section button */}
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center space-x-2 mb-2">
          <FormLabel className="font-semibold text-sm">District: </FormLabel>
          <FormField
            control={form.control}
            name={`deliveryOrderSections.${index}.district`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Select {...field} disabled={isLoading || !editMode || fields.length > 0} onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                    <SelectContent>
                      {districtsQuery.data?.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                type="button"
                disabled={isLoading || !editMode || !form.getValues(`deliveryOrderSections.${index}.district`)}
                size={'sm'}
                variant={'outline'}
              >
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Delivery Order Item</DialogTitle>
              </DialogHeader>
              <DeliveryOrderItem index={index} itemIndex={-1} form={form} district={form.getValues(`deliveryOrderSections.${index}.district`)} />
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setIsDialogOpen(false)
                    form.unregister(`deliveryOrderSections.${index}.deliveryOrderItems.${-1}`)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveItem}
                  disabled={
                    isSubmitting ||
                    !form.watch(`deliveryOrderSections.${index}.deliveryOrderItems.${-1}.taluka`) ||
                    !form.watch(`deliveryOrderSections.${index}.deliveryOrderItems.${-1}.locationId`) ||
                    !form.watch(`deliveryOrderSections.${index}.deliveryOrderItems.${-1}.materialId`) ||
                    !form.watch(`deliveryOrderSections.${index}.deliveryOrderItems.${-1}.quantity`)
                  }
                >
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button type="button" size="icon" onClick={() => removeSection(index)} disabled={isLoading || !editMode} variant="ghost">
            <Trash2Icon className="w-4 h-4 text-red-500 cursor-pointer" />
          </Button>
        </div>
      </div>

      <div className="my-2" />

      <table className="min-w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th scope="col" className="whitespace-nowrap py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
              #
            </th>
            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Taluka
            </th>
            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Location
            </th>
            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Material
            </th>
            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Quantity
            </th>
            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Rate
            </th>
            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Due Date
            </th>
            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Delivered
            </th>
            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              In Progress
            </th>
            <th scope="col" className="whitespace-nowrap px-2 py-3.5 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th scope="col" className="relative whitespace-nowrap py-3.5 pl-3 pr-4 sm:pr-0">
              <span className="sr-only">Remove</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {fields.map((item, itemIndex) => (
            <tr key={item.id} className="cursor-pointer hover:bg-gray-100">
              <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm text-gray-500 sm:pl-0">{itemIndex + 1}</td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{item.taluka}</td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                {locationsQuery.data?.find((location) => location.id === item.locationId)?.name || item.locationId}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                {materialsQuery.data?.find((material) => material.id === item.materialId)?.name || item.materialId}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{item.quantity}</td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{item.rate}</td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">
                {item.dueDate ? new Date(item.dueDate * 1000).toLocaleDateString('en-GB') : ''}
              </td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{item.deliveredQuantity}</td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900">{item.inProgressQuantity}</td>
              <td className="whitespace-nowrap px-2 py-2 text-sm text-gray-900 capitalize">{item.status}</td>
              <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium ">
                <button type="button" className="text-red-600 hover:text-red-900" onClick={() => remove(itemIndex)} disabled={isLoading || !editMode}>
                  <Trash2Icon className="w-4 h-4 text-red-500 cursor-pointer" />
                </button>
              </td>
            </tr>
          ))}

          <tr className="bg-gray-50">
            <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-2" colSpan={4}>
              Total
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900">
              {form.getValues(`deliveryOrderSections.${index}.totalQuantity`)}
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900"></td>
            <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900"></td>
            <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900">
              {form.getValues(`deliveryOrderSections.${index}.totalDeliveredQuantity`)}
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900">
              {form.getValues(`deliveryOrderSections.${index}.totalInProgressQuantity`)}
            </td>
            <td className="whitespace-nowrap px-2 py-2 text-sm font-semibold text-gray-900"></td>
            <td className="relative whitespace-nowrap py-2 pl-3 pr-4 text-right text-sm font-medium sm:pr-0"></td>
          </tr>
        </tbody>
      </table>

      <Separator className="my-4" />
    </div>
  )
}
