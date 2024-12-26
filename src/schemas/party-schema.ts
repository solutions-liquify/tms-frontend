import * as z from 'zod'

export const PartySchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1),
  pointOfContact: z.string().optional().nullable(),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, { message: 'Number is invalid' })
    .optional()
    .nullable(),
  email: z.string().email().optional().nullable(),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  district: z.string().optional().nullable(),
  taluka: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  createdAt: z.number().optional().nullable(),
})

export type TParty = z.infer<typeof PartySchema>

export type ListPartiesInput = {
  search?: string | null
  states?: string[]
  districts?: string[]
  talukas?: string[]
  cities?: string[]
}
