'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { createMaterial, updateMaterial } from '@/lib/actions'
import { MaterialSchema, TMaterial } from '@/schemas/material-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface MaterialFormProps {
  material?: TMaterial
  enableEdit: boolean
}

export default function MaterialForm({ enableEdit, material }: MaterialFormProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [editMode, setEditMode] = useState(enableEdit)

  const form = useForm<TMaterial>({
    resolver: zodResolver(MaterialSchema),
    defaultValues: material ?? {},
  })

  const mutation = useMutation({
    mutationFn: async (data: TMaterial) => {
      setIsLoading(true)
      if (data.id) {
        await updateMaterial(data)
        await queryClient.invalidateQueries({
          queryKey: ['material', data.id],
        })
      } else {
        await createMaterial(data)
      }
    },
    onSuccess: async () => {
      try {
        await queryClient.invalidateQueries({ queryKey: ['materials'] })
        toast.success('Material saved successfully')
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

  const onSubmit = (data: TMaterial) => {
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
            <p className="text-muted-foreground text-sm">Types of materials that are used in the supply chain.</p>
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
                    <Input {...field} value={field.value ?? ''} disabled={isLoading || !editMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  )
}
