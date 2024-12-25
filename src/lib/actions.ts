import { ListLocationsInput, TLocation } from '@/schemas/location-schema'
import axios from 'axios'

//Godown Location API
export const createLocation = async (data: TLocation) => {
  const response = await axios.post('/api/locations/create', data)
  return response.data
}

export const updateLocation = async (data: TLocation) => {
  const response = await axios.post(`/api/locations/update`, data)
  return response.data
}

export const listLocations = async (data: ListLocationsInput) => {
  const response = await axios.post('/api/locations/list', data)
  return response.data
}

export const getLocation = async (id: string) => {
  const response = await axios.get(`/api/locations/get/${id}`)
  return response.data
}
