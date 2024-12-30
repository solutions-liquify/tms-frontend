'use client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function DeliveryOrders() {
  const router = useRouter()

  const handleCreateClick = () => {
    router.push('/portal/delivery-orders/create')
  }

  return (
    <div className="font-semibold bg-gray-50 p-4 w-full">
      Delivery Orders
      <Button onClick={handleCreateClick} className="ml-4">
        Create
      </Button>
    </div>
  )
}
