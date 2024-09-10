import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { HardwareType } from "@/types/asset";

interface LatestAssetsTableProps {
  data: HardwareType[]
}

const LatestAssetsTable = ({ data }: LatestAssetsTableProps) => {
  const latestAssets = [...data].reverse();

  console.log(latestAssets);
  return (
    <div>
      <Table>
        <TableCaption>List of the latest assets added.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Code</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead className="hidden md:table-cell">Serial Number</TableHead>
            <TableHead className="hidden md:table-cell">Model Name</TableHead>
            <TableHead className="">Added By</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className='hidden sm:table-cell py-2.5'>Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-xs">
          {latestAssets.map(asset => (
            <TableRow key={asset._id}>
              <TableCell className="w-[100px] px-2 py-2.5">{asset.code}</TableCell>
              <TableCell className="hidden sm:table-cell py-2.5">{asset.category}</TableCell>
              <TableCell className="hidden md:table-cell py-2.5 max-w-[250px] overflow-hidden text-ellipsis whitespace-nowrap">{asset.serialNo}</TableCell>
              <TableCell className="hidden md:table-cell py-2.5 max-w-[250px] overflow-hidden">{asset.modelName}</TableCell>
              <TableCell className="py-2.5 max-w-[250px] overflow-hidden text-ellipsis">{asset.createdBy}</TableCell>
              <TableCell className="py-2.5">{new Date(asset.created).toLocaleDateString()}</TableCell>
              <TableCell className="hidden sm:table-cell py-2.5">{new Date(asset.created).toLocaleTimeString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>   
    </div>
  )
}

export default LatestAssetsTable