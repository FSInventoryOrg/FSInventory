import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardTitle, CardBody, CardContent } from '../Card';

export type DataType = Record<string, Record<string, number>>;

const AssetTypeDistribution = ({
  title,
  equipmentTypes,
  data,
  className,
}: {
  title: string;
  equipmentTypes: string[];
  data: DataType;
  className?: string;
}) => {
  const rowItems = Object.keys(data || {}).reverse();

  return (
    <Card className={className}>
      <CardContent>
        <CardTitle subtitle="Hardware Asset">{`${title} Distribution`}</CardTitle>
        <CardBody>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center max-w-[160px]">
                  {title}
                </TableHead>
                {equipmentTypes.map((equipmentType) => (
                  <TableHead key={equipmentType} className="text-right">
                    {equipmentType}
                  </TableHead>
                ))}
                <TableHead className="text-right font-bold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rowItems.map((rowItem) => (
                <TableRow key={rowItem}>
                  <TableCell className="text-center py-1">{rowItem}</TableCell>
                  {equipmentTypes.map((equipmentType) => (
                    <TableCell key={equipmentType} className="text-right py-1">
                      {data[rowItem][equipmentType] || '-'}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold py-1">
                    {data[rowItem]?.total || '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </CardContent>
    </Card>
  );
};

export default AssetTypeDistribution;
