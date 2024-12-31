'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { listDistricts, listLocations, listMaterials, listTalukas } from '@/lib/actions'
import { TDeliveryOrder, TDeliveryOrderSection } from '@/schemas/delivery-order-schema'
import { useQuery } from '@tanstack/react-query'
import { Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { useFieldArray, UseFormReturn } from 'react-hook-form'
import { DeliveryOrderItem } from './delivery-order-item'
import { TMaterial } from '@/schemas/material-schema'
import { TLocation } from '@/schemas/location-schema'

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

  const talukasQuery = useQuery<string[]>({
    queryKey: ['talukas', form.getValues(`deliveryOrderSections.${index}.district`)],
    queryFn: () => {
      const district = form.getValues(`deliveryOrderSections.${index}.district`)
      return listTalukas({ districts: district ? [district] : [] })
    },
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

        <div className="flex justify-end items-center">
          <Button type="button" size="icon" onClick={() => removeSection(index)} disabled={isLoading || !editMode} variant="ghost">
            <Trash2Icon className="w-4 h-4 text-red-500 cursor-pointer" />
          </Button>
        </div>
      </div>

      <div className="my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Taluka</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Quantity</TableHead>

            <TableHead>Rate</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Pending</TableHead>
            <TableHead>In Progress</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.map((item, itemIndex) => (
            <TableRow key={item.id} className="cursor-pointer">
              <TableCell className="w-1/12">{itemIndex + 1}</TableCell>
              <TableCell className="w-1/12">{item.taluka}</TableCell>
              <TableCell className="w-1/12">{locationsQuery.data?.find((location) => location.id === item.locationId)?.name || item.locationId}</TableCell>
              <TableCell className="w-1/12">{materialsQuery.data?.find((material) => material.id === item.materialId)?.name || item.materialId}</TableCell>
              <TableCell className="w-1/12">
                {item.quantity} {item.unit}
              </TableCell>
              <TableCell className="w-1/12">{item.rate}</TableCell>
              <TableCell className="w-1/12">{item.dueDate ? new Date(item.dueDate * 1000).toLocaleDateString('en-GB') : ''}</TableCell>
              <TableCell className="w-1/12">{item.pendingQuantity}</TableCell>
              <TableCell className="w-1/12">{item.deliveredQuantity}</TableCell>
              <TableCell className="w-1/12 capitalize">{item.status}</TableCell>
              <TableCell className="w-1/12 text-right">
                <Button type="button" size="icon" onClick={() => remove(itemIndex)} disabled={isLoading || !editMode} variant="ghost">
                  <Trash2Icon className="w-4 h-4 text-red-500 cursor-pointer" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mt-4" type="button" disabled={isLoading || !editMode}>
            Add Delivery Order Item
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
              onClick={() => {
                setIsDialogOpen(false)
                form.unregister(`deliveryOrderSections.${index}.deliveryOrderItems.${-1}`)
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveItem} disabled={isSubmitting}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Separator className="my-4" />
    </div>
  )
}
