import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Parties() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">Parties</p>
        <Link href="/portal/parties/create">
          <Button size={'sm'}>Add</Button>
        </Link>
      </div>
    </div>
  )
}
