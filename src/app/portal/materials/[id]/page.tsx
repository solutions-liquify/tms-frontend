'use client'

import React from 'react'
import MaterialForm from '@/app/portal/materials/material-form'
import { useQuery } from '@tanstack/react-query'
import { getMaterial } from '@/lib/actions'
import { TMaterial } from '@/schemas/material-schema'

interface IMaterialPageProps {
  params: Promise<{
    id: string
  }>
}

export default function MaterialPage({ params }: IMaterialPageProps) {
  const unwrappedParams = React.use(params)
  const materialQuery = useQuery<TMaterial>({
    queryKey: ['material', unwrappedParams.id],
    queryFn: () => getMaterial(unwrappedParams.id),
    initialData: undefined,
    enabled: !!unwrappedParams.id,
  })

  if (materialQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (materialQuery.isError) {
    return <div>Error loading material. Please try again later.</div>
  }

  return <MaterialForm enableEdit={false} material={materialQuery.data} />
}
