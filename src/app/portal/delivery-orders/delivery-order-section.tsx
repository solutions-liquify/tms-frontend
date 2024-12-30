'use client'

import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { listDistricts } from '@/lib/actions'
import { TDeliveryOrderSection } from '@/schemas/delivery-order-schema'
import { useQuery } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import DeliveryOrderItem from './delivery-order-item'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface DeliveryOrderSectionProps {
  section: TDeliveryOrderSection
  index: number
  removeSection: (index: number) => void
  isLoading: boolean
  editMode: boolean
}

export default function DeliveryOrderSection({ section, index, removeSection, isLoading, editMode }: DeliveryOrderSectionProps) {
  const { control } = useFormContext()

  const districtsQuery = useQuery<string[]>({
    queryKey: ['districts'],
    queryFn: () => listDistricts({}),
    initialData: [],
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: `deliveryOrderSections.${index}.deliveryOrderItems`,
  })

  const addItem = () => {
    append({
      id: null,
      deliveryOrderId: '',
      district: section.district ?? '',
      taluka: '',
      locationId: '',
      materialId: '',
      quantity: 0,
      pendingQuantity: 0,
      deliveredQuantity: 0,
      inProgressQuantity: 0,
      rate: 0,
      unit: '',
      dueDate: 0,
      status: 'pending',
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center space-x-2 mb-2">
          <FormLabel className="font-semibold text-sm">District: </FormLabel>
          <FormField
            control={control}
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

        <div className="flex justify-end items-center">
          <Button type="button" size="icon" onClick={() => removeSection(index)} disabled={isLoading || !editMode} variant="ghost">
            <Trash2Icon className="w-4 h-4 text-red-500 cursor-pointer" />
          </Button>
        </div>
      </div>

      <div className="my-4" />

      {section.district && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">#</TableHead>
                <TableHead className="w-1/6">Taluka</TableHead>
                <TableHead className="w-1/6">Location</TableHead>
                <TableHead className="w-1/6">Material</TableHead>
                <TableHead className="w-1/6">Quantity</TableHead>
                <TableHead className="w-1/6">Rate</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, itemIndex) => (
                <DeliveryOrderItem
                  key={field.id}
                  item={field as any}
                  index={itemIndex}
                  removeItem={() => remove(itemIndex)}
                  isLoading={isLoading}
                  editMode={editMode}
                  sectionIndex={index}
                />
              ))}
            </TableBody>
          </Table>

          <Button type="button" onClick={addItem} disabled={isLoading || !editMode} variant="outline" className="mt-4">
            Add Item
          </Button>
        </div>
      )}

      <Separator className="my-4" />
    </div>
  )
}
