import useEmployeeNameByCode from '@/hooks/useEmployeeNameByCode';

const EmployeeNameByCode = ({ employeeCode }: { employeeCode: string }) => {
  const { isLoading, name, isError } = useEmployeeNameByCode(employeeCode);

  if (isError) return <div>{employeeCode}</div>
  if (isLoading || name === 'Unknown') return <></>

  return <div className='w-full truncate'>{name}</div>;
};

export default EmployeeNameByCode;
