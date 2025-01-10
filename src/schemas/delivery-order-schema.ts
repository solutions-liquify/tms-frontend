import * as z from 'zod'

export const AssociatedDeliverChallanItemMetadataSchema = z.object({
  id: z.string(),
  deliveringQuantity: z.number().default(0.0),
  deliveryChallanId: z.string(),
  status: z.string(),
})

export const DeliveryOrderItemSchema = z.object({
  id: z.string().optional().nullable(),
  deliveryOrderId: z.string().optional().nullable(),
  district: z.string().nullable().optional(),
  taluka: z.string().nullable().optional(),
  locationId: z.string().optional().nullable(),
  materialId: z.string().optional().nullable(),
  quantity: z.number(),
  deliveredQuantity: z.number(),
  rate: z.number().optional().nullable(),
  dueDate: z.number().optional().nullable(),
  associatedDeliveryChallanItems: z.array(AssociatedDeliverChallanItemMetadataSchema).optional().nullable(),
})

export const DeliveryOrderSectionSchema = z.object({
  district: z.string().nullable().optional(),
  totalQuantity: z.number(),
  totalDeliveredQuantity: z.number(),
  deliveryOrderItems: z.array(DeliveryOrderItemSchema).optional().nullable(),
})

export const DeliveryOrderSchema = z.object({
  id: z.string().optional().nullable(),
  contractId: z.string(),
  partyId: z.string(),
  dateOfContract: z.number().optional().nullable(),
  status: z.string(),
  grandTotalQuantity: z.number(),
  grandTotalDeliveredQuantity: z.number(),
  createdAt: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
  deliveryOrderSections: z.array(DeliveryOrderSectionSchema).optional().nullable(),
})

export type TDeliveryOrder = z.infer<typeof DeliveryOrderSchema>
export type TDeliveryOrderSection = z.infer<typeof DeliveryOrderSectionSchema>
export type TDeliveryOrderItem = z.infer<typeof DeliveryOrderItemSchema>
export type TAssociatedDeliverChallanItemMetadata = z.infer<typeof AssociatedDeliverChallanItemMetadataSchema>

export type ListDeliveryOrdersInput = {
  search?: string | null
  page?: number
  size?: number
  statuses?: string[] | null
  partyIds?: string[] | null
  fromDate?: number | null
  toDate?: number | null
}

export type DeliveryOrderRecord = {
  id: string
  contractId: string
  partyName: string
  status: string
  grandTotalQuantity: number
  grandTotalDeliveredQuantity: number
  dateOfContract: number | null
}

export type TDeliverOrderItemMetadata = {
  id: string
  district: string
  taluka: string
  locationName: string
  materialName: string
  quantity: number
  status: string
  rate?: number | null
  dueDate?: number | null
  deliveredQuantity: number
  inProgressQuantity: number
}


export type ListPendingDeliveryOrderItemInput = {
  page: number
  size: number
}
