import { useState, useEffect } from 'react';
import { ResponsivePie } from '@nivo/pie';
import { Card, CardTitle, CardBody, CardContent } from '../Card';
import { HardwareType } from '@/types/asset';

type Category = {
  _id: string;
  value: string;
};

type CategoryCount = {
  id: string;
  label: string;
  value: number;
  percentage: number;
  color: string;
};

const CategoryDistributionChart = ({
  categories,
  data,
  className,
}: {
  categories: Category[];
  data: HardwareType[];
  className?: string;
}) => {
  const [categoryCount, setCategoryCount] = useState<CategoryCount[]>([]);
  const theme = {
    labels: {
      text: {
        fill: 'currentColor',
      },
    },
    annotations: {
      text: {
        fontSize: 32,
        outlineColor: 'red',
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
    const categoryList = categories.map((category) => category.value);
    const counts: Record<string, number> = {};
    let total = 0;

    data.forEach((asset) => {
      const category = asset?.category;

      if (category && categoryList.includes(category)) {
        if (!counts[category]) counts[category] = 1;
        else counts[category]++;

        total++;
      }
    });

    const categoryCounts = Object.entries(counts).map(([category, count]) => ({
      id: category,
      label: category,
      value: count,
      percentage: (count / total) * 100,
      color: '',
    }));

    setCategoryCount(categoryCounts);
  }, [data, categories, setCategoryCount]);

  return (
    <Card className={className}>
      <CardContent>
        <CardTitle subtitle="Hardware Asset">
          Category Distribution Chart
        </CardTitle>
        <CardBody className="min-w-[450px] h-[300px] overflow-visible">
          <ResponsivePie
            data={categoryCount}
            margin={{ top: 10, right: 0, bottom: 10, left: 0 }}
            innerRadius={0.6}
            padAngle={0.7}
            cornerRadius={3}
            sortByValue={true}
            theme={theme}
            activeInnerRadiusOffset={5}
            activeOuterRadiusOffset={5}
            colors={{ scheme: 'set1' }}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]],
            }}
            transitionMode="startAngle"
            enableArcLinkLabels={true}
            arcLinkLabelsSkipAngle={11.5}
            arcLinkLabelsStraightLength={10}
            arcLabelsSkipAngle={10}
          />
          <div className="w-full h-full"></div>
        </CardBody>
      </CardContent>
    </Card>
  );
};

export default CategoryDistributionChart;
