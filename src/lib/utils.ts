import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBackendUrl() {
  return process.env.NEXT_PUBLIC_BACKEND_SERVICE_URL
}

export function listRoles() {
  return ['ADMIN', 'STAFF']
}
