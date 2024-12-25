'use client'

import PartyForm from '@/app/portal/parties/parties-form'
import { useQuery } from '@tanstack/react-query'
import { getParty } from '@/lib/actions'
import { TParty } from '@/schemas/party-schema'

interface IPartyPageProps {
  params: {
    id: string
  }
}

export default function PartyPage({ params }: IPartyPageProps) {
  const partyQuery = useQuery<TParty>({
    queryKey: ['party', params.id],
    queryFn: () => getParty(params.id),
    initialData: undefined,
    enabled: !!params.id,
  })

  if (partyQuery.isLoading) {
    return <div>Loading...</div>
  }

  if (partyQuery.isError) {
    return <div>Error loading party. Please try again later.</div>
  }

  return <PartyForm enableEdit={false} party={partyQuery.data} />
}
