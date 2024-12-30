'use client'

import { TDeliveryOrderSection } from '@/schemas/delivery-order-schema'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { listDistricts, listLocations, listTalukas } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select'
import { PlusIcon, Trash2Icon } from 'lucide-react'

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

  const talukasQuery = useQuery<string[]>({
    queryKey: ['talukas', section.district],
    queryFn: () =>
      listTalukas({
        districts: section.district ? [section.district] : [],
      }),
    initialData: [],
  })

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
                  <Select {...field} disabled={isLoading || !editMode} onValueChange={field.onChange} value={field.value ?? ''}>
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

      <Separator className="my-4" />
    </div>
  )
}
