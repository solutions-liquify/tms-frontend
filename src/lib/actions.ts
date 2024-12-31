import { ListLocationsInput, TLocation } from '@/schemas/location-schema'
import { ListPartiesInput, TParty } from '@/schemas/party-schema'

import axios from 'axios'
import { getBackendUrl } from './utils'
import { ListCitiesInput, ListDistrictsInput, ListTalukasInput } from '@/schemas/state-district-taluka-city-schema'
import { TMaterial } from '@/schemas/material-schema'
import { ListEmployeesInput, TEmployee } from '@/schemas/employee-schema'
import { TLogin } from '@/schemas/auth-schema'
import { authService } from '@/lib/auth'
import { ListDeliveryOrdersInput, TDeliveryOrder } from '@/schemas/delivery-order-schema'

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
