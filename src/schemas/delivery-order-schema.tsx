import * as z from 'zod'
import { PartySchema } from './party-schema'
import { LocationSchema } from './location-schema'
import { MaterialSchema } from './material-schema'

export const DeliveryOrderItemSchema = z.object({
  id: z.string().optional().nullable(),
  deliveryOrderId: z.string().optional().nullable(),
  deliverySectionId: z.string().optional().nullable(),
  state: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  taluka: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  location: LocationSchema,
  material: MaterialSchema,
  quantity: z.number(),
  pendingQuantity: z.number(),
  deliveredQuantity: z.number(),
  inProgressQuantity: z.number(),
  rate: z.number().optional().nullable(),
  unit: z.string().optional().nullable(),
  dueDate: z.number().optional().nullable(),
  status: z.string(),
  indexOrder: z.number(),
})

export const DeliveryOrderSectionSchema = z.object({
  id: z.string().optional().nullable(),
  deliveryOrderId: z.string().optional().nullable(),
  state: z.string().nullable().optional(),
  district: z.string().nullable().optional(),
  totalQuantity: z.number(),
  totalPendingQuantity: z.number(),
  totalInProgressQuantity: z.number(),
  totalDeliveredQuantity: z.number(),
  status: z.string(),
  indexOrder: z.number(),
  deliveryOrderItems: z.array(DeliveryOrderItemSchema).optional().nullable(),
})

export const DeliveryOrderSchema = z.object({
  id: z.string().optional().nullable(),
  contractId: z.string().optional().nullable(),
  party: PartySchema,
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
