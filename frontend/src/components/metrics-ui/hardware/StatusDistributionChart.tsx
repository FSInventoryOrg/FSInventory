import { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Card, CardTitle, CardBody, CardContent } from '../Card';
import { HardwareType } from '@/types/asset';

type Status = {
  _id: string;
  value: string;
  color: string;
};

type StatusCount = {
  id: string;
  label: string;
  value: number;
};

const StatusDistributionChart = ({
  statuses,
  data,
  className,
}: {
  statuses: Status[];
  data: HardwareType[];
  className?: string;
}) => {
  const [statusCount, setStatusCount] = useState<StatusCount[]>([]);

  const theme = {
    axis: {
      legend: {
        text: {
          fill: 'currentColor',
        },
      },
      ticks: {
        text: {
          fill: 'currentColor',
        },
        line: {
          stroke: 'currentColor',
          strokeWidth: 0.2,
        },
      },
    },
    grid: {
      line: {
        stroke: 'currentColor',
        strokeWidth: 0.2,
      },
    },
    labels: {
      text: {
        fill: 'currentColor',
      },
    },
    tooltip: {
      container: {
        background: '#ffffff',
        color: '#333333',
        fontSize: 12,
      },
    },
  };

  useEffect(() => {
    const statusList = statuses.map((status) => status.value);
    const counts: Record<string, number> = {};
    let total = 0;

    statusList.forEach((status) => {
      if (!counts[status]) counts[status] = 0;
    });

    data.forEach((asset) => {
      const status = asset?.status;

      if (status && statusList.includes(status)) {
        counts[status]++;
        total++;
      }
    });

    const statusCounts = Object.entries(counts).map(([status, count]) => ({
      id: status,
      label: status,
      value: count,
    }));

    statusCounts.push({
      id: 'Total',
      label: 'Total',
      value: total,
    });

    setStatusCount(statusCounts);
  }, [data, statuses, setStatusCount]);

  return (
    <Card className={className}>
      <CardContent>
        <CardTitle subtitle="Hardware Asset">
          Status Distribution Chart
        </CardTitle>
        <CardBody className="h-[300px] overflow-visible">
          <ResponsiveBar
            data={statusCount}
            padding={0.2}
            colors={{ scheme: 'category10' }}
            theme={theme}
            margin={{ top: 10, right: 10, bottom: 80, left: 60 }}
            enableLabel={true}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -50,
              truncateTickAt: 8,
              legend: 'Status',
              legendPosition: 'middle',
              legendOffset: 70,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Count',
              legendPosition: 'middle',
              legendOffset: -50,
            }}
          />
        </CardBody>
      </CardContent>
    </Card>
  );
};

export default StatusDistributionChart;
