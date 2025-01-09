import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { TTransportationCompany } from '@/schemas/transportation-company-schema'

interface ITransportationTableFilter {
  selectedItems: string[]
  setSelectedItems: (items: string[]) => void
  defaultItemsList: TTransportationCompany[]
  title: string
}

export default function TransportationTableFilter({ selectedItems, setSelectedItems, defaultItemsList, title }: ITransportationTableFilter) {
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
                .filter((company) => selectedItems.includes(company.id!))
                .map((company) => company.companyName)
                .join(', ')}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <div className="max-h-[70vh] overflow-y-auto">
          {defaultItemsList.map((company) => (
            <div
              className={'flex items-center space-x-2 hover:bg-gray-100 p-2 text-sm cursor-pointer capitalize'}
              key={company.id}
              onClick={() => {
                if (selectedItems.includes(company.id!)) {
                  setSelectedItems(selectedItems.filter((filteredItem) => filteredItem !== company.id))
                } else {
                  setSelectedItems([...selectedItems, company.id!])
                }
              }}
            >
              <input
                type={'checkbox'}
                className={'m-0 accent-black'}
                checked={selectedItems.includes(company.id!)}
                onChange={() => {
                  if (selectedItems.includes(company.id!)) {
                    setSelectedItems(selectedItems.filter((filteredItem) => filteredItem !== company.id))
                  } else {
                    setSelectedItems([...selectedItems, company.id!])
                  }
                }}
              />
              <p>{company.companyName}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
