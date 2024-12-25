'use client'

import React from 'react'
import PartyForm from '@/app/portal/parties/parties-form'
import { useQuery } from '@tanstack/react-query'
import { getParty } from '@/lib/actions'
import { TParty } from '@/schemas/party-schema'

interface IPartyPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PartyPage({ params }: IPartyPageProps) {
  const unwrappedParams = React.use(params)
  const partyQuery = useQuery<TParty>({
    queryKey: ['party', unwrappedParams.id],
    queryFn: () => getParty(unwrappedParams.id),
    initialData: undefined,
    enabled: !!unwrappedParams.id,
  })

  if (partyQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (partyQuery.isError) {
    return <div>Error loading party. Please try again later.</div>
  }

  return <PartyForm enableEdit={false} party={partyQuery.data} />
}
