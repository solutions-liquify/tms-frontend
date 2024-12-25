import { ListLocationsInput, TLocation } from '@/schemas/location-schema'
import { ListPartiesInput, TParty } from '@/schemas/party-schema'

import axios from 'axios'
import { getBackendUrl } from './utils'
import { ListCitiesInput, ListDistrictsInput, ListTalukasInput } from '@/schemas/state-district-taluka-city-schema'

// Godown Location API
export const createLocation = async (data: TLocation) => {
  const response = await axios.post(`${getBackendUrl()}/api/locations/create`, data)
  return response.data
}

export const updateLocation = async (data: TLocation) => {
  const response = await axios.post(`${getBackendUrl()}/api/locations/update`, data)
  return response.data
}

export const listLocations = async (data: ListLocationsInput) => {
  const response = await axios.post(`${getBackendUrl()}/api/locations/list`, data)
  return response.data
}

export const getLocation = async (id: string) => {
  const response = await axios.get(`${getBackendUrl()}/api/locations/get/${id}`)
  return response.data
}

// Party API

export const createParty = async (data: TParty) => {
  const response = await axios.post(`${getBackendUrl()}/api/parties/create`, data)
  return response.data
}

export const updateParty = async (data: TParty) => {
  const response = await axios.post(`${getBackendUrl()}/api/parties/update`, data)
  return response.data
}

export const listParties = async (data: ListPartiesInput) => {
  const response = await axios.post(`${getBackendUrl()}/api/parties/list`, data)
  return response.data
}

export const getParty = async (id: string) => {
  const response = await axios.get(`${getBackendUrl()}/api/parties/get/${id}`)
  return response.data
}

// Location2 State
export const listStates = async () => {
  const response = await axios.get(`${getBackendUrl()}/api/states/list`)
  return response.data
}

// Location2 District
export const listDistricts = async (data: ListDistrictsInput) => {
  const response = await axios.post(`${getBackendUrl()}/api/districts/list`, data)
  return response.data
}

// Location2 Taluka
export const listTalukas = async (data: ListTalukasInput) => {
  const response = await axios.post(`${getBackendUrl()}/api/talukas/list`, data)
  return response.data
}

// Location2 City
export const listCities = async (data: ListCitiesInput) => {
  const response = await axios.post(`${getBackendUrl()}/api/cities/list`, data)
  return response.data
}
