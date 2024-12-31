'use client'

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { listLocations, listMaterials, listTalukas } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { TDeliveryOrder } from '@/schemas/delivery-order-schema'
import { UseFormReturn } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TMaterial } from '@/schemas/material-schema'
import { TLocation } from '@/schemas/location-schema'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'

interface DeliveryOrderItemProps {
  index: number
  itemIndex: number
  form: UseFormReturn<TDeliveryOrder>
  district: string | undefined | null
}

export const DeliveryOrderItem = ({ index, itemIndex, form, district }: DeliveryOrderItemProps) => {
  const talukasQuery = useQuery<string[]>({
    queryKey: ['talukas', district],
    queryFn: () => listTalukas({ districts: district ? [district] : [] }),
    initialData: [],
  })

  const locationsQuery = useQuery<TLocation[]>({
    queryKey: ['locations', district, form.getValues(`deliveryOrderSections.${index}.deliveryOrderItems.${itemIndex}.taluka`)],
    queryFn: () =>
      listLocations({ district: district, taluka: form.getValues(`deliveryOrderSections.${index}.deliveryOrderItems.${itemIndex}.taluka`) || null }),
    initialData: [],
  })

  const materialsQuery = useQuery<TMaterial[]>({
    queryKey: ['materials'],
    queryFn: () => listMaterials(),
    initialData: [],
  })

  return (
    <div className="grid grid-cols-1 gap-4 overflow-y-auto p-4">
      <FormField
        control={form.control}
        name={`deliveryOrderSections.${index}.deliveryOrderItems.${itemIndex}.taluka`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Taluka</FormLabel>
            <FormControl>
              <Select {...field} onValueChange={field.onChange} value={field.value ?? ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a taluka" />
                </SelectTrigger>
                <SelectContent>
                  {talukasQuery.data?.map((taluka, talukaIndex) => (
                    <SelectItem key={`${taluka}-${talukaIndex}`} value={taluka}>
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
        control={form.control}
        name={`deliveryOrderSections.${index}.deliveryOrderItems.${itemIndex}.locationId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Select {...field} onValueChange={field.onChange} value={field.value ?? ''}>
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
        control={form.control}
        name={`deliveryOrderSections.${index}.deliveryOrderItems.${itemIndex}.materialId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Material</FormLabel>
            <FormControl>
              <Select {...field} onValueChange={field.onChange} value={field.value ?? ''}>
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
        control={form.control}
        name={`deliveryOrderSections.${index}.deliveryOrderItems.${itemIndex}.quantity`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Quantity</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`deliveryOrderSections.${index}.deliveryOrderItems.${itemIndex}.rate`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate</FormLabel>
            <FormControl>
              <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} value={field.value ?? ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`deliveryOrderSections.${index}.deliveryOrderItems.${itemIndex}.dueDate`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Due Date</FormLabel>
            <FormControl>
              <Input
                {...field}
                type={'date'}
                value={field.value ? new Date(field.value * 1000).toISOString().split('T')[0] : ''}
                onChange={(e) => field.onChange(Math.floor(new Date(e.target.value).getTime() / 1000))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
