'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableCell, TableRow } from '@/components/ui/table'
import { listLocations, listMaterials, listTalukas } from '@/lib/actions'
import { TDeliveryOrderItem } from '@/schemas/delivery-order-schema'
import { ListLocationsInput, TLocation } from '@/schemas/location-schema'
import { TMaterial } from '@/schemas/material-schema'
import { useQuery } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

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
    <>
      <TableRow className="hover:bg-gray-50 group">
        <TableCell className="">{index + 1}</TableCell>
        <TableCell className="p-0">
          <FormField
            control={control}
            name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${index}.taluka`}
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <Select {...field} disabled={isLoading || !editMode} onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger className="w-full border-0 rounded-none shadow-none focus:ring-0 px-3 py-2 h-10">
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
        </TableCell>
        <TableCell className="p-0">
          <FormField
            control={control}
            name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${index}.locationId`}
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <Select {...field} disabled={isLoading || !editMode} onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger className="w-full border-0 rounded-none shadow-none focus:ring-0 px-3 py-2 h-10">
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
        </TableCell>
        <TableCell className="p-0">
          <FormField
            control={control}
            name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${index}.materialId`}
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <Select {...field} disabled={isLoading || !editMode} onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger className="w-full border-0 rounded-none shadow-none focus:ring-0 px-3 py-2 h-10">
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
        </TableCell>
        <TableCell className="p-0">
          <FormField
            control={control}
            name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${index}.quantity`}
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={isLoading || !editMode}
                    className="w-full border-0 rounded-none shadow-none focus:ring-0 px-3 py-2 h-10 text-right"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>
        <TableCell className="p-0">
          <FormField
            control={control}
            name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${index}.rate`}
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    disabled={isLoading || !editMode}
                    className="w-full border-0 rounded-none shadow-none focus:ring-0 px-3 py-2 h-10 text-right"
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TableCell>

        <TableCell className="p-0">
          <Button
            type="button"
            size="icon"
            onClick={() => removeItem(index)}
            disabled={isLoading || !editMode}
            variant="ghost"
            className="h-10 w-10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2Icon className="w-4 h-4 text-red-500" />
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}
