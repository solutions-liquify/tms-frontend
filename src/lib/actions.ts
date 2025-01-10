import { ListLocationsInput, TLocation } from '@/schemas/location-schema'
import { ListPartiesInput, TParty } from '@/schemas/party-schema'

import axios from 'axios'
import { getBackendUrl } from './utils'
import { ListCitiesInput, ListDistrictsInput, ListTalukasInput } from '@/schemas/state-district-taluka-city-schema'
import { TMaterial } from '@/schemas/material-schema'
import { ListEmployeesInput, TEmployee } from '@/schemas/employee-schema'
import { TLogin } from '@/schemas/auth-schema'
import { authService } from '@/lib/auth'
import { ListDeliveryOrdersInput, ListPendingDeliveryOrderItemInput, TDeliveryOrder } from '@/schemas/delivery-order-schema'
import { ListDeliveryChallansInput, TDeliveryChallan } from '@/schemas/delivery-challan-schema'
import { ListTransportationCompaniesInput, TTransportationCompany } from '@/schemas/transportation-company-schema'

// Godown Location API
export const createLocation = async (data: TLocation) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/locations/create`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const updateLocation = async (data: TLocation) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/locations/update`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const listLocations = async (data: ListLocationsInput) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/locations/list`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const getLocation = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/locations/get/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const deactivateLocation = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/locations/deactivate/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const activateLocation = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/locations/activate/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Party API

export const createParty = async (data: TParty) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/parties/create`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const updateParty = async (data: TParty) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/parties/update`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const listParties = async (data: ListPartiesInput) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/parties/list`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const getParty = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/parties/get/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const deactivateParty = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/parties/deactivate/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const activateParty = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/parties/activate/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Location2 State
export const listStates = async () => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/states/list`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Location2 District
export const listDistricts = async (data: ListDistrictsInput) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/districts/list`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Location2 Taluka
export const listTalukas = async (data: ListTalukasInput) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/talukas/list`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Location2 City
export const listCities = async (data: ListCitiesInput) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/cities/list`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Material API
export const listMaterials = async () => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/materials/list`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const createMaterial = async (data: TMaterial) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/materials/create`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const updateMaterial = async (data: TMaterial) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/materials/update`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const getMaterial = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/materials/get/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Employee API
export const createEmployee = async (data: TEmployee) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/employees/create`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const updateEmployee = async (data: TEmployee) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/employees/update`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const listEmployees = async (data: ListEmployeesInput) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/employees/list`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const getEmployee = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/employees/get/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const deactivateEmployee = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/employees/deactivate/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Auth API
export const login = async (data: TLogin) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/auth/login`, data)
  return response.data
}

export const refreshUserToken = async (data: { refreshToken: string }) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/auth/refresh`, data)
  return response.data
}

export const getNewAccessToken = async (accessToken: string, refreshToken: string) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/auth/refresh`, { accessToken, refreshToken })
  return response.data
}

// Delivery Order API
export const createDeliveryOrder = async (data: TDeliveryOrder) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/delivery-orders/create`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const updateDeliveryOrder = async (data: TDeliveryOrder) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/delivery-orders/update`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const getDeliveryOrder = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/delivery-orders/get/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const listDeliveryOrders = async (data: ListDeliveryOrdersInput) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/delivery-orders/list`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Delivery Challan API
export const createDeliveryChallan = async (data: TDeliveryChallan) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/delivery-challans/create`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const createDeliveryChallanFromDeliveryOrder = async (deliveryOrderId: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/delivery-challans/create/from-delivery-order/${deliveryOrderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const updateDeliveryChallan = async (data: TDeliveryChallan) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/delivery-challans/update`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const getDeliveryChallan = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/delivery-challans/get/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const listDeliveryChallans = async (data: ListDeliveryChallansInput) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/delivery-challans/list`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const cancelDeliveryChallan = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.delete(`${getBackendUrl()}/api/v1/delivery-challans/cancel/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const listDeliveryOrderItemsForDeliveryOrderId = async (deliveryOrderId: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/delivery-orders/list/delivery-order-items/${deliveryOrderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

// Transportation Company API
export const createTransportationCompany = async (data: TTransportationCompany) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/transportation-companies/create`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const updateTransportationCompany = async (data: TTransportationCompany) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/transportation-companies/update`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const getTransportationCompany = async (id: string) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.get(`${getBackendUrl()}/api/v1/transportation-companies/get/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const listTransportationCompanies = async (data: ListTransportationCompaniesInput) => {
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/transportation-companies/list`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export const uploadFile = async (file: File) => {
  const accessToken = await authService.getAccessToken()
  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post(`${getBackendUrl()}/api/v1/files/upload`, formData, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    },
  })

  if (response.status !== 200) {
    throw new Error('Failed to upload file')
  }

  return response.data
}

export const downloadFile = async (publicId: string) => {
  const accessToken = await authService.getAccessToken()
  try {
    const response = await axios.get(`${getBackendUrl()}/api/v1/files/download/${publicId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'arraybuffer',
    })

    if (response.status !== 200) {
      throw new Error('Failed to download file')
    }

    const uploadDetails = await axios.get(`${getBackendUrl()}/api/v1/files/uploadDetails/${publicId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    const fileExtension = uploadDetails.data.fileExtension
    const originalFilename = uploadDetails.data.originalFilename || publicId

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${originalFilename}.${fileExtension}`)
    document.body.appendChild(link)
    link.click()
    link.remove()
  } catch (error: any) {
    throw new Error(`Failed to download file : ${error.message}`)
  }
}

// Dashboard API

export const listPendingDeliveryOrderItems = async (data: ListPendingDeliveryOrderItemInput) => {
  console.log('data', data)
  const accessToken = await authService.getAccessToken()
  const response = await axios.post(`${getBackendUrl()}/api/v1/delivery-orders/list/pending-delivery-order-items`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}
