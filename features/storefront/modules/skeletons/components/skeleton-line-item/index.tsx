import { TableRow, TableCell } from "@/components/ui/table"

const SkeletonLineItem = () => {
  return (
    <TableRow className="w-full m-4">
      <TableCell className="p-4 w-24">
        <div className="flex w-24 h-24 p-4 bg-gray-200 animate-pulse" />
      </TableCell>
      <TableCell className="text-left">
        <div className="flex flex-col gap-y-2">
          <div className="w-32 h-4 bg-gray-200 animate-pulse" />
          <div className="w-24 h-4 bg-gray-200 animate-pulse" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2 items-center">
          <div className="w-6 h-8 bg-gray-200 animate-pulse" />
          <div className="w-14 h-10 bg-gray-200 animate-pulse" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <div className="w-12 h-6 bg-gray-200 animate-pulse" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex gap-2 justify-end">
          <div className="w-12 h-6 bg-gray-200 animate-pulse" />
        </div>
      </TableCell>
    </TableRow>
  )
}

export default SkeletonLineItem
