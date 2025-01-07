import { cn } from '@/lib/utils'
import React from 'react'
import { Badge } from './ui/badge'

interface StatusBadgeProps {
  status: string
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  let badgeColor = 'bg-gray-100 text-gray-800' // Default gray for unknown status
  if (status === 'delivered') {
    badgeColor = 'bg-green-100 text-green-800 hover:bg-green-200'
  } else if (status === 'pending') {
    badgeColor = 'bg-amber-100 text-amber-800 hover:bg-amber-200'
  }
  return <Badge className={cn(badgeColor, 'cursor-pointer capitalize')}>{status}</Badge>
}

export default StatusBadge
