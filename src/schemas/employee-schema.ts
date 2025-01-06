import * as z from 'zod'

export const EmployeeSchema = z.object({
  id: z.string().optional().nullable(),
  name: z.string().min(1),
  email: z.string().email(),
  contactNumber: z
    .string()
    .regex(/^\d{10}$/, { message: 'Number is invalid' })
    .optional()
    .nullable(),
  role: z.string().optional().nullable(),
  createdAt: z.number().optional().nullable(),
  status: z.string(),
})

export type TEmployee = z.infer<typeof EmployeeSchema>

export type ListEmployeesInput = {
  search?: string | null
  roles?: string[] | null
}
