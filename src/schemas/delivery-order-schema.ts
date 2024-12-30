import * as z from 'zod'

export const DeliveryOrderItemSchema = z.object({
  id: z.string().optional().nullable(),
  deliveryOrderId: z.string().optional().nullable(),
  district: z.string().nullable().optional(),
  taluka: z.string().nullable().optional(),
  locationId: z.string().optional().nullable(),
  materialId: z.string().optional().nullable(),
  quantity: z.number(),
  pendingQuantity: z.number(),
  deliveredQuantity: z.number(),
  inProgressQuantity: z.number(),
  rate: z.number().optional().nullable(),
  unit: z.string().optional().nullable(),
  dueDate: z.number().optional().nullable(),
  status: z.string(),
})

export const DeliveryOrderSectionSchema = z.object({
  district: z.string().nullable().optional(),
  totalQuantity: z.number(),
  totalPendingQuantity: z.number(),
  totalInProgressQuantity: z.number(),
  totalDeliveredQuantity: z.number(),
  status: z.string(),
  deliveryOrderItems: z.array(DeliveryOrderItemSchema).optional().nullable(),
})

export const DeliveryOrderSchema = z.object({
  id: z.string().optional().nullable(),
  contractId: z.string().optional().nullable(),
  partyId: z.string().optional().nullable(),
  dateOfContract: z.number().optional().nullable(),
  status: z.string(),
  grandTotalQuantity: z.number(),
  grandTotalPendingQuantity: z.number(),
  grandTotalInProgressQuantity: z.number(),
  grandTotalDeliveredQuantity: z.number(),
  createdAt: z.number().optional().nullable(),
  updatedAt: z.number().optional().nullable(),
  deliveryOrderSections: z.array(DeliveryOrderSectionSchema).optional().nullable(),
})

export type TDeliveryOrder = z.infer<typeof DeliveryOrderSchema>
export type TDeliveryOrderSection = z.infer<typeof DeliveryOrderSectionSchema>
export type TDeliveryOrderItem = z.infer<typeof DeliveryOrderItemSchema>
