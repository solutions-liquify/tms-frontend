'use client'

import React from 'react'
import LocationForm from '@/app/portal/locations/location-form'
import { useQuery } from '@tanstack/react-query'
import { getLocation } from '@/lib/actions'
import { TLocation } from '@/schemas/location-schema'

interface ILocationPageProps {
  params: Promise<{
    id: string
  }>
}

export default function LocationPage({ params }: ILocationPageProps) {
  const unwrappedParams = React.use(params)
  const locationQuery = useQuery<TLocation>({
    queryKey: ['location', unwrappedParams.id],
    queryFn: () => getLocation(unwrappedParams.id),
    initialData: undefined,
    enabled: !!unwrappedParams.id,
  })

  if (locationQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (locationQuery.isError) {
    return <div>Error loading location. Please try again later.</div>
  }

  return <LocationForm enableEdit={false} location={locationQuery.data} />
}
