'use client'

import { TDeliveryOrderSection } from '@/schemas/delivery-order-schema'
import { useFormContext, useFieldArray } from 'react-hook-form'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { listDistricts } from '@/lib/actions'
import { useQuery } from '@tanstack/react-query'
import { Select, SelectContent, SelectValue, SelectTrigger, SelectItem } from '@/components/ui/select'
import { Trash2Icon } from 'lucide-react'

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

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex justify-start items-center space-x-2 mb-2">
          <FormLabel>District</FormLabel>
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

        <div className="flex justify-start items-center space-x-2 mb-2">
          <Button type="button" size="icon" onClick={() => removeSection(index)} disabled={isLoading || !editMode} variant="ghost">
            <Trash2Icon className="w-4 h-4 text-red-500 cursor-pointer" />
          </Button>
        </div>
      </div>

      <FormField
        control={control}
        name={`deliveryOrderSections.${index}.status`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <FormControl>
              <Input {...field} disabled={isLoading || !editMode} onChange={(e) => field.onChange(e.target.value)} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator className="my-4" />
    </div>
  )
}
