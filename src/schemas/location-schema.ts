import * as z from 'zod'

export const LocationSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1),
  pointOfContact: z.string().optional().nullable(),
  contactNumber: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  district: z.string().min(1),
  taluka: z.string().min(1),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  createdAt: z.number().optional().nullable(),
})

export type TLocation = z.infer<typeof LocationSchema>

export type ListLocationsInput = {
  state?: string | null
  district?: string | null
  taluka?: string | null
  city?: string | null
}
