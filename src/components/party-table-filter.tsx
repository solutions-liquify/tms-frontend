import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { TParty } from '@/schemas/party-schema'

interface IPartyTableFilter {
  selectedItems: string[]
  setSelectedItems: (items: string[]) => void
  defaultItemsList: TParty[]
  title: string
}

export default function PartyTableFilter({ selectedItems, setSelectedItems, defaultItemsList, title }: IPartyTableFilter) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type={'button'} variant={'outline'} className={'border-dashed border-gray-400 h-8'}>
          <PlusCircleIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedItems.length > 2 && (
            <span className="ml-2 px-2 py-1 text-xs font-medium leading-none text-white bg-gray-600 rounded-md">{selectedItems.length} selected</span>
          )}
          {selectedItems.length <= 2 && selectedItems.length !== 0 && (
            <span className="ml-2 px-2 py-1 text-xs font-medium leading-none text-white bg-gray-600 rounded-md capitalize">
              {defaultItemsList
                .filter((party) => selectedItems.includes(party.id!))
                .map((party) => party.name)
                .join(', ')}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <div className="max-h-[70vh] overflow-y-auto">
          {defaultItemsList.map((party) => (
            <div
              className={'flex items-center space-x-2 hover:bg-gray-100 p-2 text-sm cursor-pointer capitalize'}
              key={party.id}
              onClick={() => {
                if (selectedItems.includes(party.id!)) {
                  setSelectedItems(selectedItems.filter((filteredItem) => filteredItem !== party.id))
                } else {
                  setSelectedItems([...selectedItems, party.id!])
                }
              }}
            >
              <input
                type={'checkbox'}
                className={'m-0 accent-black'}
                checked={selectedItems.includes(party.id!)}
                onChange={() => {
                  if (selectedItems.includes(party.id!)) {
                    setSelectedItems(selectedItems.filter((filteredItem) => filteredItem !== party.id))
                  } else {
                    setSelectedItems([...selectedItems, party.id!])
                  }
                }}
              />
              <p>{party.name}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
