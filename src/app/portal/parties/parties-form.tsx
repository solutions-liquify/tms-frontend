'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { activateParty, createParty, deactivateParty, listCities, listDistricts, listStates, listTalukas, updateParty } from '@/lib/actions'
import { PartySchema, TParty } from '@/schemas/party-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface PartyFormProps {
  party?: TParty
  enableEdit: boolean
}

export default function PartyForm({ enableEdit, party }: PartyFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(enableEdit)

  const form = useForm<TParty>({
    resolver: zodResolver(PartySchema),
    defaultValues: party ?? { status: 'active' },
  })

  const statesQuery = useQuery<string[]>({
    queryKey: ['states'],
    queryFn: () => listStates(),
    initialData: [],
  })

  const districtsQuery = useQuery<string[]>({
    queryKey: ['districts', form.watch('state')],
    queryFn: () =>
      listDistricts({
        states: form.watch('state') ? [form.watch('state') as string] : [],
      }),
    initialData: [],
  })

  const talukasQuery = useQuery<string[]>({
    queryKey: ['talukas', form.watch('state'), form.watch('district')],
    queryFn: () =>
      listTalukas({
        states: form.watch('state') ? [form.watch('state') as string] : [],
        districts: form.watch('district') ? [form.watch('district') as string] : [],
      }),
    initialData: [],
  })

  const citiesQuery = useQuery<string[]>({
    queryKey: ['cities', form.watch('state'), form.watch('district'), form.watch('taluka')],
    queryFn: () =>
      listCities({
        states: form.watch('state') ? [form.watch('state') as string] : [],
        districts: form.watch('district') ? [form.watch('district') as string] : [],
        talukas: form.watch('taluka') ? [form.watch('taluka') as string] : [],
      }),
    initialData: [],
  })

  const mutation = useMutation({
    mutationFn: async (data: TParty) => {
      setIsLoading(true)
      if (data.id) {
        await updateParty(data)
        await queryClient.invalidateQueries({
          queryKey: ['party', data.id],
        })
      } else {
        await createParty(data)
      }
    },
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['parties'] })
        toast.success('Party saved successfully')
        router.back()
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

  const deactivateMutation = useMutation({
    mutationFn: async (id: string) => {
      setIsLoading(true)
      await deactivateParty(id)
    },
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['parties'] })
        toast.success('Party deactivated successfully')
        router.back()
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

  const activateMutation = useMutation({
    mutationFn: async (id: string) => {
      setIsLoading(true)
      await activateParty(id)
    },
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['parties'] })
        toast.success('Party activated successfully')
        router.back()
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

  const onSubmit = (data: TParty) => {
    mutation.mutate(data)
  }

  const onFormError = (errors: any) => {
    console.log(errors)
  }

  useEffect(() => {
    form.unregister('district')
    form.unregister('taluka')
    form.unregister('city')
  }, [form.watch('state')])

  useEffect(() => {
    form.unregister('taluka')
    form.unregister('city')
  }, [form.watch('district')])

  useEffect(() => {
    form.unregister('city')
  }, [form.watch('taluka')])

  if (statesQuery.isLoading || districtsQuery.isLoading || talukasQuery.isLoading || citiesQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (statesQuery.isError || districtsQuery.isError || talukasQuery.isError || citiesQuery.isError) {
    return <div>Error loading data. Please try again later.</div>
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">Information about the party that will be sending/receiving the materials.</p>
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
              <Button type="button" disabled={isLoading} size="sm" onClick={() => setEditMode(true)}>
                Edit
              </Button>
            )}
          </div>

          <div className="my-4" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || party?.status === 'inactive'} />
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
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || party?.status === 'inactive'} />
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
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || party?.status === 'inactive'} />
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
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || party?.status === 'inactive'} />
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
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || party?.status === 'inactive'} />
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
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || party?.status === 'inactive'} />
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
                      disabled={isLoading || !editMode || party?.status === 'inactive'}
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
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>District</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      disabled={isLoading || !editMode || party?.status === 'inactive'}
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                    >
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
            <FormField
              control={form.control}
              name="taluka"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taluka</FormLabel>
                  <FormControl>
                    <Select
                      {...field}
                      disabled={isLoading || !editMode || party?.status === 'inactive'}
                      onValueChange={field.onChange}
                      value={field.value ?? ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a taluka" />
                      </SelectTrigger>
                      <SelectContent>
                        {talukasQuery.data?.map((taluka) => (
                          <SelectItem key={taluka} value={taluka}>
                            {taluka}
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
                      disabled={isLoading || !editMode || party?.status === 'inactive'}
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
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pin Code</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode || party?.status === 'inactive'} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="my-4" />

          {editMode && party && party?.id && party?.status === 'active' && (
            <Button variant="destructive" disabled={isLoading} onClick={() => deactivateMutation.mutateAsync(party?.id ?? '')}>
              Delete Party
            </Button>
          )}

          {party && party?.status === 'inactive' && <p className="text-muted-foreground text-red-500 my-4 text-sm">This party is deactivated.</p>}

          {editMode && party && party?.id && party?.status === 'inactive' && (
            <Button
              disabled={isLoading}
              onClick={() => activateMutation.mutateAsync(party?.id ?? '')}
              className="bg-green-100 hover:bg-green-400 text-green-800"
            >
              Activate Party
            </Button>
          )}
        </form>
      </Form>
    </div>
  )
}
