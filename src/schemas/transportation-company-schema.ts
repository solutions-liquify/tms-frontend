import * as z from 'zod'

export const VehicleSchema = z.object({
  id: z.string().optional().nullable(),
  vehicleNumber: z.string().min(1),
  type: z.string().optional().nullable(),
  rcBookUrl: z.string().optional().nullable(),
})

export const DriverSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/)
    .optional()
    .nullable(),
  drivingLicenseUrl: z.string().optional().nullable(),
})

export const TransportationCompanySchema = z.object({
  id: z.string().optional().nullable(),
  companyName: z.string().min(1),
  pointOfContact: z.string().optional().nullable(),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/)
    .optional()
    .nullable(),
  email: z.string().email().optional().nullable(),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  pinCode: z.string().optional().nullable(),
  status: z.string().min(1),
  vehicles: z.array(VehicleSchema).optional().nullable(),
  drivers: z.array(DriverSchema).optional().nullable(),
  createdAt: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
})

export type TTransportationCompany = z.infer<typeof TransportationCompanySchema>
export type TVehicle = z.infer<typeof VehicleSchema>
export type TDriver = z.infer<typeof DriverSchema>

export type ListTransportationCompaniesInput = {
  search?: string
  page?: number
  size?: number
  getAll?: boolean
  statuses?: string[]
}
