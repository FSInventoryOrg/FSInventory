import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { HardwareType } from '@/types/asset';
import { Card, CardTitle, CardBody, CardContent } from '../Card';

type Status = {
  _id: string;
  value: string;
};

type Category = {
  _id: string;
  value: string;
};

const StatusDistributionTable = ({
  statusData,
  categoryData,
  assets,
  className,
}: {
  statusData: Status[];
  categoryData: Category[];
  assets: HardwareType[];
  className?: string;
}) => {
  const statuses = statusData.map((status) => status.value);
  const categories = categoryData.map((category) => category.value);
  const counts: Record<string, Record<string, number>> = {};

  // Count the number of assets per category and status
  assets.forEach((asset) => {
    const status = asset?.status;
    const category = asset?.category;

    if (
      status !== undefined &&
      category !== undefined &&
      statuses.includes(status) &&
      categories.includes(category)
    ) {
      if (!counts[category]) counts[category] = {};

      if (!counts[category][status]) {
        counts[category][status] = 1;
      } else {
        counts[category][status]++;
      }
    }
  });

  // Count the total number of assets per status
  counts['Total per Status'] = {};
  statuses.forEach((status) => {
    categories.forEach((category) => {
      counts['Total per Status'][status] =
        (counts[category]?.[status] || 0) +
        (counts['Total per Status'][status] || 0);
    });
  });
  counts['Total per Status'].total = Object.values(
    counts['Total per Status']
  ).reduce((acc, curr) => acc + curr, 0);

  // Count the total number of assets per category
  categories.forEach((category) => {
    if (counts[category]) {
      counts[category].total = Object.values(counts[category]).reduce(
        (acc, curr) => acc + curr,
        0
      );
    }
  });

  return (
    <Card className={className}>
      <CardContent>
        <CardTitle subtitle="Hardware Asset">Status Distribution</CardTitle>
        <CardBody>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Category</TableHead>
                {statuses.map((status) => (
                  <TableHead key={status} className="text-right">
                    {status}
                  </TableHead>
                ))}
                <TableHead className="text-right font-bold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category}>
                  <TableCell className="text-left py-1">{category}</TableCell>
                  {statuses.map((status) => (
                    <TableCell key={status} className="text-right py-1">
                      {counts[category]?.[status] || '-'}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-bold py-1">
                    {counts[category]?.total || 0}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell className="text-left font-bold pb-1 pt-4">
                  Total per Status
                </TableCell>
                {statuses.map((status) => (
                  <TableCell
                    key={status}
                    className="text-right font-bold pb-1 pt-4"
                  >
                    {counts['Total per Status']?.[status] || '-'}
                  </TableCell>
                ))}
                <TableCell className="text-right font-bold pb-1 pt-4">
                  {counts['Total per Status']?.total || 0}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardBody>
      </CardContent>
    </Card>
  );
};

export default StatusDistributionTable;
