'use client'

import { TDeliveryOrder } from '@/schemas/delivery-order-schema'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray, FieldErrors } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DeliveryOrderSchema } from '@/schemas/delivery-order-schema'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { createDeliveryChallanFromDeliveryOrder, createDeliveryOrder, listParties, updateDeliveryOrder } from '@/lib/actions'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TParty } from '@/schemas/party-schema'
import DeliveryOrderSection from './delivery-order-section'

interface DeliveryOrderFormProps {
  deliveryOrder?: TDeliveryOrder
  enableEdit: boolean
}

export default function DeliveryOrderForm({ enableEdit, deliveryOrder }: DeliveryOrderFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(enableEdit)

  const form = useForm<TDeliveryOrder>({
    resolver: zodResolver(DeliveryOrderSchema),
    defaultValues: deliveryOrder ?? {
      deliveryOrderSections: [],
      grandTotalQuantity: 0,
      grandTotalInProgressQuantity: 0,
      grandTotalDeliveredQuantity: 0,
      status: 'pending',
    },
  })

  const { append: appendSection, remove: removeSection } = useFieldArray({
    control: form.control,
    name: 'deliveryOrderSections',
  })

  const addSection = () => {
    appendSection({
      totalQuantity: 0,
      totalDeliveredQuantity: 0,
      totalInProgressQuantity: 0,
      status: 'pending',
      deliveryOrderItems: [],
    })
  }

  const removeSectionByIndex = (index: number) => {
    removeSection(index)
  }

  const partiesQuery = useQuery<TParty[]>({
    queryKey: ['parties'],
    queryFn: () => listParties({}),
    initialData: [],
  })

  const deliveryOrderMutation = useMutation({
    mutationFn: async (data: TDeliveryOrder) => {
      setIsLoading(true)
      let response
      if (data.id) {
        response = await updateDeliveryOrder(data)
        await queryClient.invalidateQueries({
          queryKey: ['deliveryOrder', data.id],
        })
      } else {
        response = await createDeliveryOrder(data)
      }
      return response
    },
    onSuccess: async (response) => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['deliveryOrders'] })
        form.reset(response)
        setEditMode(false)
        toast.success('Delivery Order saved successfully')
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
      toast.error('An error occurred. Please try again later.')
    },
  })

  const deliveryChallanMutation = useMutation({
    mutationFn: async (deliveryOrderId: string) => {
      setIsLoading(true)
      const response = await createDeliveryChallanFromDeliveryOrder(deliveryOrderId)
      return response
    },
    onSuccess: async (response) => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['deliveryChallans'] })
        toast.success('Delivery Challan created successfully')
        // TODO: redirect to delivery challan page
        router.push(`/portal/delivery-challans/${response.id}`)
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
      toast.error('An error occurred while creating the delivery challan. Please try again later.')
    },
  })

  const onSubmit = (data: TDeliveryOrder) => {
    deliveryOrderMutation.mutate(data)
    // console.log(data)
  }

  const onFormError = (errors: FieldErrors<TDeliveryOrder>) => {
    console.log(errors)
  }

  const handleCreateDeliveryChallan = async () => {
    await deliveryOrderMutation.mutateAsync(form.getValues())
    await deliveryChallanMutation.mutateAsync(form.getValues('id') ?? '')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-muted-foreground">Delivery Order Details</p>

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
            name="contractId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contract ID</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="partyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Party</FormLabel>
                <FormControl>
                  <Select {...field} disabled={isLoading || !editMode} onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a party" />
                    </SelectTrigger>
                    <SelectContent>
                      {partiesQuery.data?.map((party) => (
                        <SelectItem key={party.id} value={party.id ?? ''}>
                          {party.name}
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
            name="dateOfContract"
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
        </div>

        <div className="my-4" />

        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-muted-foreground">Delivery Orders Sections</p>
        </div>

        <Separator className="my-4" />

        <div>
          {form
            .watch('deliveryOrderSections')
            ?.map((section, index) => (
              <DeliveryOrderSection
                key={index}
                form={form}
                section={section}
                index={index}
                removeSection={removeSectionByIndex}
                isLoading={isLoading}
                editMode={editMode}
              />
            ))}
        </div>

        <Button type="button" onClick={addSection} size="sm" disabled={isLoading || !editMode}>
          Add Section
        </Button>

        <Separator className="my-4" />

        <Button type="button" onClick={handleCreateDeliveryChallan} size="sm" disabled={isLoading || !editMode}>
          Create Delivery Challan
        </Button>
      </form>
    </Form>
  )
}
