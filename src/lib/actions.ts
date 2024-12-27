import { ListLocationsInput, TLocation } from '@/schemas/location-schema'
import { ListPartiesInput, TParty } from '@/schemas/party-schema'

import axios from 'axios'
import { getBackendUrl } from './utils'
import { ListCitiesInput, ListDistrictsInput, ListTalukasInput } from '@/schemas/state-district-taluka-city-schema'
import { TMaterial } from '@/schemas/material-schema'
import { ListEmployeesInput, TEmployee } from '@/schemas/employee-schema'

// Godown Location API
export const createLocation = async (data: TLocation) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/locations/create`, data)
  return response.data
}

export const updateLocation = async (data: TLocation) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/locations/update`, data)
  return response.data
}

export const listLocations = async (data: ListLocationsInput) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/locations/list`, data)
  return response.data
}

export const getLocation = async (id: string) => {
  const response = await axios.get(`${getBackendUrl()}/api/v1/locations/get/${id}`)
  return response.data
}

// Party API

export const createParty = async (data: TParty) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/parties/create`, data)
  return response.data
}

export const updateParty = async (data: TParty) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/parties/update`, data)
  return response.data
}

export const listParties = async (data: ListPartiesInput) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/parties/list`, data)
  return response.data
}

export const getParty = async (id: string) => {
  const response = await axios.get(`${getBackendUrl()}/api/v1/parties/get/${id}`)
  return response.data
}

// Location2 State
export const listStates = async () => {
  const response = await axios.get(`${getBackendUrl()}/api/v1/states/list`)
  return response.data
}

// Location2 District
export const listDistricts = async (data: ListDistrictsInput) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/districts/list`, data)
  return response.data
}

// Location2 Taluka
export const listTalukas = async (data: ListTalukasInput) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/talukas/list`, data)
  return response.data
}

// Location2 City
export const listCities = async (data: ListCitiesInput) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/cities/list`, data)
  return response.data
}

// Material API
export const listMaterials = async () => {
  const response = await axios.get(`${getBackendUrl()}/api/v1/materials/list`)
  return response.data
}

export const createMaterial = async (data: TMaterial) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/materials/create`, data)
  return response.data
}

export const updateMaterial = async (data: TMaterial) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/materials/update`, data)
  return response.data
}

export const getMaterial = async (id: string) => {
  const response = await axios.get(`${getBackendUrl()}/api/v1/materials/get/${id}`)
  return response.data
}

// Employee API
export const createEmployee = async (data: TEmployee) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/employees/create`, data)
  return response.data
}

export const updateEmployee = async (data: TEmployee) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/employees/update`, data)
  return response.data
}

export const listEmployees = async (data: ListEmployeesInput) => {
  const response = await axios.post(`${getBackendUrl()}/api/v1/employees/list`, data)
  return response.data
}

export const getEmployee = async (id: string) => {
  const response = await axios.get(`${getBackendUrl()}/api/v1/employees/get/${id}`)
  return response.data
}
