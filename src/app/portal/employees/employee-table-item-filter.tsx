import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'

interface IEmployeeTableItemFilter {
  selectedItems: string[]
  setSelectedItems: (employeeRoles: string[]) => void
  defaultItemsList: string[]
  title: string
}

export default function EmployeeTableItemFilter({ selectedItems, setSelectedItems, defaultItemsList, title }: IEmployeeTableItemFilter) {
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
            <span className="ml-2 px-2 py-1 text-xs  font-medium leading-none text-white bg-gray-600 rounded-md capitalize">{selectedItems.join(', ')}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <div>
          {defaultItemsList.map((item, idx) => (
            <div
              className={'flex items-center space-x-2 hover:bg-gray-100 p-2 text-sm cursor-pointer capitalize'}
              key={idx}
              onClick={() => {
                if (selectedItems.includes(item)) {
                  setSelectedItems(selectedItems.filter((filteredItem) => filteredItem !== item))
                } else {
                  setSelectedItems([...selectedItems, item])
                }
              }}
            >
              <input
                type={'checkbox'}
                className={'m-0 accent-black'}
                checked={selectedItems.includes(item)}
                onChange={() => {
                  if (selectedItems.includes(item)) {
                    setSelectedItems(selectedItems.filter((filteredItem) => filteredItem !== item))
                  } else {
                    setSelectedItems([...selectedItems, item])
                  }
                }}
              />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
