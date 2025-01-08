'use client'

import React from 'react'
import TransportationForm from '@/app/portal/transportation/transportation-form'

export default function CreateTransportation() {
  return (
    <div>
      <TransportationForm enableEdit={true} />
    </div>
  )
}
