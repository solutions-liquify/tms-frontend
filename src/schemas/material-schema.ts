import * as z from 'zod'

export const MaterialSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1),
})

export type TMaterial = z.infer<typeof MaterialSchema>
