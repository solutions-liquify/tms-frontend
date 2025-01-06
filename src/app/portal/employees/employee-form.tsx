'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createEmployee, deactivateEmployee, updateEmployee } from '@/lib/actions'
import { EmployeeSchema, TEmployee } from '@/schemas/employee-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { listRoles } from '@/lib/utils'
import { Dialog, DialogFooter, DialogHeader, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from '@/components/ui/dialog'
interface EmployeeFormProps {
  employee?: TEmployee
  enableEdit: boolean
}

export default function EmployeeForm({ enableEdit, employee }: EmployeeFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(enableEdit)
  const [open, setOpen] = useState(false)

  const form = useForm<TEmployee>({
    resolver: zodResolver(EmployeeSchema),
    defaultValues: employee ?? { status: 'active' },
  })

  const mutation = useMutation({
    mutationFn: async (data: TEmployee) => {
      setIsLoading(true)
      if (data.id) {
        await updateEmployee(data)
        await queryClient.invalidateQueries({
          queryKey: ['employee', data.id],
        })
      } else {
        await createEmployee(data)
      }
    },
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['employees'] })
        toast.success('Employee saved successfully')
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
      await deactivateEmployee(id)
    },
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['employees'] })
        toast.success('Employee deactivated successfully')
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

  const onSubmit = (data: TEmployee) => {
    mutation.mutate(data)
  }

  const onFormError = (errors: any) => {
    console.log(errors)
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onFormError)}>
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm">Information about the employee.</p>
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
              <Button type="button" disabled={isLoading || employee?.status === 'inactive'} size="sm" onClick={() => setEditMode(true)}>
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
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode} />
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
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode} />
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
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select {...field} value={field.value ?? ''} disabled={isLoading || !editMode} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        {listRoles().map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
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

          <div className="my-4" />

          {editMode && employee && employee?.id && employee?.status === 'active' && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" disabled={isLoading}>
                  Deactivate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deactivate Employee</DialogTitle>
                  <DialogDescription>Are you sure you want to deactivate this employee? This action cannot be undone.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await deactivateMutation.mutateAsync(employee?.id ?? '')
                      setOpen(false)
                    }}
                  >
                    {isLoading ? 'Deactivating...' : 'Deactivate'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {employee && employee?.status === 'inactive' && <p className="text-muted-foreground text-red-500 my-4 text-sm">This employee is deactivated.</p>}
        </form>
      </Form>
    </div>
  )
}
