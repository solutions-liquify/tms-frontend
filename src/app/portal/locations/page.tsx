import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Locations() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Godown Locations</p>
        <Link href="/portal/locations/create">
          <Button size={'sm'}>Add</Button>
        </Link>
      </div>
    </div>
  )
}
