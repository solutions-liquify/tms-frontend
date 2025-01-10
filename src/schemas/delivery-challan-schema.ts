import * as z from 'zod'

export const DeliveryChallanItemSchema = z.object({
  id: z.string().optional().nullable(),
  deliveryChallanId: z.string().optional().nullable(),
  deliveryOrderItemId: z.string().optional().nullable(),
  district: z.string(),
  taluka: z.string(),
  locationName: z.string().optional().nullable(),
  materialName: z.string().optional().nullable(),
  quantity: z.number().default(0.0),
  deliveredQuantity: z.number().default(0.0),
  rate: z.number().default(0.0),
  dueDate: z.number().optional().nullable(),
  deliveringQuantity: z.number(),
})

export const DeliveryChallanSchema = z.object({
  id: z.string().optional().nullable(),
  deliveryOrderId: z.string(),
  dateOfChallan: z.number().optional().nullable(),
  status: z.string(),
  partyName: z.string().optional().nullable(),
  totalDeliveringQuantity: z.number().default(0.0),
  createdAt: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
  transportationCompanyId: z.string().optional().nullable(),
  vehicleId: z.string().optional().nullable(),
  driverId: z.string().optional().nullable(),
  deliveryChallanItems: z.array(DeliveryChallanItemSchema).default([]),
})

export type TDeliveryChallan = z.infer<typeof DeliveryChallanSchema>
export type TDeliveryChallanItem = z.infer<typeof DeliveryChallanItemSchema>

export type ListDeliveryChallansInput = {
  search?: string | null
  page?: number
  size?: number
  deliveryOrderIds?: string[]
  fromDate?: number | null
  toDate?: number | null
  partyIds?: string[] | null
  transportationCompanyIds?: string[] | null
  getAll?: boolean
  statuses?: string[] | null
}

export type DeliveryChallanOutputRecord = {
  id: string
  deliveryOrderId: string
  dateOfChallan?: number | null
  status: string
  partyName: string
  totalDeliveringQuantity: number
  driverName: string
  transportationCompanyName: string
}
