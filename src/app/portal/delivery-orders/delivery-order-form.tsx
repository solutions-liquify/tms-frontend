'use client'

import { TDeliveryOrder, TDeliveryOrderSection, TDeliveryOrderItem } from '@/schemas/delivery-order-schema'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DeliveryOrderSchema } from '@/schemas/delivery-order-schema'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { createDeliveryOrder, updateDeliveryOrder } from '@/lib/actions'
import { useQueryClient } from '@tanstack/react-query'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface DeliveryOrderFormProps {
  deliveryOrder?: TDeliveryOrder
  enableEdit: boolean
}

export default function DeliveryOrderForm({ enableEdit, deliveryOrder }: DeliveryOrderFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<TDeliveryOrder>({
    resolver: zodResolver(DeliveryOrderSchema),
    defaultValues: deliveryOrder ?? {},
  })

  const { fields: sectionFields, append: appendSection } = useFieldArray({
    control: form.control,
    name: 'deliveryOrderSections',
  })

  const onSubmit = async (data: TDeliveryOrder) => {
    setIsLoading(true)
    try {
      if (enableEdit) {
        await updateDeliveryOrder(data)
        toast.success('Delivery Order updated successfully')
      } else {
        await createDeliveryOrder(data)
        toast.success('Delivery Order created successfully')
      }
      queryClient.invalidateQueries(['deliveryOrders'])
      router.push('/portal/delivery-orders')
    } catch (error) {
      toast.error('Failed to save Delivery Order')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="party"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Party</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfContract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Contract</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select {...field}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        {sectionFields.map((section, sectionIndex) => (
          <div key={section.id}>
            <FormField
              control={form.control}
              name={`deliveryOrderSections.${sectionIndex}.district`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`deliveryOrderSections.${sectionIndex}.status`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Section Status</FormLabel>
                  <FormControl>
                    <Select {...field}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select section status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Order Items</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            {section.deliveryOrderItems?.map((item, itemIndex) => (
              <div key={item.id}>
                <FormField
                  control={form.control}
                  name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${itemIndex}.material_id`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`deliveryOrderSections.${sectionIndex}.deliveryOrderItems.${itemIndex}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
              </div>
            ))}
          </div>
        ))}
        <Button type="button" onClick={() => appendSection({})}>
          Add Section
        </Button>
        <Separator />
        <Button type="submit" disabled={isLoading}>
          {enableEdit ? 'Update Delivery Order' : 'Create Delivery Order'}
        </Button>
      </form>
    </Form>
  )
}
