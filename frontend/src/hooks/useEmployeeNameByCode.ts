import * as imsService from '@/ims-service'
import { useQuery } from '@tanstack/react-query';

const useEmployeeNameByCode = (code: string) => {

  const { data: employee, isLoading, isError } = useQuery({
    queryKey: ['fetchEmployeeByCode', code], 
    queryFn: () => imsService.fetchEmployeeByCode(code),
    enabled: !!code
  });

  if (isLoading) {
    return { name: '', isLoading, isError };
  }

  if (!employee) {
    return { name: '', isLoading, isError };
  }

  if (isError) {
    return { name: code, isLoading, isError };
  }

  const name = `${employee.firstName} ${employee.lastName}`;
  return { name, isLoading, isError };
};

export default useEmployeeNameByCode;