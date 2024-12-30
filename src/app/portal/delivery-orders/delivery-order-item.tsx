'use client'

import { TDeliveryOrderItem } from '@/schemas/delivery-order-schema'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Trash2Icon } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { listLocations, listTalukas } from '@/lib/actions'
import { Select, SelectItem, SelectContent, SelectValue, SelectTrigger } from '@/components/ui/select'
import { ListLocationsInput, TLocation } from '@/schemas/location-schema'
import { listMaterials } from '@/lib/actions'
import { TMaterial } from '@/schemas/material-schema'

interface DeliveryOrderItemProps {
  item: TDeliveryOrderItem
  index: number
  removeItem: (index: number) => void
  isLoading: boolean
  editMode: boolean
  sectionIndex: number
}

export default function DeliveryOrderItem({ item, index, removeItem, isLoading, editMode, sectionIndex }: DeliveryOrderItemProps) {
  const { control } = useFormContext()

  const talukasQuery = useQuery<string[]>({
    queryKey: ['talukas', item.district],
    queryFn: () =>
      listTalukas({
        districts: item.district ? [item.district] : [],
      }),
    initialData: [],
  })

  const locationsQuery = useQuery<TLocation[]>({
    queryKey: ['locations', item.district, item.taluka],
    queryFn: () => listLocations({ district: item.district, taluka: item.taluka } as ListLocationsInput),
    initialData: [],
  })

  const materialsQuery = useQuery<TMaterial[]>({
    queryKey: ['materials'],
    queryFn: () => listMaterials(),
    initialData: [],
  })

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center space-x-2 mb-2">
          <FormLabel className="font-semibold text-sm">Item {index + 1}</FormLabel>
        </div>

        <div className="flex justify-end items-center">
          <Button type="button" size="icon" onClick={() => removeItem(index)} disabled={isLoading || !editMode} variant="ghost">
            <Trash2Icon className="w-4 h-4 text-red-500 cursor-pointer" />
          </Button>
        </div>
      </div>

      <div className="my-4" />

      <div className="flex space-x-2">
        <FormField
          control={control}
          name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${index}.taluka`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-semibold text-sm">Taluka: </FormLabel>
              <FormControl>
                <Select {...field} disabled={isLoading || !editMode} onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a taluka" />
                  </SelectTrigger>
                  <SelectContent>
                    {talukasQuery.data?.map((taluka) => (
                      <SelectItem key={taluka} value={taluka}>
                        {taluka}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${index}.locationId`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-semibold text-sm">Location: </FormLabel>
              <FormControl>
                <Select {...field} disabled={isLoading || !editMode} onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationsQuery.data?.map((location) => (
                      <SelectItem key={location.id} value={location.id ?? ''}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${index}.materialId`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-semibold text-sm">Material: </FormLabel>
              <FormControl>
                <Select {...field} disabled={isLoading || !editMode} onValueChange={field.onChange} value={field.value ?? ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialsQuery.data?.map((material) => (
                      <SelectItem key={material.id} value={material.id ?? ''}>
                        {material.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${index}.quantity`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-semibold text-sm">Quantity: </FormLabel>
              <FormControl>
                <Input {...field} type="number" disabled={isLoading || !editMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${index}.rate`}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="font-semibold text-sm">Rate: </FormLabel>
              <FormControl>
                <Input {...field} type="number" disabled={isLoading || !editMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <Separator className="my-4" />
    </div>
  )
}
