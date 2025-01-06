'use client'

import { TLogin } from '@/schemas/auth-schema'
import { LoginSchema } from '@/schemas/auth-schema'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { login } from '@/lib/actions'
import { authService } from '@/lib/auth'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAccessToken = async () => {
      const accessToken = await authService.getAccessToken()
      if (accessToken) {
        router.push('/portal/dashboard')
      }
    }
    fetchAccessToken()
  }, [])

  const form = useForm<TLogin>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {},
  })

  const onSubmit = async (data: TLogin) => {
    try {
      setIsLoading(true)
      const res = await login(data)
      authService.setTokens(res)
      router.push('/portal/dashboard')
    } catch (error) {
      console.log(error)
      toast.error('An error occurred while logging in. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-balance text-sm text-muted-foreground">Enter your email below to login to your account</p>
        </div>
        <div className="grid gap-6 my-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} type="email" disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ''} type="password" disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Login
          </Button>
        </div>
      </form>
    </Form>
  )
}
