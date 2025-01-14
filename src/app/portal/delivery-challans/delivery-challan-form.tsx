'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  cancelDeliveryChallan,
  downloadFile,
  listDeliveryOrderItemsForDeliveryOrderId,
  listTransportationCompanies,
  updateDeliveryChallan,
} from '@/lib/actions'
import { DeliveryChallanSchema, TDeliveryChallan, TDeliveryChallanItem } from '@/schemas/delivery-challan-schema'
import { TDeliverOrderItemMetadata } from '@/schemas/delivery-order-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CircleAlert, DownloadIcon, Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldErrors, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { TDriver, TTransportationCompany, TVehicle } from '@/schemas/transportation-company-schema'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import StatusBadge from '@/components/status-badge'

interface DeliveryChallanFormProps {
  deliveryChallan: TDeliveryChallan
  enableEdit: boolean
}

export default function DeliveryChallanForm({ enableEdit, deliveryChallan }: DeliveryChallanFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(enableEdit)
  const [isSelectDeliveryOrderItemOpen, setIsSelectDeliveryOrderItemOpen] = useState(false)
  const [vehiclesToSelect, setVehiclesToSelect] = useState<TVehicle[]>([])
  const [driversToSelect, setDriversToSelect] = useState<TDriver[]>([])
  const [isCancelling, setIsCancelling] = useState(false)
  const [fileLoading, setFileLoading] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const queryClient = useQueryClient()
  const router = useRouter()

  const form = useForm<TDeliveryChallan>({
    resolver: zodResolver(DeliveryChallanSchema),
    defaultValues: deliveryChallan,
  })

  const { fields: deliveryChallanItems, remove: removeItem } = useFieldArray({
    control: form.control,
    name: 'deliveryChallanItems',
  })

  const removeItemByIndex = (index: number) => {
    removeItem(index)
  }

  const deliveryOrderItemsQuery = useQuery({
    queryKey: ['deliveryOrderItems', deliveryChallan.deliveryOrderId],
    queryFn: () => listDeliveryOrderItemsForDeliveryOrderId(deliveryChallan.deliveryOrderId),
    initialData: [],
  })

  const transportationCompaniesQuery = useQuery<TTransportationCompany[]>({
    queryKey: ['transportationCompanies'],
    queryFn: () => listTransportationCompanies({ getAll: true }),
    initialData: [],
  })

  useEffect(() => {
    const initialTotalDeliveringQuantity = form.getValues('deliveryChallanItems').reduce((acc, item) => acc + (item?.deliveringQuantity || 0), 0) || 0
    form.setValue('totalDeliveringQuantity', initialTotalDeliveringQuantity, { shouldValidate: true, shouldDirty: true })

    const subscription = form.watch((value, { name }) => {
      if (name?.startsWith('deliveryChallanItems')) {
        const totalDeliveringQuantity = value.deliveryChallanItems?.reduce((acc, item) => acc + (item?.deliveringQuantity || 0), 0) || 0
        form.setValue('totalDeliveringQuantity', totalDeliveringQuantity, { shouldValidate: true, shouldDirty: true })
      }
    })
    return () => subscription.unsubscribe()
  }, [form])

  useEffect(() => {
    const transportationCompanyId = form.getValues('transportationCompanyId')
    if (transportationCompanyId && transportationCompaniesQuery.data) {
      const vehicles = transportationCompaniesQuery.data.find((company) => company.id === transportationCompanyId)?.vehicles
      const drivers = transportationCompaniesQuery.data.find((company) => company.id === transportationCompanyId)?.drivers
      setVehiclesToSelect(vehicles ?? [])
      setDriversToSelect(drivers ?? [])
    }
  }, [transportationCompaniesQuery.data, form.getValues('transportationCompanyId')])

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
        window.location.reload()
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

  const downloadFileMutation = useMutation({
    mutationFn: async (fileId: string) => {
      setFileLoading(true)
      await downloadFile(fileId)
    },
    onSuccess: () => {
      toast.success('File downloaded successfully')
      setFileLoading(false)
    },
    onError: (error) => {
      console.log(error)
      toast.error('An error occurred during file download. Please try again later.')
      setFileLoading(false)
    },
  })

  const cancelDeliveryChallanMutation = useMutation({
    mutationFn: async (id: string) => {
      setIsCancelling(true)
      const response = await cancelDeliveryChallan(id)
      await queryClient.invalidateQueries({ queryKey: ['deliveryChallans', id] })
      return response
    },
    onSuccess: async (response) => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['deliveryChallans', response.id] })
        await queryClient.invalidateQueries({ queryKey: ['deliveryOrders'] })
        form.reset(response)
        setEditMode(false)
        window.location.reload()
        toast.success('Delivery Challan cancelled successfully')
      } catch (error) {
        console.log(error)
        toast.error('Error invalidating cache.')
      } finally {
        setIsCancelling(false)
      }
    },
    onError: (error) => {
      setIsCancelling(false)
      console.log(error)
      toast.error('Error cancelling delivery challan.')
    },
  })

  const onSubmit = (data: TDeliveryChallan) => {
    deliveryChallanMutation.mutate(data)
  }

  const onFormError = (errors: FieldErrors<TDeliveryChallan>) => {
    console.log(errors)
  }

  const handleSelectDeliveryOrderItem = (item: TDeliverOrderItemMetadata) => {
    const currentItems = form.getValues('deliveryChallanItems')
    const itemIndex = currentItems.findIndex((i: TDeliveryChallanItem) => i.deliveryOrderItemId === item.id)
    console.log(item)
    if (itemIndex !== -1) {
      currentItems.splice(itemIndex, 1)
    } else {
      const newItem: TDeliveryChallanItem = {
        id: null,
        deliveryChallanId: form.getValues('id'),
        deliveryOrderItemId: item.id,
        district: item.district,
        taluka: item.taluka,
        locationName: item.locationName,
        materialName: item.materialName,
        quantity: item.quantity,
        deliveredQuantity: item.deliveredQuantity,
        rate: item.rate ?? 0.0,
        dueDate: item.dueDate,
        deliveringQuantity: 0.0,
      }
      currentItems.push(newItem)
    }

    form.setValue('deliveryChallanItems', currentItems)
  }

  if (deliveryOrderItemsQuery.isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm text-muted-foreground">Delivery Challan Details</p>
            <StatusBadge status={deliveryChallan.status} />
          </div>

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
            <Button type="button" disabled={isLoading || form.getValues('status') === 'cancelled'} size="sm" onClick={() => setEditMode(true)}>
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
                  <Input {...field} value={field.value ?? ''} disabled={true} className="bg-gray-100" />
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
                <FormLabel>Date of Challan</FormLabel>
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
                  <Input {...field} value={field.value ?? ''} disabled={true} className="bg-gray-100" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-4" />
        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-muted-foreground">Delivery Challan Items</p>
          <Dialog open={isSelectDeliveryOrderItemOpen} onOpenChange={setIsSelectDeliveryOrderItemOpen}>
            <DialogTrigger asChild>
              <Button type="button" size={'sm'} variant={'outline'} onClick={() => setIsSelectDeliveryOrderItemOpen(true)} disabled={isLoading || !editMode}>
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="overflow-y-auto max-w-7xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Select Delivery Item</DialogTitle>
              </DialogHeader>

              <div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead></TableHead>
                      <TableHead>District</TableHead>
                      <TableHead>Taluka</TableHead>
                      <TableHead>Location Name</TableHead>
                      <TableHead>Material Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Due Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deliveryOrderItemsQuery.data?.map((item: TDeliverOrderItemMetadata) => {
                      return (
                        <TableRow
                          key={item.id}
                          className={`cursor-pointer ${form.getValues('deliveryChallanItems').some((challanItem) => challanItem.deliveryOrderItemId === item.id) ? 'bg-gray-200' : ''}`}
                          onClick={() => handleSelectDeliveryOrderItem(item)}
                        >
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={form.getValues('deliveryChallanItems').some((challanItem) => challanItem.deliveryOrderItemId === item.id)}
                              readOnly
                            />
                          </TableCell>
                          <TableCell>{item.district}</TableCell>
                          <TableCell>{item.taluka}</TableCell>
                          <TableCell>{item.locationName}</TableCell>
                          <TableCell>{item.materialName}</TableCell>
                          <TableCell>
                            {item.quantity} | {item.deliveredQuantity}
                          </TableCell>
                          <TableCell>{item.rate}</TableCell>
                          <TableCell>{item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-GB') : '-'}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <DialogFooter className="px-4">
                <Button type="button" onClick={() => setIsSelectDeliveryOrderItemOpen(false)}>
                  Done
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="my-4" />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead className="w-1/12">District</TableHead>
              <TableHead className="w-1/12">Taluka</TableHead>
              <TableHead className="w-2/12">Location</TableHead>
              <TableHead className="w-1/12">Material</TableHead>
              <TableHead className="w-2/12">Quantity</TableHead>
              <TableHead className="w-1/12">Rate</TableHead>
              <TableHead className="w-1/12">Due Date</TableHead>
              <TableHead className="w-1/12">Delivering Quantity</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveryChallanItems.map((item: TDeliveryChallanItem, index: number) => {
              return (
                <TableRow key={item.deliveryOrderItemId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.district}</TableCell>
                  <TableCell>{item.taluka}</TableCell>
                  <TableCell>{item.locationName}</TableCell>
                  <TableCell>{item.materialName}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.quantity} |
                      {form.formState.dirtyFields.deliveryChallanItems?.[index]?.deliveringQuantity ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size={'icon'} type="button">
                                <CircleAlert className="w-4 h-4 text-amber-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>This value will be updated on save</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <span>{item.deliveredQuantity}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.rate}</TableCell>
                  <TableCell>{item.dueDate ? new Date(item.dueDate).toLocaleDateString('en-GB') : '-'}</TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`deliveryChallanItems.${index}.deliveringQuantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) => {
                                const value = parseFloat(e.target.value) || 0
                                field.onChange(value)

                                const currentItems = form.getValues('deliveryChallanItems')
                                currentItems[index].deliveringQuantity = value
                                const totalDeliveringQuantity = currentItems.reduce((acc, item) => acc + (item.deliveringQuantity || 0), 0)
                                form.setValue('totalDeliveringQuantity', totalDeliveringQuantity, {
                                  shouldValidate: true,
                                  shouldDirty: true,
                                })
                              }}
                              disabled={isLoading || !editMode}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <Button type="button" size={'icon'} variant={'ghost'} onClick={() => removeItemByIndex(index)} disabled={isLoading || !editMode}>
                      <Trash2Icon className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}

            <TableRow>
              <TableCell colSpan={8} className="text-right font-semibold px-4 py-2">
                Total Delivering Quantity
              </TableCell>
              <TableCell className="px-4 py-2">{form.getValues('totalDeliveringQuantity')}</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Separator className="my-4" />

        <div className="flex justify-between items-center">
          <p className="font-semibold text-sm text-muted-foreground">Transportation Details</p>
        </div>

        <div className="my-4" />

        <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="transportationCompanyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex items-center space-x-2">
                    <p>Transportation Company</p>
                  </div>
                </FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    disabled={isLoading || !editMode}
                    onValueChange={(value) => {
                      field.onChange(value)
                      form.setValue('vehicleId', null)
                      form.setValue('driverId', null)
                    }}
                    value={field.value ?? ''}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a transportation company" />
                    </SelectTrigger>
                    <SelectContent>
                      {transportationCompaniesQuery.data?.map((company) => (
                        <SelectItem key={company.id} value={company.id ?? ''}>
                          <span className={company.status === 'inactive' ? 'line-through text-red-500' : ''}>{company.companyName}</span>
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
            name="vehicleId"
            render={({ field }) => {
              return (
                <FormItem>
                  <div className="flex items-center space-x-2">
                    <FormLabel>Vehicle</FormLabel>

                    <DownloadIcon
                      className="w-4 h-4 cursor-pointer hover:text-blue-500"
                      onClick={() => {
                        const selectedVehicle = vehiclesToSelect.find((vehicle) => vehicle.id === field.value)
                        if (selectedVehicle?.rcBookUrl) {
                          downloadFileMutation.mutate(selectedVehicle.rcBookUrl)
                        }
                      }}
                    />
                  </div>
                  <FormControl>
                    <Select {...field} disabled={isLoading || !editMode || !vehiclesToSelect.length} onValueChange={field.onChange} value={field.value ?? ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehiclesToSelect.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id ?? ''}>
                            {vehicle.vehicleNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={form.control}
            name="driverId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormLabel>Driver</FormLabel>
                  <DownloadIcon
                    className="w-4 h-4 cursor-pointer hover:text-blue-500"
                    onClick={() => {
                      const selectedDriver = driversToSelect.find((driver) => driver.id === field.value)
                      if (selectedDriver?.drivingLicenseUrl) {
                        downloadFileMutation.mutate(selectedDriver.drivingLicenseUrl)
                      } else {
                        toast.error('No file has been uploaded yet.')
                      }
                    }}
                  />
                </div>
                <FormControl>
                  <Select {...field} disabled={isLoading || !editMode || !driversToSelect.length} onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      {driversToSelect.map((driver) => (
                        <SelectItem key={driver.id} value={driver.id ?? ''}>
                          {driver.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator className="my-4" />

        {form.getValues('status') === 'delivered' && (
          <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
            <DialogTrigger asChild>
              <Button variant={'destructive'} size={'sm'} disabled={isCancelling || isLoading}>
                {isCancelling ? 'Cancelling...' : 'Cancel Delivery Challan'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Cancellation</DialogTitle>
              </DialogHeader>
              <p>Are you sure you want to cancel this delivery challan? This action cannot be undone.</p>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setCancelOpen(false)}>
                  No
                </Button>
                <Button
                  variant={'destructive'}
                  onClick={async () => {
                    await cancelDeliveryChallanMutation.mutateAsync(deliveryChallan.id!)
                    setCancelOpen(false)
                  }}
                  disabled={isCancelling || isLoading}
                >
                  Yes, Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </form>
    </Form>
  )
}
