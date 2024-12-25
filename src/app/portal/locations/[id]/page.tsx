'use client'

import LocationForm from '@/app/portal/locations/location-form'
import { useQuery } from '@tanstack/react-query'
import { getLocation } from '@/lib/actions'
import { TLocation } from '@/schemas/location-schema'

interface ILocationPageProps {
  params: {
    id: string
  }
}

export default function LocationPage({ params }: ILocationPageProps) {
  const locationQuery = useQuery<TLocation>({
    queryKey: ['location', params.id],
    queryFn: () => getLocation(params.id),
    initialData: undefined,
    enabled: !!params.id,
  })

  if (locationQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (locationQuery.isError) {
    return <div>Error loading location. Please try again later.</div>
  }

  return <LocationForm enableEdit={false} location={locationQuery.data} />
}
