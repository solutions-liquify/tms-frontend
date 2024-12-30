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
      status: '',
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

      <div>
        {fields.map((item, itemIndex) => (
          <DeliveryOrderItem
            key={itemIndex}
            item={item}
            index={itemIndex}
            removeItem={() => remove(itemIndex)}
            isLoading={isLoading}
            editMode={editMode}
            sectionIndex={index}
          />
        ))}
        <Button type="button" onClick={addItem} disabled={isLoading || !editMode} variant="outline">
          Add Item
        </Button>
      </div>

      <Separator className="my-4" />
    </div>
  )
}
