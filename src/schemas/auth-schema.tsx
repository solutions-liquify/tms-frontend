import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export type TLogin = z.infer<typeof LoginSchema>
