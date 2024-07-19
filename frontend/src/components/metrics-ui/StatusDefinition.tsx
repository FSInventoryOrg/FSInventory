import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardTitle, CardBody, CardContent } from './Card';

type Status = {
  _id: string;
  value: string;
  definition: string;
};

const StatusDefinitions: Record<string, string> = {
  Deployed: 'Deployed to a resource or employee.',
  'IT Storage': 'For deployment',
  Damaged: 'Damaged asset beyond. For Disposal.',
  'For Repair': 'Under repair by IT Manager.',
  Donated: '-',
  'Client Buyout': 'Client buyout',
  'MacBook Bundle': '-',
  'Windows Bundle': '-',
  Shelved: '-',
  Unaccounted: 'Lost or missing asset.',
};

const StatusDefinition = ({
  statusData,
  className,
}: {
  statusData: Status[];
  className?: string;
}) => {
  return (
    <Card className={className}>
      <CardContent>
        <CardTitle subtitle="Legend">Status Definition</CardTitle>
        <CardBody className="mt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Status</TableHead>
                <TableHead className="text-left">Definition</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {statusData.map((status) => (
                <TableRow key={status._id}>
                  <TableCell className="text-left py-1">
                    {status?.value}
                  </TableCell>
                  <TableCell className="text-left py-1">
                    {status?.definition || StatusDefinitions[status?.value]}
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

export default StatusDefinition;
