import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import * as imsService from '@/ims-service';
import { useAppContext } from '@/hooks/useAppContext';

const defaultTrackedStatus = ['Shelved', 'IT Storage', 'ITS Storage'];
type StatusType = {
  _id: string;
  value: string;
  color: string;
  tracked: boolean;
};

const TrackedStatuses = () => {
  const queryClient = useQueryClient();
  const { showToast } = useAppContext();
  const [trackedStatus, setTrackedStatus] = useState<StatusType[]>([]);

  const { data: status, isLoading } = useQuery({
    queryKey: ['fetchOptionValues', 'status'],
    queryFn: () => imsService.fetchOptionValues('status'),
  });

  const { mutate: updateOptionValue } = useMutation({
    mutationFn: imsService.updateOptionValue,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['fetchOptionValues', 'status'],
      });
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: 'ERROR' });
    },
  });

  const handleOnCheckChange = (
    status: StatusType,
    value: boolean,
    index: number
  ) => {
    const updatedStatus = { ...status, tracked: value };
    updateOptionValue({
      property: 'status',
      value: updatedStatus,
      index: index,
    });
  };

  useEffect(() => {
    if (!isLoading) {
      const statuses = status.map((stat: StatusType) => {
        const isDefault = defaultTrackedStatus.includes(stat.value);
        const temp = {
          ...stat,
          tracked: isDefault ? true : stat?.tracked || false,
        };
        return temp;
      });

      setTrackedStatus(statuses);
    }
  }, [status, isLoading]);

  console.log(trackedStatus);

  return (
    <div className="pb-2">
      <h1 className="text-xl font-semibold">Tracked Statuses</h1>
      <h3 className="text-accent-foreground mb-2">
        Determines the statuses to track when asset count drops down a certain
        threshold.
      </h3>
      <div className="rounded-md border max-w-96">
        <Table className="text-xs">
          <TableHeader className="sticky bg-accent">
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead className="max-w-[50px]">Is Tracked?</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!isLoading &&
              trackedStatus?.map((status: StatusType, index: number) => (
                <TableRow key={status._id}>
                  <TableCell>{status.value}</TableCell>
                  <TableCell>
                    <Checkbox
                      checked={status.tracked}
                      disabled={defaultTrackedStatus.includes(status.value)}
                      onCheckedChange={(value: boolean) =>
                        handleOnCheckChange(status, value, index)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <Separator className="my-4" />
    </div>
  );
};

export default TrackedStatuses;
