'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { createTransportationCompany, downloadFile, listCities, listStates, updateTransportationCompany, uploadFile } from '@/lib/actions'
import { TransportationCompanySchema, TTransportationCompany } from '@/schemas/transportation-company-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { TrashIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FieldErrors, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface TransportationFormProps {
  transportationCompany?: TTransportationCompany
  enableEdit: boolean
}

export default function TransportationForm({ enableEdit, transportationCompany }: TransportationFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(enableEdit)
  const [fileLoading, setFileLoading] = useState(false)

  const form = useForm<TTransportationCompany>({
    resolver: zodResolver(TransportationCompanySchema),
    defaultValues: transportationCompany ?? { status: 'active' },
  })

  const statesQuery = useQuery<string[]>({
    queryKey: ['states'],
    queryFn: () => listStates(),
    initialData: [],
  })

  const citiesQuery = useQuery<string[]>({
    queryKey: ['cities', form.watch('state')],
    queryFn: () => listCities({ states: [form.watch('state') as string] }),
    initialData: [],
  })

  useEffect(() => {
    form.unregister('city')
  }, [form.watch('state')])

  const {
    fields: vehicleFields,
    append: appendVehicle,
    remove: removeVehicle,
  } = useFieldArray({
    control: form.control,
    name: 'vehicles',
  })

  const {
    fields: driverFields,
    append: appendDriver,
    remove: removeDriver,
  } = useFieldArray({
    control: form.control,
    name: 'drivers',
  })

  const mutation = useMutation({
    mutationFn: async (data: TTransportationCompany) => {
      setIsLoading(true)
      let response
      if (data.id) {
        response = await updateTransportationCompany(data)
        await queryClient.invalidateQueries({
          queryKey: ['transportationCompany', data.id],
        })
      } else {
        response = await createTransportationCompany(data)
      }
      return response
    },
    onSuccess: async (response) => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['transportationCompanies', response.id] })
        await queryClient.invalidateQueries({ queryKey: ['transportationCompanies'] })
        router.back()
        toast.success('Transportation Company saved successfully')
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

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      setFileLoading(true)
      const response = await uploadFile(file)
      return response
    },
    onSuccess: () => {
      toast.success('File uploaded successfully')
      setFileLoading(false)
    },
    onError: (error) => {
      console.log(error)
      toast.error('An error occurred during file upload. Please try again later.')
      setFileLoading(false)
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

  const onSubmit = (data: TTransportationCompany) => {
    mutation.mutate(data)
  }

  const onFormError = (errors: FieldErrors<TTransportationCompany>) => {
    console.log(errors)
  }

  if (statesQuery.isError || citiesQuery.isError) {
    return <div>Error loading data. Please try again later.</div>
  }

  if (fileLoading) {
    return <div>File Loading...</div>
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">Information about the transportation company.</p>
            {editMode && (
              <div className="flex space-x-2">
                <Button type="button" size="sm" disabled={isLoading} variant="ghost" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            )}

            {!editMode && (
              <Button type="button" disabled={isLoading || transportationCompany?.status === 'inactive'} size="sm" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            )}
          </div>

          <div className="my-4" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pointOfContact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Point of Contact</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 1</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Line 2</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'}
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a state" />
                      </SelectTrigger>
                      <SelectContent>
                        {statesQuery.data?.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
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
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      disabled={isLoading || !editMode || transportationCompany?.status === 'inactive' || !form.watch('state')}
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {citiesQuery.data?.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
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
              name="pinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pin Code</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="text-lg font-medium my-4">Vehicles</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-4 px-2 text-xs font-medium uppercase tracking-wider text-left">
                      #
                    </th>
                    <th scope="col" className="py-4 px-2 text-xs font-medium uppercase tracking-wider text-left w-1/3">
                      Vehicle Number
                    </th>
                    <th scope="col" className="py-4 px-2 text-xs font-medium uppercase tracking-wider text-left w-1/3">
                      Type
                    </th>
                    <th scope="col" className="py-4 px-2 text-xs font-medium uppercase tracking-wider text-center w-1/3">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicleFields.map((field, index) => (
                    <tr key={field.id}>
                      <td className="p-2 whitespace-nowrap text-sm text-muted-foreground text-left">{index + 1}</td>
                      <td className="p-2 whitespace-nowrap text-sm">
                        <FormField
                          control={form.control}
                          name={`vehicles.${index}.vehicleNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ''}
                                  disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'}
                                  className="disabled:ring-0 disabled:border-0 disabled:bg-transparent disabled:text-foreground disabled:shadow-none disabled:p-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>

                      <td className="p-2 whitespace-nowrap text-sm">
                        <FormField
                          control={form.control}
                          name={`vehicles.${index}.type`}
                          render={({ field }) => (
                            <Select
                              {...field}
                              disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'}
                              onValueChange={field.onChange}
                              value={field.value ?? ''}
                            >
                              <SelectTrigger className="disabled:ring-0 disabled:border-0 disabled:bg-transparent disabled:text-foreground disabled:shadow-none disabled:p-0">
                                <SelectValue placeholder="Select a type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="truck">Truck</SelectItem>
                                <SelectItem value="rickshaw">Rickshaw</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </td>
                      <td className="p-2 whitespace-nowrap text-sm text-right">
                        <div className="flex space-x-2 items-center justify-center">
                          {!form.watch(`vehicles.${index}.rcBookUrl`) && editMode && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                const fileInput = document.createElement('input')
                                fileInput.type = 'file'
                                fileInput.onchange = async (event) => {
                                  const file = (event.target as HTMLInputElement).files?.[0]
                                  if (file) {
                                    const response = await uploadFileMutation.mutateAsync(file)
                                    form.setValue(`vehicles.${index}.rcBookUrl`, response.publicId)
                                    toast.success('File uploaded successfully')
                                  }
                                }
                                fileInput.click()
                              }}
                            >
                              Upload RC
                            </Button>
                          )}

                          {form.watch(`vehicles.${index}.rcBookUrl`) && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => downloadFileMutation.mutate(form.watch(`vehicles.${index}.rcBookUrl`) as string)}
                            >
                              Download RC
                            </Button>
                          )}

                          {editMode && (
                            <Button type="button" size="icon" variant="ghost" onClick={() => removeVehicle(index)}>
                              <TrashIcon className="h-4 w-4 text-red-600 hover:text-red-900" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {editMode && (
              <Button type="button" onClick={() => appendVehicle({ vehicleNumber: '' })} className="mt-4" size="sm">
                Add Vehicle
              </Button>
            )}
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="text-lg font-medium my-4">Drivers</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-4 px-2 text-xs font-medium uppercase tracking-wider text-left">
                      #
                    </th>
                    <th scope="col" className="py-4 px-2 text-xs font-medium uppercase tracking-wider text-left w-1/3">
                      Name
                    </th>
                    <th scope="col" className="py-4 px-2 text-xs font-medium uppercase tracking-wider text-left w-1/3">
                      Contact Number
                    </th>
                    <th scope="col" className="py-4 px-2 text-xs font-medium uppercase tracking-wider text-center w-1/3">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {driverFields.map((field, index) => (
                    <tr key={field.id}>
                      <td className="p-2 whitespace-nowrap text-sm text-muted-foreground text-left">{index + 1}</td>

                      <td className="p-2 whitespace-nowrap text-sm">
                        <FormField
                          control={form.control}
                          name={`drivers.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ''}
                                  disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'}
                                  className="disabled:ring-0 disabled:border-0 disabled:bg-transparent disabled:text-foreground disabled:shadow-none disabled:p-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>
                      <td className="p-2 whitespace-nowrap text-sm">
                        <FormField
                          control={form.control}
                          name={`drivers.${index}.contactNumber`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ''}
                                  disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'}
                                  className="disabled:ring-0 disabled:border-0 disabled:bg-transparent disabled:text-foreground disabled:shadow-none disabled:p-0"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </td>

                      <td className="p-2 whitespace-nowrap text-sm text-center w-1/4">
                        <div className="flex space-x-2 items-center justify-center">
                          {!field.drivingLicenseUrl && editMode && (
                            <Button type="button" size="sm" variant="outline" disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'}>
                              Upload DL
                            </Button>
                          )}
                          {editMode && (
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={() => removeDriver(index)}
                              disabled={isLoading || !editMode || transportationCompany?.status === 'inactive'}
                            >
                              <TrashIcon className="h-4 w-4 text-red-600 hover:text-red-900" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {editMode && (
              <Button type="button" onClick={() => appendDriver({ name: '' })} className="mt-4" size="sm">
                Add Driver
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
