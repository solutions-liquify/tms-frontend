'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateDeliveryChallan } from '@/lib/actions'
import { DeliveryChallanSchema, TDeliveryChallan } from '@/schemas/delivery-challan-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FieldErrors, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface DeliveryChallanFormProps {
  deliveryChallan: TDeliveryChallan
  enableEdit: boolean
}

export default function DeliveryChallanForm({ enableEdit, deliveryChallan }: DeliveryChallanFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(enableEdit)
  const queryClient = useQueryClient()
  const router = useRouter()

  const form = useForm<TDeliveryChallan>({
    resolver: zodResolver(DeliveryChallanSchema),
    defaultValues: deliveryChallan,
  })

  const { append: appendItem, remove: removeItem } = useFieldArray({
    control: form.control,
    name: 'deliveryChallanItems',
  })

  const addItem = () => {
    appendItem({
      id: '',
      deliveryChallanId: deliveryChallan.id,
      deliveryOrderItemId: '',
      district: '',
      taluka: '',
      locationName: '',
      materialName: '',
      quantity: 0,
      rate: 0,
      deliveringQuantity: 0,
    })
  }

  const removeItemByIndex = (index: number) => {
    removeItem(index)
  }

  const deliveryChallanMutation = useMutation({
    mutationFn: async (data: TDeliveryChallan) => {
      setIsLoading(true)
      const response = await updateDeliveryChallan(data)
      await queryClient.invalidateQueries({ queryKey: ['deliveryChallans', data.id] })
      return response
    },
    onSuccess: async (response) => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['deliveryChallans', response.id] })
        await queryClient.invalidateQueries({ queryKey: ['deliveryOrders'] })
        form.reset(response)
        setEditMode(false)
        toast.success('Delivery Challan saved successfully')
      } catch (error) {
        console.log(error)
        toast.error('Error invalidating cache.')
      } finally {
        setIsLoading(false)
      }
    },
    onError: (error) => {
      setIsLoading(false)
      console.log(error)
      toast.error('Error saving delivery challan.')
    },
  })

  const onSubmit = (data: TDeliveryChallan) => {
    deliveryChallanMutation.mutate(data)
  }

  const onFormError = (errors: FieldErrors<TDeliveryChallan>) => {
    console.log(errors)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-muted-foreground">Delivery Challan Details</p>

          {editMode && (
            <div className="flex space-x-2">
              <Button type="button" size="sm" disabled={isLoading} variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} size="sm">
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}

          {!editMode && (
            <Button type="button" disabled={isLoading} size="sm" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )}
        </div>

        <div className="my-4" />

        <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="deliveryOrderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Order ID</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} disabled={true} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfChallan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date of Contract</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={'date'}
                    value={field.value ? new Date(field.value * 1000).toISOString().split('T')[0] : ''}
                    onChange={(e) => field.onChange(Math.floor(new Date(e.target.value).getTime() / 1000))}
                    disabled={!editMode || isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="partyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party Name</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} disabled={true} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="totalDeliveringQuantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Delivering Quantity</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} disabled={true} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
