'use client'

import React from 'react';
import { EmployeeColumns } from '@/components/tracker-ui/EmployeeColumns';
import { EmployeeTable } from '@/components/tracker-ui/EmployeeTable'
import * as imsService from '@/ims-service';
import { useQuery } from '@tanstack/react-query';
import { EmployeeType } from '@/types/employee';
import { EmployeeTableSuspense } from '@/components/tracker-ui/EmployeeTableSuspense';
import DeploymentInfo from '@/components/tracker-ui/DeploymentInfo';
import Filter from '@/components/graphics/Filter';
import { useParams } from 'react-router-dom';

const Tracker = () => {
  const { employeeCode } = useParams();
  const { data: employeeByUrl } = useQuery({
    queryKey: ['fetchEmployeeByCode', employeeCode], 
    queryFn: () => imsService.fetchEmployeeByCode(employeeCode || ''),
    enabled: !!employeeCode,
  });
  
  const [employees, setEmployees] = React.useState<EmployeeType[]>();
  const [selectedEmployee, setSelectedEmployee] = React.useState<EmployeeType>();

  const { data: registeredEmployees } = useQuery({ 
    queryKey: ['fetchEmployees'],
    queryFn: () => imsService.fetchAllEmployees(), 
  });
  const { data: unregisteredEmployees } = useQuery<string[]>({ 
    queryKey: ['fetch', 'assignee'], 
    queryFn: () => imsService.fetchAssetUniqueValuesByProperty('assignee'),
  });
  
  const handleEmployeeSelect = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
  };

  const mergeEmployees = () => {
    const allEmployees: EmployeeType[] = [];
    const employeesAdded = new Set<string>();
    // Add registered employees
    if (registeredEmployees) {
      registeredEmployees.forEach((employee: EmployeeType) => {
        const fullName = `${employee.firstName} ${employee.lastName}`;
        allEmployees.push({
          ...employee,
          name: `${employee.firstName} ${employee.lastName}`,
          isRegistered: true,
        });
          employeesAdded.add(fullName)
      });
    }
    // Add unregistered employees
    if (unregisteredEmployees) {
      unregisteredEmployees.forEach((name: string) => {
        const nameParts = name.split(' ');
        const lastName = nameParts.pop()!;
        const firstName = nameParts.join(' ');
        if (!employeesAdded.has(name)) {
          allEmployees.push({
            _id: '', // Assign a unique ID or leave it empty if it's not available
            code: '', // You can assign a code or leave it empty
            firstName: firstName,
            middleName: '',
            lastName: lastName,
            name: name,
            position: '',
            startDate: new Date(),
            isActive: true,
            isRegistered: false, // Set isActive to true for unregistered employees
          });
        }
      });
    }
    // Sort employees by registered status and then by name or code
    allEmployees.sort((a, b) => {
      // Sort by registered status: registered employees come first
      if (a.isRegistered !== b.isRegistered) {
        return a.isRegistered ? -1 : 1;
      }
      // If both are registered or unregistered, sort alphabetically by name or code
      return a.isRegistered ? a.code.localeCompare(b.code) : a.name.localeCompare(b.name);
    });

    return allEmployees;
  }

  const handleFilters = (filters: string[]) => {
    const allEmployees = mergeEmployees();
    if (!allEmployees) return; // Ensure employees data is available
  
    const filteredEmployees = allEmployees.filter((employee) => {
      if (!filters.includes('Active') && employee.isActive) return false;

      if (!filters.includes('Inactive') && !employee.isActive) return false;
  
      if (!filters.includes('Registered') && employee.isRegistered) return false;
  
      if (!filters.includes('Unregistered') && !employee.isRegistered) return false;
  
      // Check if the employee matches any additional filters
      const additionalFilters = filters.filter((filter) => !['Active', 'Inactive', 'Registered', 'Unregistered'].includes(filter));
      if (additionalFilters.length > 0) {
        return additionalFilters.some((filter) => {
          return Object.values(employee).some((value) => {
            if (filters.includes(filter)) {
              return value.toString() === filter;
            }
            return value.toString().toLowerCase().includes(filter.toLowerCase());
          });
        });
      }
  
      return true; // Include the employee if it matches all criteria
    });
  
    setEmployees(filteredEmployees);
  };
  
  React.useEffect(() => {
    const allEmployees = mergeEmployees();
    if (unregisteredEmployees) {
      setEmployees(allEmployees);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registeredEmployees, unregisteredEmployees])

  React.useEffect(() => {
    if (employeeCode) {
      setSelectedEmployee(employeeByUrl)
    }
  }, [employeeByUrl, employeeCode])

  return (
    <section id="tracker" className="flex gap-6 w-full px-6 pb-6 pt-3" style={{ height: 'calc(100vh - 91px)' }}>
      <aside className="order-first flex xl:w-80 z-50">
        {employees ? (
          <EmployeeTable
            columns={EmployeeColumns} 
            data={employees} 
            onEmployeeSelect={handleEmployeeSelect}
            onFilter={handleFilters}
          /> 
        ) : ( 
          <EmployeeTableSuspense />
        )}
      </aside>
      <main className="flex-1 flex flex-col gap-4 w-full">
        {selectedEmployee ? (
          <DeploymentInfo key={selectedEmployee._id} employee={selectedEmployee} assignee={selectedEmployee.code ? selectedEmployee.code : `${selectedEmployee.firstName} ${selectedEmployee.lastName}`} />
        ) : (
          <div className='w-full h-full flex flex-col justify-center items-center'>
            <Filter height={480} width={860} />
            <span className='text-accent-foreground'>Select an employee to view their deployed assets</span>
          </div>
        )}
      </main>
    </section>
  )
}

export default Tracker;